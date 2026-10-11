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
  // Last date (YYYY-MM-DD) the default week is applied to; null = no end date.
  active_until: string | null
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

// Furthest the default week may be applied ahead in one go.
export const MAX_GENERATE_DAYS = 366

let activeUntilColumn: Promise<unknown> | null = null

// Adds the active_until column to databases created before it existed.
function ensureActiveUntilColumn() {
  activeUntilColumn ??= sql`
    ALTER TABLE default_week_settings ADD COLUMN IF NOT EXISTS active_until DATE
  `.catch((error) => {
    activeUntilColumn = null
    throw error
  })
  return activeUntilColumn
}

export async function getDefaultWeekSettings() {
  await ensureActiveUntilColumn()
  const [row] = await sql`
    SELECT id, timezone, auto_generate, active_until::text AS active_until
    FROM default_week_settings
    ORDER BY id ASC
    LIMIT 1
  `
  if (row) return row as DefaultWeekSettings

  const [created] = await sql`
    INSERT INTO default_week_settings (timezone, auto_generate)
    VALUES ('UTC', TRUE)
    RETURNING id, timezone, auto_generate, active_until::text AS active_until
  `
  return created as DefaultWeekSettings
}

export async function updateDefaultWeekSettings(
  payload: Partial<Pick<DefaultWeekSettings, "timezone" | "auto_generate" | "active_until">>
) {
  const current = await getDefaultWeekSettings()
  const timezone = payload.timezone ?? current.timezone
  const autoGenerate = typeof payload.auto_generate === "boolean" ? payload.auto_generate : current.auto_generate
  const activeUntil = payload.active_until === undefined ? current.active_until : payload.active_until
  const [updated] = await sql`
    UPDATE default_week_settings
    SET timezone = ${timezone}, auto_generate = ${autoGenerate}, active_until = ${activeUntil}, updated_at = NOW()
    WHERE id = ${current.id}
    RETURNING id, timezone, auto_generate, active_until::text AS active_until
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

async function resolveCreatedBy(createdByUserId: number | null) {
  if (createdByUserId) return createdByUserId
  const [row] = await sql`SELECT id FROM public.users WHERE role = 'admin' ORDER BY id ASC LIMIT 1`
  return (row?.id as number | undefined) ?? null
}

// Replaces all classes from rangeStart up to and including rangeEnd
// with the default week lessons repeated over that range.
async function applyDefaultWeek(rangeStart: string, rangeEnd: string, createdByUserId: number | null) {
  const lessons = await getDefaultWeekLessons()
  if (lessons.length === 0) {
    return { created: 0, deleted: 0, skipped: true, reason: "Няма уроци по подразбиране" }
  }

  const resolvedCreatedBy = await resolveCreatedBy(createdByUserId)
  const rows = []
  // rangeStart is always a Monday, so day_of_week maps directly to an offset.
  for (let weekStart = rangeStart; weekStart <= rangeEnd; weekStart = addDays(weekStart, 7)) {
    for (const lesson of lessons) {
      const date = addDays(weekStart, lesson.day_of_week - 1)
      if (date > rangeEnd) continue
      rows.push({
        student_user_id: lesson.student_user_id,
        language: lesson.language,
        teacher: lesson.teacher,
        color: normalizeClassColor(lesson.color),
        details_background_color: normalizeClassDetailsBackgroundColor(lesson.details_background_color),
        slot_color: normalizeClassSlotColor(lesson.slot_color),
        online: Boolean(lesson.online),
        date,
        start_time: lesson.start_time,
        end_time: lesson.end_time,
      })
    }
  }

  const deletedResult = await sql`
    DELETE FROM classes WHERE date >= ${rangeStart} AND date <= ${rangeEnd}
    RETURNING id
  `

  if (rows.length > 0) {
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
      SELECT
        u.nickname,
        r.student_user_id,
        r.language,
        r.teacher,
        ${resolvedCreatedBy}::int,
        r.color,
        r.details_background_color,
        r.slot_color,
        r.online,
        r.date,
        r.start_time,
        r.end_time,
        '',
        ''
      FROM jsonb_to_recordset(${JSON.stringify(rows)}::jsonb) AS r(
        student_user_id INTEGER,
        language TEXT,
        teacher TEXT,
        color TEXT,
        details_background_color TEXT,
        slot_color TEXT,
        online BOOLEAN,
        date DATE,
        start_time TIME,
        end_time TIME
      )
      LEFT JOIN public.users u ON u.id = r.student_user_id
    `
  }

  return { created: rows.length, deleted: deletedResult.length, skipped: false }
}

// Fills the upcoming week (Mon–Sun), stopping at activeUntil when it falls inside that week.
export async function generateUpcomingWeek({
  now,
  timeZone,
  createdByUserId,
  activeUntil = null,
}: {
  now: Date
  timeZone: string
  createdByUserId: number | null
  activeUntil?: string | null
}) {
  const { weekStart, weekEnd } = getUpcomingWeekRange(now, timeZone)
  if (activeUntil && activeUntil < weekStart) {
    return { created: 0, deleted: 0, skipped: true, reason: "Крайната дата на седмицата по подразбиране е минала", weekStart, weekEnd }
  }

  const lastDay = addDays(weekEnd, -1)
  const rangeEnd = activeUntil && activeUntil < lastDay ? activeUntil : lastDay
  const result = await applyDefaultWeek(weekStart, rangeEnd, createdByUserId)
  return { ...result, weekStart, weekEnd: rangeEnd }
}

// Fills every week from the upcoming Monday up to and including `until`.
export async function generateWeeksUntil({
  now,
  timeZone,
  createdByUserId,
  until,
}: {
  now: Date
  timeZone: string
  createdByUserId: number | null
  until: string
}) {
  const { weekStart } = getUpcomingWeekRange(now, timeZone)
  if (until < weekStart) {
    return { created: 0, deleted: 0, skipped: true, reason: `Крайната дата трябва да е на или след ${weekStart}`, weekStart, weekEnd: until }
  }
  if (until > addDays(weekStart, MAX_GENERATE_DAYS)) {
    throw new Error(`Крайната дата може да е най-много ${MAX_GENERATE_DAYS} дни напред`)
  }

  const result = await applyDefaultWeek(weekStart, until, createdByUserId)
  return { ...result, weekStart, weekEnd: until }
}
