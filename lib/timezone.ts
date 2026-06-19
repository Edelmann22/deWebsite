const WEEKDAY_TO_NUMBER: Record<string, number> = {
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
  Sun: 7,
}

export type ZonedDateParts = {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
  weekday: number // 1 = Monday, 7 = Sunday
}

export function getZonedDateParts(date: Date, timeZone: string): ZonedDateParts {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    weekday: "short",
  })
  const parts = formatter.formatToParts(date)
  const map: Record<string, string> = {}
  let weekdayLabel = "Mon"
  for (const part of parts) {
    if (part.type === "literal") continue
    if (part.type === "weekday") {
      weekdayLabel = part.value
      continue
    }
    map[part.type] = part.value
  }

  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour: Number(map.hour),
    minute: Number(map.minute),
    second: Number(map.second),
    weekday: WEEKDAY_TO_NUMBER[weekdayLabel] ?? 1,
  }
}

export function formatDateParts(parts: { year: number; month: number; day: number }) {
  return `${parts.year}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`
}

export function addDays(date: string, days: number) {
  const d = new Date(`${date}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return formatDateParts({ year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() })
}

export function getUpcomingWeekRange(now: Date, timeZone: string) {
  const local = getZonedDateParts(now, timeZone)
  const baseDate = formatDateParts(local)
  const daysUntilNextMonday = ((8 - local.weekday) % 7) || 7
  const weekStart = addDays(baseDate, daysUntilNextMonday)
  const weekEnd = addDays(weekStart, 7)
  return { weekStart, weekEnd }
}

export function isSundayMidnight(now: Date, timeZone: string, windowMinutes = 5) {
  const local = getZonedDateParts(now, timeZone)
  return local.weekday === 7 && local.hour === 0 && local.minute <= windowMinutes
}
