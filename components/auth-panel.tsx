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
    <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-3xl shadow-2xl border border-gray-200">
 
      {/* German flag stripe — top */}
      <div className="flex h-1.5 w-full">
        <div className="flex-1 bg-gray-900" />
        <div className="flex-1 bg-red-600" />
        <div className="flex-1 bg-yellow-400" />
      </div>
 
      <div className="grid md:grid-cols-[1.1fr_0.9fr]">
 
        {/* ── Left panel ── */}
        <div className="relative overflow-hidden bg-gray-950 px-8 py-10 text-white sm:px-10">
 
          {/* Subtle grid */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "32px 32px" }} />
 
          {/* Glow blobs */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-yellow-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-12 h-48 w-48 rounded-full bg-red-600/10 blur-3xl" />
 
          <div className="relative z-10">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
              {t.authWelcomeEyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-snug">
              {t.authWelcomeTitle}
            </h2>
            <p className="mt-3 text-sm text-gray-400 leading-relaxed">
              {t.authWelcomeSubtitle}
            </p>
 
            {/* Benefits */}
            <div className="mt-8 space-y-3">
              {[t.authBenefit1, t.authBenefit2, t.authBenefit3].map((benefit, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-gray-300">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-yellow-400" />
                  {benefit}
                </div>
              ))}
            </div>
 
            {/* Guest mode box */}
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                {t.guestModeTitle}
              </p>
              <p className="mt-2 text-sm text-gray-300 leading-relaxed">
                {t.guestModeDescription}
              </p>
              <div className="mt-3 space-y-2">
                {[t.guestModeBullet1, t.guestModeBullet2].map((bullet, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-gray-400">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-400" />
                    {bullet}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
 
        {/* ── Right panel (form) ── */}
        <div className="bg-white px-6 py-10 sm:px-10">
 
          {/* Login / Signup toggle */}
          <div className="mb-7 flex gap-1 rounded-xl bg-gray-100 p-1">
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200
                  ${mode === m
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"}`}
              >
                {m === "login" ? t.signIn : t.signUp}
              </button>
            ))}
          </div>
 
          {/* Form heading */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              {mode === "login" ? t.authFormTitleLogin : t.authFormTitleSignup}
            </h3>
            <p className="mt-1.5 text-sm text-gray-500">{t.authIntro}</p>
          </div>
 
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
 
            {/* Email */}
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-gray-700">{t.email}</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                placeholder="name@example.com"
                className="rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all"
              />
            </label>
 
            {/* Nickname (signup only) */}
            {mode === "signup" && (
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-gray-700">{t.nickname}</span>
                <input
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  required
                  placeholder="Max Mustermann"
                  className="rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all"
                />
              </label>
            )}
 
            {/* Password */}
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-gray-700">{t.password}</span>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                className="rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all"
              />
            </label>
 
            {/* Confirm password (signup only) */}
            {mode === "signup" && (
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-gray-700">{t.confirmPassword}</span>
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all"
                />
              </label>
            )}
 
            {/* Error */}
            {error && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-600">
                {error}
              </p>
            )}
 
            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="mt-1 rounded-xl bg-gray-900 px-4 py-3 text-sm font-bold text-white hover:bg-gray-700 hover:border-gray-400 disabled:opacity-50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
              {submitting
                ? (mode === "login" ? `${t.signIn}…` : `${t.signUp}…`)
                : (mode === "login" ? t.signIn : t.signUp)}
            </button>
 
            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium">oder</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
 
            {/* Guest */}
            <button
              type="button"
              onClick={onGuest}
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
            >
              {t.continueAsGuest}
            </button>
 
            <p className="text-xs text-gray-400 leading-relaxed">{t.guestModeHint}</p>
          </form>
        </div>
      </div>
 
      {/* German flag stripe — bottom */}
      <div className="flex h-1.5 w-full">
        <div className="flex-1 bg-gray-900" />
        <div className="flex-1 bg-red-600" />
        <div className="flex-1 bg-yellow-400" />
      </div>
 
    </div>
  )

}
