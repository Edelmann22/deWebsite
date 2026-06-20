import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, CalendarDays, Image as ImageIcon } from "lucide-react"
import sql, { type EventRow } from "@/lib/db"

type Props = {
  params: Promise<{ id: string }>
}

export const dynamic = "force-dynamic"

function formatEventDate(dateString: string) {
  return new Date(dateString + "T12:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function formatPostedDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

async function getEvent(id: string) {
  if (!/^\d+$/.test(id)) return null

  const rows = (await sql`
    SELECT
      id,
      title,
      content_html,
      images,
      event_date::text AS event_date,
      created_by_user_id,
      created_at,
      updated_at
    FROM events
    WHERE id = ${id}
  `) as EventRow[]
  const [row] = rows

  return row ?? null
}

export default async function EventPage({ params }: Props) {
  const { id } = await params
  const event = await getEvent(id)

  if (!event) notFound()

  const images = Array.isArray(event.images) ? event.images : []

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <Link
          href="/#events"
          className="mb-6 inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-100"
        >
          <ArrowLeft size={16} />
          Back to events
        </Link>

        <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {images.length > 0 && (
            <div className="bg-gray-100">
              <img src={images[0]} alt={event.title} className="max-h-[520px] w-full object-cover" />
            </div>
          )}

          <div className="px-5 py-6 sm:px-8 sm:py-8">
            <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-gray-600">
              {event.event_date && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-700">
                  <CalendarDays size={15} />
                  {formatEventDate(event.event_date)}
                </span>
              )}
              <span>Posted {formatPostedDate(event.created_at)}</span>
              {images.length > 0 && (
                <span className="inline-flex items-center gap-1.5">
                  <ImageIcon size={15} />
                  {images.length} {images.length === 1 ? "photo" : "photos"}
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">{event.title}</h1>

            <div
              className="prose prose-lg mt-6 max-w-none text-gray-800"
              dangerouslySetInnerHTML={{ __html: event.content_html }}
            />
          </div>

          {images.length > 1 && (
            <div className="border-t border-gray-200 px-5 py-6 sm:px-8">
              <div className="grid gap-3 sm:grid-cols-2">
                {images.slice(1).map((src, index) => (
                  <div key={`${event.id}-image-${index + 2}`} className="overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                    <img src={src} alt={`${event.title} image ${index + 2}`} className="h-full max-h-80 w-full object-cover" />
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
