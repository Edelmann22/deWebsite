"use client"

import Link from "next/link"
import EventsSection from "@/components/sections/events-section"
import { PAPER_BG, PageIntro, PaperHeader } from "@/components/paper"
import { getEventCategoryLabel, type EventCategory } from "@/lib/event-categories"
import { useLanguage } from "@/hooks/use-language"
import { LANGUAGE_META, translations } from "@/lib/i18n"
import type { EventRow } from "@/lib/db"

type EventCategoryPageProps = {
  category: EventCategory
  events: EventRow[]
  loading: boolean
}

export default function EventCategoryPage({ category, events, loading }: EventCategoryPageProps) {
  const { language } = useLanguage()
  const t = translations[language]
  const locale = LANGUAGE_META[language].locale

  return (
    <div className={`min-h-screen ${PAPER_BG} text-stone-800`}>
      <PaperHeader active="events" />

      <main>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 sm:pt-20">
          <PageIntro note={t.eventsPageNote} title={getEventCategoryLabel(category, t)} text={t.eventsSubtitle} />

          <nav aria-label="Event categories" className="mt-10 flex flex-wrap gap-x-8 gap-y-2 border-b border-stone-200">
            {(["events", "news", "interessantes"] as const).map((item) => (
              <Link
                key={item}
                href={`/events/${item === "events" ? "" : item}`}
                aria-current={item === category ? "page" : undefined}
                className={`-mb-px border-b-2 pb-3 text-sm transition-colors ${
                  item === category
                    ? "border-[#D10026] font-semibold text-stone-900"
                    : "border-transparent text-stone-500 hover:text-stone-900"
                }`}
              >
                {getEventCategoryLabel(item, t)}
              </Link>
            ))}
          </nav>
        </div>

        <EventsSection
          events={events}
          eventsLoading={loading}
          onViewEventDetails={() => undefined}
          t={t}
          locale={locale}
        />
      </main>
    </div>
  )
}
