"use client"

import { useState } from "react"
import type { TranslationDictionary } from "@/lib/i18n"

type Props = {
  t: TranslationDictionary
  onLogin: (email: string, password: string) => Promise<void>
  onSignup: (email: string, nickname: string, password: string) => Promise<void>
  onGuest: () => void
}

export default function AuthPanel({ t, onLogin, onSignup, onGuest }: Props) {
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [email, setEmail] = useState("")
  const [nickname, setNickname] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (mode === "signup" && password !== confirmPassword) {
      setError(t.authMismatch)
      return
    }

    setSubmitting(true)
    try {
      if (mode === "login") {
        await onLogin(email, password)
      } else {
        await onSignup(email, nickname, password)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-[2rem] border border-white/60 bg-card/95 p-6 shadow-[0_30px_80px_rgba(70,50,20,0.16)] backdrop-blur-xl">
      <div className="mb-6 flex gap-2 rounded-2xl bg-secondary p-1">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`flex-1 rounded-[1rem] px-4 py-2 text-sm font-semibold ${mode === "login" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
        >
          {t.signIn}
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`flex-1 rounded-[1rem] px-4 py-2 text-sm font-semibold ${mode === "signup" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
        >
          {t.signUp}
        </button>
      </div>

      <p className="mb-5 text-sm leading-relaxed text-muted-foreground">{t.authIntro}</p>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-foreground">{t.email}</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="px-3 py-2" />
        </label>

        {mode === "signup" && (
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-foreground">{t.nickname}</span>
            <input value={nickname} onChange={(e) => setNickname(e.target.value)} required className="px-3 py-2" />
          </label>
        )}

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-foreground">{t.password}</span>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required minLength={6} className="px-3 py-2" />
        </label>

        {mode === "signup" && (
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-foreground">{t.confirmPassword}</span>
            <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" required minLength={6} className="px-3 py-2" />
          </label>
        )}

        {error && <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

        <button type="submit" disabled={submitting} className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">
          {submitting ? (mode === "login" ? `${t.signIn}…` : `${t.signUp}…`) : mode === "login" ? t.signIn : t.signUp}
        </button>
        <button type="button" onClick={onGuest} className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary">
          {t.continueAsGuest}
        </button>
      </form>
    </div>
  )
}
