export const EVENT_CATEGORIES = [
  { value: "events", label: "Events" },
  { value: "news", label: "News" },
  { value: "interessantes", label: "Interessantes" },
] as const

export type EventCategory = (typeof EVENT_CATEGORIES)[number]["value"]

export function normalizeEventCategory(category: string | null | undefined): EventCategory {
  return EVENT_CATEGORIES.some((item) => item.value === category)
    ? (category as EventCategory)
    : "events"
}

type CategoryLabels = {
  eventCategoryEvents: string
  eventCategoryNews: string
  eventCategoryInteressantes: string
}

// Translated name of a category, e.g. "Събития" for "events".
export function getEventCategoryLabel(category: string | null | undefined, t: CategoryLabels) {
  const value = normalizeEventCategory(category)
  if (value === "news") return t.eventCategoryNews
  if (value === "interessantes") return t.eventCategoryInteressantes
  return t.eventCategoryEvents
}

export function isEventCategory(value: string): value is EventCategory {
  return EVENT_CATEGORIES.some((item) => item.value === value)
}
