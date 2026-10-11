import { NextRequest, NextResponse } from "next/server"
import sql, { type EventRow } from "@/lib/db"
import { LIGHT_EVENT_COLUMNS, withMediaUrls } from "@/lib/event-media"
import { requireRole } from "@/lib/auth"
import { isEventCategory, normalizeEventCategory } from "@/lib/event-categories"

// GET /api/events
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const limit = searchParams.get("limit")
  const limitNum = limit ? Number.parseInt(limit, 10) : null
  const category = searchParams.get("category")

  // Add response headers for caching
  const headers = new Headers({
    'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=300',
    'Content-Type': 'application/json'
  })

  try {
    const normalizedCategory = category ? normalizeEventCategory(category) : null
    const where = normalizedCategory && isEventCategory(category ?? "")
      ? sql`WHERE category = ${normalizedCategory}`
      : category
        ? sql`WHERE category = ${normalizedCategory}`
        : sql``

    const limitClause = limitNum && limitNum > 0 ? sql`LIMIT ${limitNum}` : sql``
    const rows = (await sql`
      SELECT ${sql.unsafe(LIGHT_EVENT_COLUMNS)}
      FROM events
      ${where}
      ORDER BY created_at DESC
      ${limitClause}
    `) as EventRow[]

    return NextResponse.json(rows.map(withMediaUrls), { headers })
  } catch (error) {
    console.error('Database error in GET /api/events:', error)
    return NextResponse.json(
      { error: "Failed to fetch events" },
      {
        status: 503,
        headers: {
          'Cache-Control': 'no-store',
        },
      },
    )
  }
}

// POST /api/events
export async function POST(req: NextRequest) {
  let userId: number
  try {
    const user = await requireRole("admin")
    userId = user.id
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error && error.message === "UNAUTHORIZED" ? "Unauthorized" : "Forbidden" }, { status: error instanceof Error && error.message === "UNAUTHORIZED" ? 401 : 403 })
  }

  const body = await req.json()
  const { title, category, content_html, images, event_date } = body
  const normalizedCategory = normalizeEventCategory(category)

  if (!title || !content_html) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  try {
    const [row] = await sql`
      INSERT INTO events (title, category, content_html, images, event_date, created_by_user_id)
      VALUES (${title}, ${normalizedCategory}, ${content_html}, ${Array.isArray(images) ? images : []}, ${event_date ?? null}, ${userId})
      RETURNING
        id,
        title,
        category,
        content_html,
        images,
        event_date::text AS event_date,
        created_by_user_id,
        created_at,
        updated_at
    `
    return NextResponse.json(row, { status: 201 })
  } catch (error) {
    const message =
      error instanceof Error && /relation "events" does not exist/i.test(error.message)
        ? "The events table is missing. Run the latest migrations in Neon."
        : error instanceof Error
          ? error.message
          : "Failed to create event"

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
