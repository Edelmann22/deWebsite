import type { EventRow } from "@/lib/db"

// Events store uploaded photos as base64 data URIs, both in `images` and
// inline in `content_html`. Sending those in every list response made
// /api/events several megabytes, so lists swap them for URLs served by
// /api/events/:id/media/:kind/:index, which the browser can cache.

export type EventMediaKind = "image" | "content"

const INLINE_MARKER = "__inline_media__"
const INLINE_SRC_PATTERN = /src="data:[^"]*"/g

export function eventMediaUrl(event: Pick<EventRow, "id" | "updated_at">, kind: EventMediaKind, index: number) {
  const version = new Date(event.updated_at).getTime() || 0
  return `/api/events/${event.id}/media/${kind}/${index}?v=${version}`
}

// SQL column list that strips data URIs inside Postgres, so the large
// payload never leaves the database. Use with `sql.unsafe` interpolation.
export const LIGHT_EVENT_COLUMNS = `
  id,
  title,
  category,
  regexp_replace(content_html, 'src="data:[^"]*"', 'src="${INLINE_MARKER}"', 'g') AS content_html,
  ARRAY(
    SELECT CASE WHEN img LIKE 'data:%' THEN '${INLINE_MARKER}' ELSE img END
    FROM unnest(images) AS img
  ) AS images,
  event_date::text AS event_date,
  created_by_user_id,
  created_at,
  updated_at
`

// Replaces the markers left by LIGHT_EVENT_COLUMNS with media URLs.
export function withMediaUrls<T extends EventRow>(event: T): T {
  let contentIndex = 0
  return {
    ...event,
    content_html: (event.content_html ?? "").replaceAll(
      `src="${INLINE_MARKER}"`,
      () => `src="${eventMediaUrl(event, "content", contentIndex++)}"`
    ),
    images: (event.images ?? []).map((src, index) =>
      src === INLINE_MARKER ? eventMediaUrl(event, "image", index) : src
    ),
  }
}

// Finds the data URI a media URL points to in the full event row.
export function findEventMedia(event: Pick<EventRow, "images" | "content_html">, kind: EventMediaKind, index: number) {
  if (kind === "image") return event.images?.[index] ?? null
  const matches = (event.content_html ?? "").match(INLINE_SRC_PATTERN) ?? []
  const match = matches[index]
  return match ? match.slice('src="'.length, -1) : null
}

export function decodeDataUri(dataUri: string) {
  const match = dataUri.match(/^data:([^;,]+)?(;base64)?,([\s\S]*)$/)
  if (!match) return null
  const [, mimeType = "application/octet-stream", isBase64, payload] = match
  const buffer = isBase64 ? Buffer.from(payload, "base64") : Buffer.from(decodeURIComponent(payload))
  return { mimeType, buffer }
}
