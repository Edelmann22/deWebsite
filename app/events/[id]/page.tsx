import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { cookies } from "next/headers"
import { PaperHeader } from "@/components/paper"
import { BRAND_RED, PAPER_BG, PRINT_SHADOW, hand, serif } from "@/components/paper-fonts"
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

  const category = normalizeEventCategory(event.category)

  return (
    <div className={`min-h-screen ${PAPER_BG} text-stone-800`}>
      <PaperHeader active="events" />

      <main className="mx-auto max-w-3xl px-4 pt-10 pb-24 sm:px-6 sm:pt-14">
        <Link
          href={`/events/${category === "events" ? "" : category}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-stone-500 transition-colors hover:text-stone-900"
        >
          <ArrowLeft size={16} />
          {t.eventBackToEvents}
        </Link>

        <article className="mt-8">
          <p className={`${hand.className} ${BRAND_RED} text-2xl -rotate-1 origin-left`}>
            {categoryLabel}
            {event.event_date && <> · {formatEventDate(event.event_date, locale)}</>}
          </p>
          <h1 className={`${serif.className} mt-2 text-4xl sm:text-5xl leading-[1.15] font-semibold text-stone-900`}>
            {event.title}
          </h1>
          <p className="mt-4 text-sm text-stone-500">
            {t.eventPosted} {formatPostedDate(event.created_at, locale)}
            {images.length > 0 && <> · {images.length} {images.length === 1 ? t.eventPhoto : t.eventPhotos}</>}
          </p>

          {images.length > 0 && (
            <figure className={`relative mt-10 -rotate-1 bg-white p-3 pb-4 ${PRINT_SHADOW}`}>
              <div aria-hidden className="absolute -top-3 left-1/2 h-6 w-28 -translate-x-1/2 rotate-2 bg-yellow-200/70 shadow-sm" />
              <img src={images[0]} alt={event.title} className="max-h-[520px] w-full object-cover" />
            </figure>
          )}

          <div
            className="event-content mt-10 max-w-none text-[17px] leading-relaxed text-stone-700"
            dangerouslySetInnerHTML={{ __html: event.content_html }}
          />

          {images.length > 1 && (
            <div className="mt-14 grid gap-8 sm:grid-cols-2">
              {images.slice(1).map((src, index) => (
                <figure
                  key={`${event.id}-image-${index + 2}`}
                  className={`bg-white p-2 pb-3 ${PRINT_SHADOW} ${index % 2 === 0 ? "rotate-1" : "-rotate-1"}`}
                >
                  <img
                    src={src}
                    alt={`${event.title} image ${index + 2}`}
                    className="h-full max-h-80 w-full object-cover"
                  />
                </figure>
              ))}
            </div>
          )}
        </article>
      </main>
    </div>
  )
}