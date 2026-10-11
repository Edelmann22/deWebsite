"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { ClassRow } from "@/lib/db"

export type { ClassRow }

export function useClasses(from: string, to: string, enabled = true) {
  const [classes, setClasses] = useState<ClassRow[]>([])
  const [loading, setLoading] = useState(true)
  // Id of the latest request, so a slow older response can't overwrite a newer one.
  const requestId = useRef(0)

  const fetchClasses = useCallback(async () => {
    const id = ++requestId.current
    if (!enabled) {
      setClasses([])
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const params = new URLSearchParams({ from, to })
      const res = await fetch(`/api/classes?${params.toString()}`)
      const data = res.ok ? await res.json() : []
      if (id !== requestId.current) return
      setClasses(Array.isArray(data) ? data : [])
    } catch {
      if (id === requestId.current) setClasses([])
    } finally {
      if (id === requestId.current) setLoading(false)
    }
  }, [enabled, from, to])

  useEffect(() => {
    fetchClasses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchClasses])

  const createClass = async (payload: Omit<ClassRow, "id" | "created_at" | "updated_at">) => {
    const res = await fetch("/api/classes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => null)
      throw new Error(data?.error ?? "Failed to create class")
    }
    const newClass = await res.json()
    setClasses((prev) => [...prev, newClass].sort((a, b) => a.date.localeCompare(b.date) || a.start_time.localeCompare(b.start_time)))
    return newClass as ClassRow
  }

  const updateClass = async (id: number, payload: Partial<ClassRow>) => {
    const res = await fetch(`/api/classes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => null)
      throw new Error(data?.error ?? "Failed to update class")
    }
    const updated = await res.json()
    setClasses((prev) => prev.map((c) => (c.id === id ? updated : c)))
    return updated as ClassRow
  }

  const deleteClass = async (id: number) => {
    const res = await fetch(`/api/classes/${id}`, { method: "DELETE" })
    if (!res.ok) {
      const data = await res.json().catch(() => null)
      throw new Error(data?.error ?? "Failed to delete class")
    }
    setClasses((prev) => prev.filter((c) => c.id !== id))
  }

  return { classes, loading, refetch: fetchClasses, createClass, updateClass, deleteClass }
}
