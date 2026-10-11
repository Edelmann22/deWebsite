import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, CalendarDays, Image as ImageIcon } from "lucide-react"
import { cookies } from "next/headers"
import sql, { type EventRow } from "@/lib/db"
import { LIGHT_EVENT_COLUMNS, withMediaUrls } from "@/lib/event-media"
import { getEventCategoryLabel, normalizeEventCategory } from "@/lib/event-categories"
import { LANGUAGES, LANGUAGE_META, translations, type Language } from "@/lib/i18n"

type Props = {
  params: Promise<{ id: string }>
}

export const dynamic = "force-dynamic"

function formatEventDate(dateString: string, locale: string) {
  return new Date(dateString + "T12:00:00").toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function formatPostedDate(dateString: string, locale: string) {
  return new Date(dateString).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

async function getEvent(id: string) {
  if (!/^\d+$/.test(id)) return null

  const rows = (await sql`
    SELECT ${sql.unsafe(LIGHT_EVENT_COLUMNS)}
    FROM events
    WHERE id = ${id}
  `) as EventRow[]
  const [row] = rows

  return row ? withMediaUrls(row) : null
}

export default async function EventPage({ params }: Props) {
  const { id } = await params
  const event = await getEvent(id)

  if (!event) notFound()

  const cookieStore = await cookies()
  const cookieLanguage = cookieStore.get("ui-language")?.value as Language | undefined
  const language: Language = cookieLanguage && LANGUAGES.includes(cookieLanguage) ? cookieLanguage : "bg"
  const t = translations[language]
  const locale = LANGUAGE_META[language].locale
  const images = Array.isArray(event.images) ? event.images : []
  const categoryLabel = getEventCategoryLabel(event.category, t)

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <Link
          href={`/events/${normalizeEventCategory(event.category) === "events" ? "" : normalizeEventCategory(event.category)}`}
          className="mb-6 inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-100"
        >
          <ArrowLeft size={16} />
          {t.eventBackToEvents}
        </Link>

        <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {images.length > 0 && (
            <div className="bg-gray-100">
              <img src={images[0]} alt={event.title} className="max-h-[520px] w-full object-cover" />
            </div>
          )}

          <div className="px-5 py-6 sm:px-8 sm:py-8">
            <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-gray-600">
              {categoryLabel && (
                <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-700">
                  {categoryLabel}
                </span>
              )}
              {event.event_date && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-700">
                  <CalendarDays size={15} />
                  {formatEventDate(event.event_date, locale)}
                </span>
              )}
              <span>{t.eventPosted} {formatPostedDate(event.created_at, locale)}</span>
              {images.length > 0 && (
                <span className="inline-flex items-center gap-1.5">
                  <ImageIcon size={15} />
                  {images.length} {images.length === 1 ? t.eventPhoto : t.eventPhotos}
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">{event.title}</h1>

            <div
              className="event-content mt-6 max-w-none text-[17px] leading-relaxed text-gray-800"
              dangerouslySetInnerHTML={{ __html: event.content_html }}
            />
          </div>

          {images.length > 1 && (
            <div className="border-t border-gray-200 px-5 py-6 sm:px-8">
              <div className="grid gap-3 sm:grid-cols-2">
                {images.slice(1).map((src, index) => (
                  <div
                    key={`${event.id}-image-${index + 2}`}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-gray-100"
                  >
                    <img
                      src={src}
                      alt={`${event.title} image ${index + 2}`}
                      className="h-full max-h-80 w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </main>
  )
}