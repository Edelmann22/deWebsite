import { NextRequest, NextResponse } from "next/server"
import sql from "@/lib/db"
import {
  normalizeClassColor,
  normalizeClassDetailsBackgroundColor,
  normalizeClassSlotColor,
} from "@/lib/class-colors"
import { getCurrentUser, requireRole } from "@/lib/auth"

function sanitizeClassesForStudent<T extends Record<string, unknown>>(rows: T[]) {
  return rows.map((row) => ({
    ...row,
    title: "",
    teacher: "",
    lesson_notes: "",
    homework: "",
  }))
}

// GET /api/classes?from=YYYY-MM-DD&to=YYYY-MM-DD
//    or /api/classes?year=2025&month=6 (fallback)
export async function GET(req: NextRequest) {
  const user = await getCurrentUser()

  const { searchParams } = new URL(req.url)
  const from = searchParams.get("from")
  const to = searchParams.get("to")

  if (from && to) {
    const rows =
      user?.role === "student"
        ? await sql`
            SELECT
              classes.id,
              CASE
                WHEN classes.student_user_id = ${user.id} THEN COALESCE(public.users.nickname, classes.title)
                ELSE ''
              END AS title,
              classes.student_user_id,
              CASE
                WHEN classes.student_user_id = ${user.id} THEN classes.language
                ELSE ''
              END AS language,
              CASE
                WHEN classes.student_user_id = ${user.id} THEN classes.teacher
                ELSE ''
              END AS teacher,
              classes.color,
              classes.details_background_color,
              classes.slot_color,
              classes.online,
              classes.date::text AS date,
              to_char(classes.start_time, 'HH24:MI') AS start_time,
              to_char(classes.end_time, 'HH24:MI') AS end_time,
              CASE
                WHEN classes.student_user_id = ${user.id} THEN classes.lesson_notes
                ELSE ''
              END AS lesson_notes,
              CASE
                WHEN classes.student_user_id = ${user.id} THEN classes.homework
                ELSE ''
              END AS homework,
              classes.created_at,
              classes.updated_at
            FROM classes
            LEFT JOIN public.users ON public.users.id = classes.student_user_id
            WHERE date >= ${from} AND date < ${to}
            ORDER BY date ASC, start_time ASC
          `
        : await sql`
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
            WHERE date >= ${from} AND date < ${to}
            ORDER BY date ASC, start_time ASC
          `
    return NextResponse.json(user?.role === "admin" || user?.role === "student" ? rows : sanitizeClassesForStudent(rows))
  }

  const year = parseInt(searchParams.get("year") ?? String(new Date().getFullYear()))
  const month = parseInt(searchParams.get("month") ?? String(new Date().getMonth() + 1))

  // Month boundaries as plain dates to avoid timezone issues
  const start = `${year}-${String(month).padStart(2, "0")}-01`
  const nextMonth = month === 12 ? { year: year + 1, month: 1 } : { year, month: month + 1 }
  const end = `${nextMonth.year}-${String(nextMonth.month).padStart(2, "0")}-01` // first day of next month

  const rows =
    user?.role === "student"
      ? await sql`
          SELECT
            classes.id,
            CASE
              WHEN classes.student_user_id = ${user.id} THEN COALESCE(public.users.nickname, classes.title)
              ELSE ''
            END AS title,
            classes.student_user_id,
            CASE
              WHEN classes.student_user_id = ${user.id} THEN classes.language
              ELSE ''
            END AS language,
            CASE
              WHEN classes.student_user_id = ${user.id} THEN classes.teacher
              ELSE ''
            END AS teacher,
            classes.color,
            classes.details_background_color,
            classes.slot_color,
            classes.online,
            classes.date::text AS date,
            to_char(classes.start_time, 'HH24:MI') AS start_time,
            to_char(classes.end_time, 'HH24:MI') AS end_time,
            CASE
              WHEN classes.student_user_id = ${user.id} THEN classes.lesson_notes
              ELSE ''
            END AS lesson_notes,
            CASE
              WHEN classes.student_user_id = ${user.id} THEN classes.homework
              ELSE ''
            END AS homework,
            classes.created_at,
            classes.updated_at
          FROM classes
          LEFT JOIN public.users ON public.users.id = classes.student_user_id
          WHERE date >= ${start} AND date < ${end}
          ORDER BY date ASC, start_time ASC
        `
      : await sql`
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
          WHERE date >= ${start} AND date < ${end}
          ORDER BY date ASC, start_time ASC
        `
  return NextResponse.json(user?.role === "admin" || user?.role === "student" ? rows : sanitizeClassesForStudent(rows))
}

// POST /api/classes
export async function POST(req: NextRequest) {
  let userId: number
  try {
    const user = await requireRole("admin")
    userId = user.id
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error && error.message === "UNAUTHORIZED" ? "Unauthorized" : "Forbidden" }, { status: error instanceof Error && error.message === "UNAUTHORIZED" ? 401 : 403 })
  }

  const body = await req.json()
  const { student_user_id, language, teacher, color, details_background_color, slot_color, online, date, start_time, end_time, lesson_notes, homework } = body

  if (!student_user_id || !date || !start_time || !end_time) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
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
      INSERT INTO classes (title, student_user_id, language, teacher, created_by_user_id, color, details_background_color, slot_color, online, date, start_time, end_time, lesson_notes, homework)
      VALUES (${student.nickname}, ${student.id}, ${language ?? "German"}, ${teacher ?? "Teacher"}, ${userId}, ${normalizeClassColor(color)}, ${normalizeClassDetailsBackgroundColor(details_background_color)}, ${normalizeClassSlotColor(slot_color)}, ${Boolean(online)}, ${date}, ${start_time}, ${end_time}, ${lesson_notes ?? ""}, ${homework ?? ""})
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
    return NextResponse.json(row, { status: 201 })
  } catch (error) {
    const message =
      error instanceof Error && /column "student_user_id" of relation "classes" does not exist/i.test(error.message)
        ? "The classes table is missing the student_user_id column. Run the latest classes migration in Neon."
        : error instanceof Error && /column "created_by_user_id" of relation "classes" does not exist/i.test(error.message)
        ? "The classes table is missing the created_by_user_id column. Run the latest classes migration in Neon."
        : error instanceof Error && /column "online" of relation "classes" does not exist/i.test(error.message)
        ? "The classes table is missing the online column. Run the latest classes migration in Neon."
        : error instanceof Error
          ? error.message
          : "Failed to create class"

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
