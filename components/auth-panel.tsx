"use client"

import { useState } from "react"
import Image from "next/image"
import type { TranslationDictionary } from "@/lib/i18n"

type Props = {
  t: TranslationDictionary
  onLogin: (email: string, password: string) => Promise<void>
  onSignup: (email: string, nickname: string, password: string) => Promise<void>
  onGuest: () => void
}

const inputClass =
  "h-11 w-full rounded-md border border-input bg-card px-3 text-[15px] text-foreground shadow-none placeholder:text-muted-foreground/60"

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
      const status = (err as { status?: number })?.status
      setError(
        status === 401
          ? t.authWrongCredentials
          : status === 409
            ? t.authEmailTaken
            : status === 400
              ? t.authInvalidData
              : t.genericError
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="grid w-full flex-1 lg:grid-cols-[1fr_minmax(0,560px)]">
      {/* Photo side */}
      <aside className="relative hidden min-h-full overflow-hidden lg:block">
        <Image
          src="/Ph9.jpg"
          alt="Brandenburger Tor, Berlin"
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 0px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-10 text-white xl:p-14">
          <h2 className="max-w-md text-3xl font-semibold leading-tight tracking-tight">
            {t.authWelcomeTitle}
          </h2>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/80">
            {t.authWelcomeSubtitle}
          </p>
          <ul className="mt-8 max-w-md divide-y divide-white/15 border-y border-white/15 text-sm text-white/85">
            {[t.authBenefit1, t.authBenefit2, t.authBenefit3].map((benefit) => (
              <li key={benefit} className="py-2.5">
                {benefit}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-white/50">Brandenburger Tor, Berlin</p>
        </div>
      </aside>

      {/* Form side */}
      <section className="flex items-center justify-center bg-background px-5 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          <h1 className="text-[28px] font-semibold leading-tight tracking-tight text-foreground">
            {mode === "login" ? t.authFormTitleLogin : t.authFormTitleSignup}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.authIntro}</p>

          {/* Login / Signup tabs */}
          <div className="mt-8 flex gap-6 border-b border-border" role="tablist">
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={mode === m}
                onClick={() => {
                  setMode(m)
                  setError("")
                }}
                className={`-mb-px rounded-none border-b-2 pb-2.5 text-sm font-semibold ${
                  mode === m
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {m === "login" ? t.signIn : t.signUp}
              </button>
            ))}
          </div>

          <form className="mt-6 flex flex-col gap-5" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-foreground">{t.email}</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoComplete="email"
                required
                placeholder="name@example.com"
                className={inputClass}
              />
            </label>

            {mode === "signup" && (
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-foreground">{t.nickname}</span>
                <input
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  autoComplete="nickname"
                  required
                  placeholder="Max Mustermann"
                  className={inputClass}
                />
              </label>
            )}

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-foreground">{t.password}</span>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                required
                minLength={6}
                className={inputClass}
              />
            </label>

            {mode === "signup" && (
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-foreground">{t.confirmPassword}</span>
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  className={inputClass}
                />
              </label>
            )}

            {error && (
              <p role="alert" className="border-l-2 border-destructive pl-3 text-sm text-destructive">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-1 h-11 rounded-md bg-foreground px-4 text-sm font-semibold text-background hover:bg-foreground/85 disabled:opacity-50"
            >
              {submitting
                ? mode === "login"
                  ? `${t.signIn}…`
                  : `${t.signUp}…`
                : mode === "login"
                  ? t.signIn
                  : t.signUp}
            </button>
          </form>

          {/* Guest access */}
          <div className="mt-10 border-t border-border pt-6">
            <p className="text-sm font-semibold text-foreground">{t.guestModeTitle}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {t.guestModeDescription}
            </p>
            <button
              type="button"
              onClick={onGuest}
              className="mt-3 rounded-none p-0 text-sm font-semibold text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
            >
              {t.continueAsGuest} →
            </button>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{t.guestModeHint}</p>
          </div>
        </div>
      </section>
    </div>
  )
}
