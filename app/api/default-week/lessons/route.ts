import { NextRequest, NextResponse } from "next/server"
import sql from "@/lib/db"
import { requireRole } from "@/lib/auth"
import {
  normalizeClassColor,
  normalizeClassDetailsBackgroundColor,
  normalizeClassSlotColor,
} from "@/lib/class-colors"

export async function POST(req: NextRequest) {
  try {
    await requireRole("admin")
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await req.json().catch(() => ({}))
  const {
    day_of_week,
    start_time,
    end_time,
    student_user_id,
    language,
    teacher,
    color,
    details_background_color,
    slot_color,
    online,
  } = body ?? {}

  if (!day_of_week || !start_time || !end_time || !student_user_id) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }
  if (day_of_week < 1 || day_of_week > 7) {
    return NextResponse.json({ error: "day_of_week must be between 1 and 7" }, { status: 400 })
  }

  try {
    const [student] = await sql`
      SELECT id, nickname
      FROM public.users
      WHERE id = ${student_user_id} AND role = 'student'
      LIMIT 1
    `
    if (!student) {
      return NextResponse.json({ error: "Selected student account was not found" }, { status: 400 })
    }

    const [row] = await sql`
      INSERT INTO default_week_lessons (
        day_of_week,
        start_time,
        end_time,
        student_user_id,
        language,
        teacher,
        color,
        details_background_color,
        slot_color,
        online
      )
      VALUES (
        ${day_of_week},
        ${start_time},
        ${end_time},
        ${student_user_id},
        ${language ?? "Deutsch"},
        ${teacher ?? "Rosi Vaseva"},
        ${normalizeClassColor(color)},
        ${normalizeClassDetailsBackgroundColor(details_background_color)},
        ${normalizeClassSlotColor(slot_color)},
        ${Boolean(online)}
      )
      RETURNING
        id,
        day_of_week,
        start_time::text AS start_time,
        end_time::text AS end_time,
        student_user_id,
        language,
        teacher,
        color,
        details_background_color,
        slot_color,
        online
    `
    return NextResponse.json(row, { status: 201 })
  } catch (error) {
    const message =
      error instanceof Error && /relation "default_week_lessons" does not exist/i.test(error.message)
        ? "Default week tables are missing. Run the default-week migration."
        : error instanceof Error
          ? error.message
          : "Failed to create default week lesson"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
