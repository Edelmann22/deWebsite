"use client"

import { useCallback, useEffect, useState } from "react"
import type { EventRow } from "@/lib/db"

export type { EventRow }

// Simple in-memory cache with 5-minute TTL
const eventsCache = new Map<string, { data: EventRow[]; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes
const REQUEST_TIMEOUT_MS = 15000

export function useEvents(enabled = true, limit?: number) {
  const [events, setEvents] = useState<EventRow[]>([])
  const [loading, setLoading] = useState(true)

  const fetchEvents = useCallback(async () => {
    if (!enabled) {
      setEvents([])
      setLoading(false)
      return
    }

    const cacheKey = `events_${limit || 'all'}`
    const cached = eventsCache.get(cacheKey)
    const now = Date.now()

    if (cached && (now - cached.timestamp) < CACHE_TTL) {
      setEvents(cached.data)
      setLoading(false)
      return
    }

    setLoading(true)
    
    try {
      const url = limit ? `/api/events?limit=${limit}` : "/api/events"
      const res = await fetch(url, { 
        cache: "no-store",
      })
      
      if (!res.ok) {
        console.error("API response not ok:", res.status)
        setEvents([])
        setLoading(false)
        return
      }
      
      const data = await res.json()
      const eventsData = Array.isArray(data) ? data : []
      
      eventsCache.set(cacheKey, { data: eventsData, timestamp: now })
      setEvents(eventsData)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch events:', error)
      setEvents([])
      setLoading(false)
    } finally {

    }
  }, [enabled, limit])

  useEffect(() => {
    fetchEvents()

    return () =>
    {
        if(typeof window !== 'undefined')
        {

        }
    }
  }, [fetchEvents])

  const createEvent = async (payload: Omit<EventRow, "id" | "created_at" | "updated_at">) => {
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => null)
      console.error("Failed to create event:", data)
      throw new Error(data?.error ?? "Failed to create event")
    }
    const newEvent = await res.json()
    
    eventsCache.clear()
    
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
    
    // Clear cache to force refresh
    eventsCache.clear()
    
    setEvents((prev) => prev.map((event) => (event.id === id ? updated : event)))
    return updated as EventRow
  }

  const deleteEvent = async (id: number) => {
    const res = await fetch(`/api/events/${id}`, { method: "DELETE" })
    if (!res.ok) {
      const data = await res.json().catch(() => null)
      throw new Error(data?.error ?? "Failed to delete event")
    }
    
    // Clear cache to force refresh
    eventsCache.clear()
    
    setEvents((prev) => prev.filter((event) => event.id !== id))
  }

  return { events, loading, refetch: fetchEvents, createEvent, updateEvent, deleteEvent }
}
