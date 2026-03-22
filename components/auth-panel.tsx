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
    <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/60 bg-card/95 shadow-[0_30px_80px_rgba(15,23,42,0.2)] backdrop-blur-xl">
      <div className="grid md:grid-cols-[1.1fr_0.9fr]">
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-8 py-10 text-white sm:px-10">
          <div className="relative z-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">{t.authWelcomeEyebrow}</p>
            <h2 className="mt-3 text-3xl font-semibold">{t.authWelcomeTitle}</h2>
            <p className="mt-3 text-sm text-slate-200">{t.authWelcomeSubtitle}</p>

            <div className="mt-8 space-y-3 text-sm text-slate-200">
              <div className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                <span>{t.authBenefit1}</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                <span>{t.authBenefit2}</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                <span>{t.authBenefit3}</span>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">{t.guestModeTitle}</p>
              <p className="mt-2 text-sm text-slate-100">{t.guestModeDescription}</p>
              <div className="mt-3 space-y-2 text-sm text-slate-200">
                <div className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-blue-300" />
                  <span>{t.guestModeBullet1}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-blue-300" />
                  <span>{t.guestModeBullet2}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-blue-400/20 blur-3xl" />
        </div>

        <div className="px-6 py-10 sm:px-10">
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

          <div className="mb-6">
            <h3 className="text-2xl font-semibold text-foreground">
              {mode === "login" ? t.authFormTitleLogin : t.authFormTitleSignup}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">{t.authIntro}</p>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-foreground">{t.email}</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                className="rounded-lg border border-border bg-background px-3 py-2 text-foreground"
              />
            </label>

            {mode === "signup" && (
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-foreground">{t.nickname}</span>
                <input
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  required
                  className="rounded-lg border border-border bg-background px-3 py-2 text-foreground"
                />
              </label>
            )}

            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-foreground">{t.password}</span>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
                minLength={6}
                className="rounded-lg border border-border bg-background px-3 py-2 text-foreground"
              />
            </label>

            {mode === "signup" && (
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-foreground">{t.confirmPassword}</span>
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  required
                  minLength={6}
                  className="rounded-lg border border-border bg-background px-3 py-2 text-foreground"
                />
              </label>
            )}

            {error && <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

            <button type="submit" disabled={submitting} className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">
              {submitting ? (mode === "login" ? `${t.signIn}…` : `${t.signUp}…`) : mode === "login" ? t.signIn : t.signUp}
            </button>
            <button type="button" onClick={onGuest} className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary">
              {t.continueAsGuest}
            </button>
            <p className="text-xs text-muted-foreground">{t.guestModeHint}</p>
          </form>
        </div>
      </div>
    </div>
  )
}
