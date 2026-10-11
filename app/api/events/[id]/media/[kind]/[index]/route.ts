import { NextRequest, NextResponse } from "next/server"
import sharp from "sharp"
import sql, { type EventRow } from "@/lib/db"
import { decodeDataUri, findEventMedia, type EventMediaKind } from "@/lib/event-media"

type Params = { params: Promise<{ id: string; kind: string; index: string }> }

const MAX_WIDTH = 1600

// Small per-process cache so repeat views don't re-download the row from Neon.
const cache = new Map<string, { body: Buffer; type: string }>()
const CACHE_LIMIT = 40

// GET /api/events/:id/media/:kind/:index — serves an event photo stored as a data URI.
export async function GET(req: NextRequest, { params }: Params) {
  const { id, kind, index } = await params
  if (!/^\d+$/.test(id) || !/^\d+$/.test(index) || (kind !== "image" && kind !== "content")) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const cacheKey = `${id}/${kind}/${index}/${req.nextUrl.searchParams.get("v") ?? ""}`
  let entry = cache.get(cacheKey)

  if (!entry) {
    // Only pull the one column (or array element) this photo lives in.
    const [row] = (
      kind === "image"
        ? await sql`SELECT ARRAY[images[${Number(index) + 1}]] AS images, '' AS content_html FROM events WHERE id = ${id}`
        : await sql`SELECT '{}'::text[] AS images, content_html FROM events WHERE id = ${id}`
    ) as Pick<EventRow, "images" | "content_html">[]
    const source = row ? findEventMedia(row, kind as EventMediaKind, kind === "image" ? 0 : Number(index)) : null
    const decoded = source ? decodeDataUri(source) : null
    if (!decoded) return NextResponse.json({ error: "Not found" }, { status: 404 })

    entry = { body: decoded.buffer, type: decoded.mimeType }
    if (decoded.mimeType.startsWith("image/") && decoded.mimeType !== "image/svg+xml" && decoded.mimeType !== "image/gif") {
      try {
        const body = await sharp(decoded.buffer)
          .rotate()
          .resize({ width: MAX_WIDTH, withoutEnlargement: true })
          .webp({ quality: 80 })
          .toBuffer()
        entry = { body, type: "image/webp" }
      } catch {
        // Not something sharp can read; serve the original bytes.
      }
    }

    if (cache.size >= CACHE_LIMIT) cache.delete(cache.keys().next().value!)
    cache.set(cacheKey, entry)
  }

  return new NextResponse(new Uint8Array(entry.body), {
    headers: {
      "Content-Type": entry.type,
      // The URL carries the event's updated_at, so an edit produces a new URL.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}
