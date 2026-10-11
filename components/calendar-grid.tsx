"use client"

import { ChevronLeft, ChevronRight, Laptop } from "lucide-react"
import type { ClassRow } from "@/lib/db"
import {
  normalizeClassColor,
  normalizeClassDetailsBackgroundColor,
  normalizeClassSlotColor,
} from "@/lib/class-colors"
import { LANGUAGE_META, type Language } from "@/lib/i18n"
import { SCHEDULE_PERIODS, getScheduleTimes } from "@/lib/schedule-periods"

function toLocalDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

function timeToMinutes(t: string) {
  const [h, m] = t.split(":").map(Number)
  return h * 60 + m
}

type Segment = { label: string; start: number; end: number }

// Built once, from SCHEDULE_PERIODS only. Duplicate labels are dropped,
// so each period can appear at most once in the grid.
const SEGMENTS: Segment[] = Array.from(
  new Set(SCHEDULE_PERIODS.map((p) => p.period))
).flatMap((label) => {
  const times = getScheduleTimes(label)
  if (!times) return []
  return [{ label, start: timeToMinutes(times.start), end: timeToMinutes(times.end) }]
})

type Props = {
  classes: ClassRow[]
  language: Language
  locale: string
  labels: {
    time: string
    previousWeek: string
    nextWeek: string
  }
  viewerBadge?: string
  showClassTitles?: boolean
  weekStart: Date
  onPrevWeek: () => void
  onNextWeek: () => void
  onSlotClick: (dateStr: string, startTime: string) => void
  onClassClick: (cls: ClassRow) => void
}

