"use client"

import EventCategoryPage from "@/components/event-category-page"
import { useEvents } from "@/hooks/use-events"

export default function NewsCategoryPage() {
  const { events, loading } = useEvents(true)

  return (
    <EventCategoryPage
      category="news"
      events={events.filter((event) => event.category === "news")}
      loading={loading}
    />
  )
}
