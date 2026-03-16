"use client"

import { useCallback, useEffect, useState } from "react"
import type { EventRow } from "@/lib/db"

export type { EventRow }

export function useEvents(enabled = true) {
  const [events, setEvents] = useState<EventRow[]>([])
  const [loading, setLoading] = useState(true)

  const fetchEvents = useCallback(async () => {
    if (!enabled) {
      setEvents([])
      setLoading(false)
      return
    }

    setLoading(true)
    const res = await fetch("/api/events", { cache: "no-store" })
    if (!res.ok) {
      setEvents([])
      setLoading(false)
      return
    }
    const data = await res.json()
    setEvents(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [enabled])

  useEffect(() => { fetchEvents() }, [fetchEvents])

  const createEvent = async (payload: Omit<EventRow, "id" | "created_at" | "updated_at">) => {
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => null)
      throw new Error(data?.error ?? "Failed to create event")
    }
    const newEvent = await res.json()
    setEvents((prev) => [newEvent, ...prev])
    return newEvent as EventRow
  }

  const updateEvent = async (id: number, payload: Partial<EventRow>) => {
    const res = await fetch(`/api/events/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => null)
      throw new Error(data?.error ?? "Failed to update event")
    }
    const updated = await res.json()
    setEvents((prev) => prev.map((event) => (event.id === id ? updated : event)))
    return updated as EventRow
  }

  const deleteEvent = async (id: number) => {
    const res = await fetch(`/api/events/${id}`, { method: "DELETE" })
    if (!res.ok) {
      const data = await res.json().catch(() => null)
      throw new Error(data?.error ?? "Failed to delete event")
    }
    setEvents((prev) => prev.filter((event) => event.id !== id))
  }

  return { events, loading, refetch: fetchEvents, createEvent, updateEvent, deleteEvent }
}