export default function CalendarGrid({
  classes,
  language,
  locale,
  labels,
  viewerBadge,
  showClassTitles = true,
  weekStart,
  onPrevWeek,
  onNextWeek,
  onSlotClick,
  onClassClick,
}: Props) {
  const today = new Date()
  const todayStr = toLocalDateStr(today.getFullYear(), today.getMonth(), today.getDate())

  const normalizedWeekStart = new Date(weekStart)
  normalizedWeekStart.setHours(0, 0, 0, 0)

  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(normalizedWeekStart)
    d.setDate(normalizedWeekStart.getDate() + i)
    return d
  })

  const classMap: Record<string, ClassRow[]> = {}
  for (const c of classes) {
    const key = c.date.slice(0, 10)
    if (!classMap[key]) classMap[key] = []
    classMap[key].push(c)
  }

  const weekEnd = daysOfWeek[6]
  const formatWeekPart = (date: Date) =>
    new Intl.DateTimeFormat(locale, { month: "long", day: "numeric", year: "numeric" }).format(date)
  const headerLabel = `${formatWeekPart(normalizedWeekStart)} – ${formatWeekPart(weekEnd)}`
  const weekdayFormatter = new Intl.DateTimeFormat(LANGUAGE_META[language].locale, { weekday: "short" })
  const dayMonthFormatter = new Intl.DateTimeFormat(LANGUAGE_META[language].locale, { day: "numeric", month: "numeric" })

  return (
    <div className="flex flex-col">
      {/* Week navigation */}
      <div className="flex items-center justify-between gap-2 border-b border-border bg-card px-3 py-3 sm:px-5">
        <button
          onClick={onPrevWeek}
          aria-label={labels.previousWeek}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="flex min-w-0 flex-col items-center gap-1 sm:flex-row sm:gap-3">
          <h2 className="truncate text-center text-sm font-semibold text-foreground sm:text-base">{headerLabel}</h2>
          {viewerBadge && (
            <span className="shrink-0 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
              {viewerBadge}
            </span>
          )}
        </div>
        <button
          onClick={onNextWeek}
          aria-label={labels.nextWeek}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Header and rows share one scroll container so columns always line up */}
      <div className="max-h-[640px] overflow-auto">
        <div className="grid min-w-[720px] grid-cols-[76px_repeat(7,minmax(0,1fr))]">
          {/* Header row: time column + weekdays */}
          <div className="sticky left-0 top-0 z-30 flex items-end border-b border-border bg-muted px-3 pb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {labels.time}
          </div>
          {daysOfWeek.map((date) => {
            const dateStr = toLocalDateStr(date.getFullYear(), date.getMonth(), date.getDate())
            const isToday = dateStr === todayStr
            return (
              <div
                key={dateStr}
                className="sticky top-0 z-20 flex flex-col items-center gap-0.5 border-b border-l border-border bg-muted py-2"
              >
                <span
                  className={`text-[11px] font-semibold uppercase tracking-wide ${
                    isToday ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {weekdayFormatter.format(date)}
                </span>
                <span
                  className={`rounded-md px-1.5 text-sm font-semibold tabular-nums ${
                    isToday ? "bg-primary text-primary-foreground" : "text-foreground"
                  }`}
                >
                  {dayMonthFormatter.format(date)}
                </span>
              </div>
            )
          })}

          {/* Time grid: exactly one row per entry in SEGMENTS */}
          {SEGMENTS.map((segment) => {
            const [labelStart, labelEnd] = segment.label.split("-").map((part) => part.trim())

            return (
              <div key={segment.label} className="contents">
                {/* Time label column */}
                <div className="sticky left-0 z-10 flex flex-col justify-center border-t border-border bg-card px-3 py-2 tabular-nums leading-tight">
                  <span className="text-xs font-semibold text-foreground">{labelStart}</span>
                  <span className="text-[11px] text-muted-foreground">{labelEnd}</span>
                </div>

                {/* Day columns */}
                {daysOfWeek.map((date) => {
                  const dateStr = toLocalDateStr(date.getFullYear(), date.getMonth(), date.getDate())
                  const dayCls = classMap[dateStr] ?? []

                  // Class overlaps this segment (end is exclusive, so a class
                  // ending exactly at the segment start does not count).
                  const segmentHighlightClass = dayCls.find((c) => {
                    const start = timeToMinutes(c.start_time)
                    const end = timeToMinutes(c.end_time)
                    return start < segment.end && end > segment.start
                  })

                  // Class is shown in the segment where it starts.
                  const slotClasses = dayCls.filter((c) => {
                    const start = timeToMinutes(c.start_time)
                    return start >= segment.start && start < segment.end
                  })

                  const isToday = dateStr === todayStr

                  return (
                    <button
                      key={`${dateStr}-${segment.label}`}
                      type="button"
                      onClick={() => {
                        // An occupied slot opens its class; only empty slots create a new one.
                        if (segmentHighlightClass) {
                          if (showClassTitles && segmentHighlightClass.title) onClassClick(segmentHighlightClass)
                          return
                        }
                        const times = getScheduleTimes(segment.label)
                        if (times) onSlotClick(dateStr, times.start)
                      }}
                      className={`group relative min-h-[60px] rounded-none border-l border-t border-border p-1 text-left align-top hover:bg-muted/60 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring ${
                        isToday ? "bg-brand-light/40" : "bg-card"
                      }`}
                    >
                      {segmentHighlightClass && (
                        <div
                          className="pointer-events-none absolute inset-0"
                          style={{ backgroundColor: normalizeClassSlotColor(segmentHighlightClass.slot_color) }}
                        />
                      )}
                      {slotClasses.length > 0 && (
                        <div className="relative z-10 flex flex-col gap-1">
                          {slotClasses.map((c) => (
                            <div
                              key={c.id}
                              onClick={(e) => {
                                e.stopPropagation()
                                if (showClassTitles && c.title) onClassClick(c)
                              }}
                              className={`rounded border-l-[3px] px-1.5 py-1 text-xs font-medium leading-snug shadow-[0_1px_1px_rgb(0_0_0/0.06)] ${
                                showClassTitles && c.title ? "cursor-pointer hover:brightness-95" : "min-h-6"
                              }`}
                              style={{
                                backgroundColor: normalizeClassDetailsBackgroundColor(c.details_background_color),
                                borderLeftColor: normalizeClassColor(c.color),
                                color: normalizeClassColor(c.color),
                              }}
                              title={showClassTitles && c.title ? c.title : undefined}
                            >
                              {showClassTitles && c.title ? (
                                <span className="flex min-w-0 items-center gap-1">
                                  {c.online && <Laptop size={12} className="shrink-0 opacity-80" />}
                                  <span className="line-clamp-2 break-words">{c.title}</span>
                                </span>
                              ) : (
                                <span className="flex items-center justify-center">
                                  {c.online ? (
                                    <Laptop size={12} />
                                  ) : (
                                    <span className="block h-3 w-5 rounded-sm bg-current/25" />
                                  )}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}