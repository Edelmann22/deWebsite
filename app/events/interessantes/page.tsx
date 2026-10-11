"use client"

import EventCategoryPage from "@/components/event-category-page"
import { useEvents } from "@/hooks/use-events"

export default function InteressantesCategoryPage() {
  const { events, loading } = useEvents(true)

  return (
    <EventCategoryPage
      category="interessantes"
      events={events.filter((event) => event.category === "interessantes")}
      loading={loading}
    />
  )
}
