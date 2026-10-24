"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BRAND_RED, hand, serif } from "@/components/paper"
import type { TranslationDictionary } from "@/lib/i18n"
import type { EventRow } from "@/lib/db"

interface EventsSectionProps {
  events: EventRow[]
  eventsLoading: boolean
  onViewEventDetails: (eventId: number) => void
  t: TranslationDictionary
  locale: string
  // Heading above the list; omitted when the page already has one.
  title?: string
  // How many events to show; undefined shows all of them.
  limit?: number
}

function extractTextFromHtml(html: string) {
  const doc = new DOMParser().parseFromString(html, "text/html")
  return (doc.body.textContent ?? "").replace(/\s+/g, " ").trim()
}

function formatEventDate(dateString: string | null | undefined, locale: string) {
  if (!dateString) return null
  return new Date(dateString + "T12:00:00").toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default function EventsSection({ events, eventsLoading, onViewEventDetails, t, locale, title, limit }: EventsSectionProps) {
  const router = useRouter()
  const [loadingEventId, setLoadingEventId] = useState<number | null>(null)

  const handleEventClick = (eventId: number) => {
    setLoadingEventId(eventId)
    router.push(`/events/${eventId}`)
  }

  // Most recent first
  const sortedEvents = useMemo(
    () => [...events].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    [events],
  )

  const eventPreviews = useMemo(
    () =>
      Object.fromEntries(
        sortedEvents.map((event) => [event.id, extractTextFromHtml(event.content_html)]),
      ) as Record<number, string>,
    [sortedEvents],
  )

  return (
    <section id="events" className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-24">
      {title && (
        <h2 className={`${serif.className} mt-10 text-3xl sm:text-4xl font-semibold text-stone-900`}>{title}</h2>
      )}

      {eventsLoading ? (
        <p className={`${hand.className} py-20 text-center text-2xl text-stone-500`}>{t.eventsLoading}</p>
      ) : sortedEvents.length === 0 ? (
        <div className="py-20 text-center">
          <p className={`${serif.className} text-2xl font-semibold text-stone-900`}>{t.eventsEmpty}</p>
          <p className={`${hand.className} mt-3 text-2xl text-stone-500`}>{t.aboutSignature}</p>
        </div>
      ) : (
        <ul className="divide-y divide-stone-200">
          {sortedEvents.slice(0, limit ?? sortedEvents.length).map((event, index) => {
            const image = event.images?.[0]
            const date = formatEventDate(event.event_date, locale)
            return (
              <li key={event.id}>
                <button
                  type="button"
                  onClick={() => handleEventClick(event.id)}
                  className="group grid w-full grid-cols-1 sm:grid-cols-[9rem_1fr_auto] gap-x-8 gap-y-3 py-10 text-left focus:outline-none focus-visible:bg-white"
                >
                  <div className="sm:pt-1.5">
                    <p className={`${hand.className} ${BRAND_RED} text-2xl leading-tight`}>
                      {date ?? new Date(event.created_at).toLocaleDateString(locale, { month: "long", day: "numeric" })}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <h3 className={`${serif.className} text-2xl sm:text-[1.7rem] leading-snug font-semibold text-stone-900 group-hover:underline decoration-[#D10026] decoration-2 underline-offset-4`}>
                      {event.title}
                    </h3>
                    {eventPreviews[event.id] && (
                      <p className="mt-3 line-clamp-3 leading-relaxed text-stone-600">{eventPreviews[event.id]}</p>
                    )}
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-stone-900">
                      {loadingEventId === event.id ? t.eventsLoading : t.readMore}
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>

                  {image && (
                    <div
                      className={`order-first sm:order-none w-full sm:w-52 bg-white p-2 pb-3 shadow-[0_8px_24px_-10px_rgba(0,0,0,0.3)] transition-transform duration-300 group-hover:rotate-0 ${
                        index % 2 === 0 ? "sm:rotate-2" : "sm:-rotate-2"
                      }`}
                    >
                      <div className="aspect-[4/3] overflow-hidden bg-stone-100">
                        <img src={image} alt={event.title} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                      </div>
                      {event.images.length > 1 && (
                        <p className={`${hand.className} mt-1.5 text-center text-lg text-stone-500`}>
                          +{event.images.length - 1} {event.images.length - 1 === 1 ? t.eventPhoto : t.eventPhotos}
                        </p>
                      )}
                    </div>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {limit !== undefined && sortedEvents.length > limit && (
        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="rounded-md border-stone-300 bg-transparent px-7 text-stone-800 hover:bg-white"
            onClick={() => onViewEventDetails(-1)} // Special signal to show all events
          >
            {t.viewAllEvents}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </section>
  )
}
