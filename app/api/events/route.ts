import { NextRequest, NextResponse } from "next/server"
import sql from "@/lib/db"
import { getCurrentUser, requireRole } from "@/lib/auth"

// GET /api/events
export async function GET(_req: NextRequest) {
  await getCurrentUser()

  const rows = await sql`
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
    ORDER BY event_date DESC NULLS LAST, created_at DESC
  `

  return NextResponse.json(rows)
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
  const { title, content_html, images, event_date } = body

  if (!title || !content_html) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  try {
    const [row] = await sql`
      INSERT INTO events (title, content_html, images, event_date, created_by_user_id)
      VALUES (${title}, ${content_html}, ${Array.isArray(images) ? images : []}, ${event_date ?? null}, ${userId})
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
