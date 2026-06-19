import sql from "@/lib/db"
import {
  normalizeClassColor,
  normalizeClassDetailsBackgroundColor,
  normalizeClassSlotColor,
} from "@/lib/class-colors"
import { addDays, getUpcomingWeekRange } from "@/lib/timezone"

export type DefaultWeekSettings = {
  id: number
  timezone: string
  auto_generate: boolean
}

export type DefaultWeekLesson = {
  id: number
  day_of_week: number
  start_time: string
  end_time: string
  student_user_id: number
  language: string
  teacher: string
  color: string
  details_background_color: string
  slot_color: string
  online: boolean
}

export async function getDefaultWeekSettings() {
  const [row] = await sql`
    SELECT id, timezone, auto_generate
    FROM default_week_settings
    ORDER BY id ASC
    LIMIT 1
  `
  if (row) return row as DefaultWeekSettings

  const [created] = await sql`
    INSERT INTO default_week_settings (timezone, auto_generate)
    VALUES ('UTC', TRUE)
    RETURNING id, timezone, auto_generate
  `
  return created as DefaultWeekSettings
}

export async function updateDefaultWeekSettings(payload: Partial<Pick<DefaultWeekSettings, "timezone" | "auto_generate">>) {
  const current = await getDefaultWeekSettings()
  const timezone = payload.timezone ?? current.timezone
  const autoGenerate = typeof payload.auto_generate === "boolean" ? payload.auto_generate : current.auto_generate
  const [updated] = await sql`
    UPDATE default_week_settings
    SET timezone = ${timezone}, auto_generate = ${autoGenerate}, updated_at = NOW()
    WHERE id = ${current.id}
    RETURNING id, timezone, auto_generate
  `
  return updated as DefaultWeekSettings
}

export async function getDefaultWeekLessons() {
  const rows = await sql`
    SELECT
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
    FROM default_week_lessons
    ORDER BY day_of_week ASC, start_time ASC
  `
  return rows as DefaultWeekLesson[]
}

export async function generateUpcomingWeek({
  now,
  timeZone,
  createdByUserId,
}: {
  now: Date
  timeZone: string
  createdByUserId: number | null
}) {
  let resolvedCreatedBy = createdByUserId
  if (!resolvedCreatedBy) {
    const [row] = await sql`SELECT id FROM public.users WHERE role = 'admin' ORDER BY id ASC LIMIT 1`
    resolvedCreatedBy = row?.id ?? null
  }

  const { weekStart, weekEnd } = getUpcomingWeekRange(now, timeZone)

  // Delete existing classes in the target week range
  const deletedResult = await sql`
    DELETE FROM classes WHERE date >= ${weekStart} AND date < ${weekEnd}
    RETURNING id
  `
  const deletedCount = deletedResult.length

  const lessons = await getDefaultWeekLessons()
  if (lessons.length === 0) {
    return { created: 0, deleted: deletedCount, skipped: true, reason: "No default lessons", weekStart, weekEnd }
  }

  let created = 0
  for (const lesson of lessons) {
    const date = addDays(weekStart, lesson.day_of_week - 1)
    await sql`
      INSERT INTO classes (
        title,
        student_user_id,
        language,
        teacher,
        created_by_user_id,
        color,
        details_background_color,
        slot_color,
        online,
        date,
        start_time,
        end_time,
        lesson_notes,
        homework
      )
      VALUES (
        (SELECT nickname FROM public.users WHERE id = ${lesson.student_user_id}),
        ${lesson.student_user_id},
        ${lesson.language},
        ${lesson.teacher},
        ${resolvedCreatedBy},
        ${normalizeClassColor(lesson.color)},
        ${normalizeClassDetailsBackgroundColor(lesson.details_background_color)},
        ${normalizeClassSlotColor(lesson.slot_color)},
        ${Boolean(lesson.online)},
        ${date},
        ${lesson.start_time},
        ${lesson.end_time},
        '',
        ''
      )
    `
    created += 1
  }

  return { created, deleted: deletedCount, skipped: false, weekStart, weekEnd }
}
