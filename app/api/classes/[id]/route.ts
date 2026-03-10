import { NextRequest, NextResponse } from "next/server"
import sql from "@/lib/db"
import {
  normalizeClassColor,
  normalizeClassDetailsBackgroundColor,
  normalizeClassSlotColor,
} from "@/lib/class-colors"
import { getCurrentUser, requireRole } from "@/lib/auth"

type Params = { params: Promise<{ id: string }> }

// GET /api/classes/:id
export async function GET(_req: NextRequest, { params }: Params) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { id } = await params
  const [row] =
    user.role === "admin"
      ? await sql`
          SELECT
            classes.id,
            COALESCE(public.users.nickname, classes.title) AS title,
            classes.student_user_id,
            classes.language,
            classes.teacher,
            classes.color,
            classes.details_background_color,
            classes.slot_color,
            classes.online,
            classes.date::text AS date,
            to_char(classes.start_time, 'HH24:MI') AS start_time,
            to_char(classes.end_time, 'HH24:MI') AS end_time,
            classes.lesson_notes,
            classes.homework,
            classes.created_at,
            classes.updated_at
          FROM classes
          LEFT JOIN public.users ON public.users.id = classes.student_user_id
          WHERE classes.id = ${id}
        `
      : await sql`
          SELECT
            COALESCE(public.users.nickname, classes.title) AS title,
            classes.student_user_id,
            classes.id,
            classes.language,
            classes.teacher,
            classes.color,
            classes.details_background_color,
            classes.slot_color,
            classes.online,
            classes.date::text AS date,
            to_char(classes.start_time, 'HH24:MI') AS start_time,
            to_char(classes.end_time, 'HH24:MI') AS end_time,
            classes.lesson_notes,
            classes.homework,
            classes.created_at,
            classes.updated_at
          FROM classes
          LEFT JOIN public.users ON public.users.id = classes.student_user_id
          WHERE classes.id = ${id}
            AND classes.student_user_id = ${user.id}
        `
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(row)
}

// PATCH /api/classes/:id
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await requireRole("admin")
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error && error.message === "UNAUTHORIZED" ? "Unauthorized" : "Forbidden" }, { status: error instanceof Error && error.message === "UNAUTHORIZED" ? 401 : 403 })
  }

  const { id } = await params
  const body = await req.json()
  const { student_user_id, language, teacher, color, details_background_color, slot_color, online, date, start_time, end_time, lesson_notes, homework } = body

  const student =
    student_user_id != null
      ? await sql`
          SELECT id, nickname
          FROM public.users
          WHERE id = ${student_user_id} AND role = 'student'
          LIMIT 1
        `
      : null
  const resolvedStudent = student?.[0] ?? null

  const [row] = await sql`
    UPDATE classes SET
      title        = COALESCE(${resolvedStudent?.nickname ?? null}, title),
      student_user_id = COALESCE(${resolvedStudent?.id ?? null}, student_user_id),
      language     = COALESCE(${language     ?? null}, language),
      teacher      = COALESCE(${teacher      ?? null}, teacher),
      color        = COALESCE(${color != null ? normalizeClassColor(color) : null}, color),
      details_background_color = COALESCE(${details_background_color != null ? normalizeClassDetailsBackgroundColor(details_background_color) : null}, details_background_color),
      slot_color   = COALESCE(${slot_color != null ? normalizeClassSlotColor(slot_color) : null}, slot_color),
      online       = COALESCE(${online != null ? Boolean(online) : null}, online),
      date         = COALESCE(${date         ?? null}::date, date),
      start_time   = COALESCE(${start_time   ?? null}::time, start_time),
      end_time     = COALESCE(${end_time     ?? null}::time, end_time),
      lesson_notes = COALESCE(${lesson_notes ?? null}, lesson_notes),
      homework     = COALESCE(${homework     ?? null}, homework),
      updated_at   = NOW()
    WHERE id = ${id}
    RETURNING
      id,
      title,
      student_user_id,
      language,
      teacher,
      color,
      details_background_color,
      slot_color,
      online,
      date::text AS date,
      to_char(start_time, 'HH24:MI') AS start_time,
      to_char(end_time, 'HH24:MI') AS end_time,
      lesson_notes,
      homework,
      created_at,
      updated_at
  `
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(row)
}

// DELETE /api/classes/:id
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await requireRole("admin")
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error && error.message === "UNAUTHORIZED" ? "Unauthorized" : "Forbidden" }, { status: error instanceof Error && error.message === "UNAUTHORIZED" ? 401 : 403 })
  }

  const { id } = await params
  await sql`DELETE FROM classes WHERE id = ${id}`
  return NextResponse.json({ success: true })
}
