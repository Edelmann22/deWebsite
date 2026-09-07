"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import EventsSection from "@/components/sections/events-section"
import { useEvents } from "@/hooks/use-events"
import { useLanguage } from "@/hooks/use-language"
import { LANGUAGE_META, type Language, translations } from "@/lib/i18n"

export default function EventsPage() {
  const { language, setLanguage } = useLanguage()
  const { events, loading } = useEvents(true)
  const t = translations[language]
  const locale = LANGUAGE_META[language].locale

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="transition-opacity hover:opacity-80">
              <Image
                src="/deutschereiLogo.png"
                alt={`${t.appName} logo`}
                width={144}
                height={36}
                className="h-9 w-auto"
                priority
              />
            </Link>
            <Link href="/" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4" />
              Home
            </Link>
          </div>
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value as Language)}
            className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700"
            aria-label="Website language"
          >
            {Object.entries(LANGUAGE_META).map(([value, meta]) => (
              <option key={value} value={value}>
                {meta.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      <nav className="border-b border-gray-200 bg-white" aria-label="Page navigation">
        <div className="mx-auto flex max-w-7xl justify-center gap-8 px-4 py-3 text-sm font-semibold text-gray-700">
          <Link href="/offers" className="hover:text-blue-600">{t.courses}</Link>
          <Link href="/events" className="text-blue-600">{t.events}</Link>
          <Link href="/reviews" className="hover:text-blue-600">{t.reviewsBadge}</Link>
        </div>
      </nav>

      <main>
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
