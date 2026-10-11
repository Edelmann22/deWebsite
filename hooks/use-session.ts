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
      throw Object.assign(new Error(data?.error ?? "Login failed"), { status: res.status })
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
      throw Object.assign(new Error(data?.error ?? "Signup failed"), { status: res.status })
    }
    setUser(data?.user ?? null)
    return data?.user as SessionUser
  }

  // Throws an Error whose `code` matches the API: wrong_current, too_short, same_password, ...
  const changePassword = async (currentPassword: string, newPassword: string) => {
    const res = await fetch("/api/auth/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    })
    if (!res.ok) {
      const data = await readJsonSafely(res)
      throw Object.assign(new Error(data?.error ?? "Password change failed"), { code: data?.code ?? "failed" })
    }
  }

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    setUser(null)
  }

  return { user, loading, refresh, login, signup, changePassword, logout }
}
