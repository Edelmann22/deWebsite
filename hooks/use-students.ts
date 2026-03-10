"use client"

import { useCallback, useEffect, useState } from "react"

export type StudentOption = {
  id: number
  nickname: string
  email: string
  role: "student"
}

export function useStudents(enabled = true) {
  const [students, setStudents] = useState<StudentOption[]>([])
  const [loading, setLoading] = useState(false)

  const fetchStudents = useCallback(async () => {
    if (!enabled) {
      setStudents([])
      setLoading(false)
      return
    }

    setLoading(true)
    const res = await fetch("/api/users", { cache: "no-store" })
    if (!res.ok) {
      setStudents([])
      setLoading(false)
      return
    }
    const data = await res.json()
    setStudents(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [enabled])

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  return { students, loading, refetch: fetchStudents }
}
