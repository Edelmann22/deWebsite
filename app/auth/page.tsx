"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import AuthPanel from "@/components/auth-panel"
import { LANGUAGE_META, type Language, translations } from "@/lib/i18n"
import { useSession } from "@/hooks/use-session"
import { useLanguage } from "@/hooks/use-language"

export default function AuthPage() {
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const { login, signup } = useSession()
  const t = translations[language]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border bg-background">
        <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
            >
              <Image
                src="/deutschereiLogo.png"
                alt={`${t.appName} logo`}
                width={100}
                height={35}
                className="h-[35px] w-auto max-w-none shrink-0"
                priority
              />
            </button>
            <span className="hidden h-5 w-px bg-border sm:block" />
            <button
              type="button"
              onClick={() => router.push("/")}
              className="hidden text-sm text-muted-foreground hover:text-foreground sm:block"
            >
              ← {t.goBack}
            </button>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="h-9 rounded-md border border-border bg-background px-2.5 text-sm text-foreground shadow-none"
            aria-label={t.language}
          >
            {Object.entries(LANGUAGE_META).map(([value, meta]) => (
              <option key={value} value={value}>
                {meta.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      <main className="flex flex-1">
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
