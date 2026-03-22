"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import AuthPanel from "@/components/auth-panel"
import { LANGUAGE_META, type Language, translations } from "@/lib/i18n"
import { useSession } from "@/hooks/use-session"
import { useLanguage } from "@/hooks/use-language"
import { Button } from "@/components/ui/button"

export default function AuthPage() {
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const { login, signup } = useSession()
  const t = translations[language]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <header className="sticky top-0 z-40 border-b border-border bg-card/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push("/")}
              className="text-foreground"
            >
              {t.goBack}
            </Button>
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
                <Image src="/dudlogo.png" alt={`${t.appName} logo`} width={28} height={28} />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">{t.appName}</span>
            </button>
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

      <main className="mx-auto flex max-w-6xl flex-col items-center justify-center px-4 py-16 sm:px-6 lg:py-20">
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
