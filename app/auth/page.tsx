"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarDays } from "lucide-react"
import AuthPanel from "@/components/auth-panel"
import { LANGUAGE_META, type Language, translations } from "@/lib/i18n"
import { useSession } from "@/hooks/use-session"

export default function AuthPage() {
  const router = useRouter()
  const [language, setLanguage] = useState<Language>("en")
  const { login, signup } = useSession()
  const t = translations[language]

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("ui-language")
    if (savedLanguage === "en" || savedLanguage === "de" || savedLanguage === "bg") {
      setLanguage(savedLanguage)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem("ui-language", language)
  }, [language])

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <CalendarDays size={16} className="text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">{t.appName}</span>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="h-9 rounded-lg border border-border bg-card px-3 text-sm text-foreground"
            aria-label="Website language"
          >
            {Object.entries(LANGUAGE_META).map(([value, meta]) => (
              <option key={value} value={value}>
                {meta.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col items-center justify-center px-4 py-16 sm:px-6">
        <AuthPanel
          t={t}
          onLogin={async (email, password) => {
            await login(email, password)
            router.push("/")
          }}
          onSignup={async (email, nickname, password) => {
            await signup(email, nickname, password)
            router.push("/")
          }}
          onGuest={() => {
            window.localStorage.setItem("guest-mode", "true")
            router.push("/")
          }}
        />
      </main>
    </div>
  )
}
