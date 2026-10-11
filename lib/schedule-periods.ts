export const SCHEDULE_PERIODS = [
  { period: "8:00 - 9:30" },
  { period: "9:30 - 11:00" },
  { period: "11:00 - 12:30" },
  { period: "13:30 - 15:00" },
  { period: "15:00 - 16:30" },
  { period: "16:30 - 18:00" },
  { period: "18:00 - 19:30" },
] as const

export function getScheduleTimes(periodLabel: string) {
  const match = periodLabel.match(/^(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})$/)
  if (!match) return null

  return {
    start: match[1].padStart(5, "0"),
    end: match[2].padStart(5, "0"),
  }
}

// Accepts "8:00", "08:00" or "08:00:00" (Postgres TIME) and returns "HH:MM".
export function normalizeScheduleTime(time: string) {
  const match = time.match(/^(\d{1,2}):(\d{2})/)
  if (!match) return time
  return `${match[1].padStart(2, "0")}:${match[2]}`
}

// Finds the period that starts at the given time.
export function findSchedulePeriodByStart(startTime: string) {
  const start = normalizeScheduleTime(startTime)
  for (const period of SCHEDULE_PERIODS) {
    const times = getScheduleTimes(period.period)
    if (times?.start === start) return { label: period.period, ...times }
  }
  return null
}

// Label of the period matching start (and end, when given), or "" if none matches.
export function getSchedulePeriodLabel(startTime: string, endTime?: string) {
  const period = findSchedulePeriodByStart(startTime)
  if (!period) return ""
  if (endTime && period.end !== normalizeScheduleTime(endTime)) return ""
  return period.label
}

export function isValidSchedulePeriod(startTime: string, endTime: string) {
  return getSchedulePeriodLabel(startTime, endTime) !== ""
}

export function isValidScheduleStartTime(time: string) {
  return findSchedulePeriodByStart(time) !== null
}

export function getDefaultSchedulePeriod() {
  return SCHEDULE_PERIODS[0]
}