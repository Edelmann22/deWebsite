import { NextRequest, NextResponse } from "next/server"
import sql from "@/lib/db"
import { requireRole } from "@/lib/auth"
import {
  normalizeClassColor,
  normalizeClassDetailsBackgroundColor,
  normalizeClassSlotColor,
} from "@/lib/class-colors"

type Params = { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await requireRole("admin")
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { id } = await params
  const lessonId = Number(id)
  if (!lessonId) return NextResponse.json({ error: "Invalid lesson id" }, { status: 400 })

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

  if (day_of_week && (day_of_week < 1 || day_of_week > 7)) {
    return NextResponse.json({ error: "day_of_week must be between 1 and 7" }, { status: 400 })
  }

  const normalizedColor = color === undefined ? null : normalizeClassColor(color)
  const normalizedDetailsColor = details_background_color === undefined ? null : normalizeClassDetailsBackgroundColor(details_background_color)
  const normalizedSlotColor = slot_color === undefined ? null : normalizeClassSlotColor(slot_color)

  try {
    if (student_user_id) {
      const [student] = await sql`
        SELECT id
        FROM public.users
        WHERE id = ${student_user_id} AND role = 'student'
        LIMIT 1
      `
      if (!student) {
        return NextResponse.json({ error: "Selected student account was not found" }, { status: 400 })
      }
    }

    const [row] = await sql`
      UPDATE default_week_lessons
      SET
        day_of_week = COALESCE(${day_of_week}, day_of_week),
        start_time = COALESCE(${start_time}, start_time),
        end_time = COALESCE(${end_time}, end_time),
        student_user_id = COALESCE(${student_user_id}, student_user_id),
        language = COALESCE(${language}, language),
        teacher = COALESCE(${teacher}, teacher),
        color = COALESCE(${normalizedColor}, color),
        details_background_color = COALESCE(${normalizedDetailsColor}, details_background_color),
        slot_color = COALESCE(${normalizedSlotColor}, slot_color),
        online = COALESCE(${typeof online === "boolean" ? online : null}, online),
        updated_at = NOW()
      WHERE id = ${lessonId}
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

    if (!row) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
    }

    return NextResponse.json(row)
  } catch (error) {
    const message =
      error instanceof Error && /relation "default_week_lessons" does not exist/i.test(error.message)
        ? "Default week tables are missing. Run the default-week migration."
        : error instanceof Error
          ? error.message
          : "Failed to update default week lesson"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    await requireRole("admin")
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { id } = await params
  const lessonId = Number(id)
  if (!lessonId) return NextResponse.json({ error: "Invalid lesson id" }, { status: 400 })

  try {
    await sql`DELETE FROM default_week_lessons WHERE id = ${lessonId}`
    return NextResponse.json({ success: true })
  } catch (error) {
    const message =
      error instanceof Error && /relation "default_week_lessons" does not exist/i.test(error.message)
        ? "Default week tables are missing. Run the default-week migration."
        : error instanceof Error
          ? error.message
          : "Failed to delete default week lesson"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
