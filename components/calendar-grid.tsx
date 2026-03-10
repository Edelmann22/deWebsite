"use client"

import { ChevronLeft, ChevronRight, Laptop } from "lucide-react"
import type { ClassRow } from "@/lib/db"
import {
  normalizeClassColor,
  normalizeClassDetailsBackgroundColor,
  normalizeClassSlotColor,
} from "@/lib/class-colors"
import { LANGUAGE_META, type Language } from "@/lib/i18n"

const DAY_START_MINUTES = 6 * 60  // 06:00
const DAY_END_MINUTES   = 21 * 60 // 21:00

function toLocalDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`
}

function timeToMinutes(t: string) {
  const [h, m] = t.split(":").map(Number)
  return h * 60 + m
}

function minutesToLabel(totalMinutes: number) {
  const hour = Math.floor(totalMinutes / 60)
  const minute = totalMinutes % 60
  // 24-hour format, e.g. 13:00 instead of 1 PM
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
}

function minutesToInputValue(totalMinutes: number) {
  const hour = Math.floor(totalMinutes / 60)
  const minute = totalMinutes % 60
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
}

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
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`

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

  // Build dynamic time markers: base hour grid plus any class start/end times within the visible day range.
  const rawMarkers = new Set<number>()
  for (let h = DAY_START_MINUTES; h <= DAY_END_MINUTES; h += 60) {
    rawMarkers.add(h)
  }
  for (const c of classes) {
    const start = Math.max(DAY_START_MINUTES, timeToMinutes(c.start_time))
    const end = Math.min(DAY_END_MINUTES, timeToMinutes(c.end_time))
    if (start >= end) continue
    rawMarkers.add(start)
    rawMarkers.add(end)
  }
  const markers = Array.from(rawMarkers).sort((a, b) => a - b)
  const segments = markers.slice(0, -1).map((start, idx) => ({
    start,
    end: markers[idx + 1],
  }))

  const weekStartYear = normalizedWeekStart.getFullYear()
  const weekEnd = daysOfWeek[6]
  const formatWeekPart = (date: Date) =>
    new Intl.DateTimeFormat(locale, { month: "long", day: "numeric", year: "numeric" }).format(date)
  const headerLabel = `${formatWeekPart(normalizedWeekStart)} – ${formatWeekPart(weekEnd)}`
  const weekdayFormatter = new Intl.DateTimeFormat(LANGUAGE_META[language].locale, { weekday: "short" })

  return (
    <div className="flex flex-col gap-0">
      {/* Month navigation */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card rounded-t-2xl">
        <button onClick={onPrevWeek} aria-label={labels.previousWeek}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition">
          <ChevronLeft size={18} />
        </button>
        <div className="flex items-center gap-3">
          <h2 className="text-center text-lg font-bold text-foreground">
            {headerLabel}
          </h2>
          {viewerBadge && (
            <span className="rounded-full border border-border bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
              {viewerBadge}
            </span>
          )}
        </div>
        <button onClick={onNextWeek} aria-label={labels.nextWeek}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Header row: empty time column + weekdays */}
      <div className="grid grid-cols-[64px_repeat(7,minmax(0,1fr))] bg-muted/60 border-b border-border text-xs font-bold uppercase tracking-wider text-muted-foreground">
        <div className="py-2 pl-4">{labels.time}</div>
        {daysOfWeek.map((date) => {
          const dateStr = toLocalDateStr(date.getFullYear(), date.getMonth(), date.getDate())
          const isToday = dateStr === todayStr
          return (
            <div
              key={dateStr}
              className={`py-2 text-center border-l border-border first:border-l-0 ${
                isToday ? "bg-brand-light/60 text-foreground" : ""
              }`}
            >
              <div>{weekdayFormatter.format(date)}</div>
              <div className="mt-0.5 text-[11px] font-semibold text-foreground">
                {date.getMonth() + 1}/{date.getDate()}
              </div>
            </div>
          )
        })}
      </div>

      {/* Time grid */}
      <div className="max-h-[640px] overflow-y-auto">
        <div className="grid grid-cols-[64px_repeat(7,minmax(0,1fr))]">
          {segments.map((segment) => (
            <div key={segment.start} className="contents">
              {/* Time label column */}
              <div className="border-t border-border px-2 py-3 text-[11px] text-muted-foreground sticky left-0 bg-card/95 backdrop-blur-sm">
                {minutesToLabel(segment.start)}
              </div>
              {/* Day columns */}
              {daysOfWeek.map((date) => {
                const dateStr = toLocalDateStr(date.getFullYear(), date.getMonth(), date.getDate())
                const dayCls = classMap[dateStr] ?? []
                const segmentHasClass = dayCls.some((c) => {
                  const start = timeToMinutes(c.start_time)
                  const end = timeToMinutes(c.end_time)
                  return start < segment.end && end >= segment.start
                })
                const segmentHighlightClass = dayCls.find((c) => {
                  const start = timeToMinutes(c.start_time)
                  const end = timeToMinutes(c.end_time)
                  return start < segment.end && end >= segment.start
                })
                const slotClasses = dayCls.filter((c) => {
                  const start = timeToMinutes(c.start_time)
                  return start >= segment.start && start < segment.end
                })
                const isToday = dateStr === todayStr

                return (
                  <button
                    key={`${dateStr}-${segment.start}`}
                    type="button"
                    onClick={() => onSlotClick(dateStr, minutesToInputValue(segment.start))}
                    className={`relative border-t border-l border-border min-h-[56px] px-1.5 py-1 text-left align-top hover:bg-muted/50 transition ${
                      isToday ? "bg-brand-light/20" : "bg-card"
                    }`}
                  >
                    {segmentHasClass && segmentHighlightClass && (
                      <div
                        className="absolute inset-0 rounded-md pointer-events-none"
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
                            className={`rounded-md px-2 py-1 text-[11px] font-medium shadow-sm hover:opacity-90 ${
                              showClassTitles && c.title ? "truncate cursor-pointer" : "min-h-5"
                            }`}
                            style={{
                              backgroundColor: normalizeClassDetailsBackgroundColor(c.details_background_color),
                              color: normalizeClassColor(c.color),
                            }}
                            title={
                              showClassTitles && c.title
                                ? `${c.title} (${c.start_time.slice(0,5)}–${c.end_time.slice(0,5)})`
                                : undefined
                            }
                          >
                            {showClassTitles && c.title ? (
                              <span className="flex items-center gap-1">
                                {c.online && <Laptop size={11} className="shrink-0 opacity-80" />}
                                <span className="truncate">
                                  <span className="opacity-80">
                                    {c.start_time.slice(0, 5)}–{c.end_time.slice(0, 5)}
                                  </span>{" "}
                                  {c.title}
                                </span>
                              </span>
                            ) : (
                              <span className="flex items-center justify-center">
                                {c.online ? <Laptop size={11} /> : <span className="block h-3 w-5 rounded-full bg-current/25" />}
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
          ))}
        </div>
      </div>
    </div>
  )
}
