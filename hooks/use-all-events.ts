"use client"

import { useCallback, useEffect, useState } from "react"
import type { EventRow } from "@/lib/db"

export function useAllEvents(enabled = true) {
  const [events, setEvents] = useState<EventRow[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAllEvents = useCallback(async () => {
    if (!enabled) {
      setEvents([])
      setLoading(false)
      return
    }

    setLoading(true)
    
    try {
      const res = await fetch("/api/events", { 
        cache: "force-cache",
        next: { revalidate: 300 } // 5 minutes
      })
      
      if (!res.ok) {
        setEvents([])
        setLoading(false)
        return
      }
      
      const data = await res.json()
      const eventsData = Array.isArray(data) ? data : []
      
      setEvents(eventsData)
    } catch (error) {
      console.error('Failed to fetch all events:', error)
      setEvents([])
    } finally {
      setLoading(false)
    }
  }, [enabled])

  useEffect(() => { fetchAllEvents() }, [fetchAllEvents])

  return { events, loading, refetch: fetchAllEvents }
}
