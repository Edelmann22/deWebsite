"use client"

import EventCategoryPage from "@/components/event-category-page"
import { useEvents } from "@/hooks/use-events"
import type { EventCategory } from "@/lib/event-categories"

export default function EventsCategoryPage() {
  const { events, loading } = useEvents(true)

  return (
    <EventCategoryPage
      category={"events" as EventCategory}
      events={events.filter((event) => event.category === "events")}
      loading={loading}
    />
  )
}
