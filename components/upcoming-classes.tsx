"use client"

import { BookOpen, Clock, User } from "lucide-react"
import type { ClassRow } from "@/lib/db"

type Props = {
  classes: ClassRow[]
  onClassClick: (cls: ClassRow) => void
  title: string
  locale: string
}

function formatTime(t: string) {
  const [h, m] = t.split(":")
  const hour = parseInt(h)
  const ampm = hour >= 12 ? "PM" : "AM"
  const h12  = hour % 12 === 0 ? 12 : hour % 12
  return `${h12}:${m} ${ampm}`
}

function formatDate(d: string, locale: string) {
  return new Date(d + "T12:00:00").toLocaleDateString(locale, {
    weekday: "short", month: "short", day: "numeric",
  })
}

export default function UpcomingClasses({ classes, onClassClick, title, locale }: Props) {
  const today = new Date().toISOString().slice(0, 10)
  const upcoming = classes
    .filter((c) => c.date >= today)
    .slice(0, 5)

  if (upcoming.length === 0) return null

  return (
    <aside className="flex flex-col gap-3">
      <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground px-1">{title}</h3>
      <div className="flex flex-col gap-2">
        {upcoming.map((c) => (
          <button
            key={c.id}
            onClick={() => onClassClick(c)}
            className="text-left bg-card border border-border rounded-xl p-4 hover:border-primary hover:shadow-sm transition group"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="font-semibold text-sm text-foreground group-hover:text-primary transition text-balance leading-snug">{c.title}</span>
              <span className="shrink-0 text-xs bg-brand-light text-primary font-semibold px-2 py-0.5 rounded-full">{c.language}</span>
            </div>
            <div className="mt-2 flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock size={11} />
                {formatDate(c.date, locale)} · {formatTime(c.start_time)} – {formatTime(c.end_time)}
              </span>
              {c.teacher && (
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <User size={11} />
                  {c.teacher}
                </span>
              )}
              {c.homework && (
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 truncate">
                  <BookOpen size={11} className="shrink-0" />
                  <span className="truncate">{c.homework}</span>
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </aside>
  )
}
