"use client"

import type { EventRow } from "@/lib/db"
import { CalendarDays, Pencil, Trash2 } from "lucide-react"

type Props = {
  events: EventRow[]
  locale: string
  loading?: boolean
  isAdmin?: boolean
  onDelete?: (id: number) => void
  labels?: {
    title: string
    subtitle: string
    empty: string
    loading: string
    edit: string
    remove: string
  }
}

function formatEventDate(value: string, locale: string) {
  return new Date(value + "T12:00:00").toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function eventPreview(html: string, wordLimit = 16) {
  if (!html) return ""
  const doc = new DOMParser().parseFromString(html, "text/html")
  const text = (doc.body.textContent ?? "").replace(/\s+/g, " ").trim()
  if (!text) return ""
  const words = text.split(" ")
  if (words.length <= wordLimit) return text
  return `${words.slice(0, wordLimit).join(" ")}…`
}

export default function EventList({ events, locale, loading, isAdmin, onDelete, labels }: Props) {
  const resolved = labels ?? {
    title: "Events",
    subtitle: "News, announcements, and special dates.",
    empty: "No events yet.",
    loading: "Loading events...",
    edit: "Edit",
    remove: "Delete",
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">{resolved.title}</h2>
          <p className="text-xs text-muted-foreground">{resolved.subtitle}</p>
        </div>
      </div>

      {loading && (
        <div className="rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
          {resolved.loading}
        </div>
      )}

      {!loading && events.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-card p-4 text-sm text-muted-foreground">
          {resolved.empty}
        </div>
      )}

      {events.map((event) => (
        <article key={event.id} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-foreground">{event.title}</h3>
              {event.event_date && (
                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <CalendarDays size={14} />
                  <span>{formatEventDate(event.event_date, locale)}</span>
                </div>
              )}
            </div>
            {isAdmin && (
              <div className="flex items-center gap-2">
                <a
                  href={`/events/${event.id}/edit`}
                  className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs font-semibold text-foreground hover:bg-secondary"
                >
                  <Pencil size={12} />
                  {resolved.edit}
                </a>
                <button
                  type="button"
                  onClick={() => onDelete?.(event.id)}
                  className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs font-semibold text-destructive hover:bg-destructive/10"
                >
                  <Trash2 size={12} />
                  {resolved.remove}
                </button>
              </div>
            )}
          </div>

          {Array.isArray(event.images) && event.images.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              {event.images.slice(0, 4).map((src, index) => (
                <div key={`${event.id}-img-${index}`} className="overflow-hidden rounded-xl border border-border/70 bg-secondary">
                  <img src={src} alt={`${event.title} image ${index + 1}`} className="h-28 w-full object-cover" />
                </div>
              ))}
            </div>
          )}

          <p className="event-preview mt-3 text-sm text-foreground">
            {eventPreview(event.content_html)}
          </p>
        </article>
      ))}
    </div>
  )
}
