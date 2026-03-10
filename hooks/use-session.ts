"use client"

import { useCallback, useEffect, useState } from "react"
import type { SessionUser } from "@/lib/db"

async function readJsonSafely(res: Response) {
  const text = await res.text()
  if (!text) return null

  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

export function useSession() {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/auth/session", { cache: "no-store" })
      const data = await readJsonSafely(res)
      setUser(data?.user ?? null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    const data = await readJsonSafely(res)
    if (!res.ok) {
      throw new Error(data?.error ?? "Login failed")
    }
    setUser(data?.user ?? null)
    return data?.user as SessionUser
  }

  const signup = async (email: string, nickname: string, password: string) => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, nickname, password }),
    })
    const data = await readJsonSafely(res)
    if (!res.ok) {
      throw new Error(data?.error ?? "Signup failed")
    }
    setUser(data?.user ?? null)
    return data?.user as SessionUser
  }

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    setUser(null)
  }

  return { user, loading, refresh, login, signup, logout }
}
