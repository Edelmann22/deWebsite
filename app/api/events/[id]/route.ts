import { NextRequest, NextResponse } from "next/server"
import sql from "@/lib/db"
import { getCurrentUser, requireRole } from "@/lib/auth"

type Params = { params: Promise<{ id: string }> }

// GET /api/events/:id
export async function GET(_req: NextRequest, { params }: Params) {
  const user = await getCurrentUser()
  if (!user || (user.role !== "admin" && user.role !== "student")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const [row] = await sql`
    SELECT
      id,
      title,
      content_html,
      images,
      event_date::text AS event_date,
      created_by_user_id,
      created_at,
      updated_at
    FROM events
    WHERE id = ${id}
  `
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(row)
}

// PATCH /api/events/:id
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await requireRole("admin")
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error && error.message === "UNAUTHORIZED" ? "Unauthorized" : "Forbidden" }, { status: error instanceof Error && error.message === "UNAUTHORIZED" ? 401 : 403 })
  }

  const { id } = await params
  const body = await req.json()
  const { title, content_html, images, event_date } = body
  const hasImages = Object.prototype.hasOwnProperty.call(body, "images")
  const hasEventDate = Object.prototype.hasOwnProperty.call(body, "event_date")

  const [row] = await sql`
    UPDATE events SET
      title = COALESCE(${title ?? null}, title),
      content_html = COALESCE(${content_html ?? null}, content_html),
      images = CASE
        WHEN ${hasImages} THEN ${Array.isArray(images) ? images : []}
        ELSE images
      END,
      event_date = CASE
        WHEN ${hasEventDate} THEN ${event_date ?? null}::date
        ELSE event_date
      END,
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING
      id,
      title,
      content_html,
      images,
      event_date::text AS event_date,
      created_by_user_id,
      created_at,
      updated_at
  `
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(row)
}

// DELETE /api/events/:id
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await requireRole("admin")
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error && error.message === "UNAUTHORIZED" ? "Unauthorized" : "Forbidden" }, { status: error instanceof Error && error.message === "UNAUTHORIZED" ? 401 : 403 })
  }

  const { id } = await params
  await sql`DELETE FROM events WHERE id = ${id}`
  return NextResponse.json({ success: true })
}
