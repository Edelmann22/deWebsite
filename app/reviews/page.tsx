"use client"

import { useRouter } from "next/navigation"
import ReviewsSection from "@/components/sections/reviews-section"
import { PAPER_BG, PaperHeader, hand } from "@/components/paper"
import { useSession } from "@/hooks/use-session"
import { useLanguage } from "@/hooks/use-language"
import { LANGUAGE_META, translations } from "@/lib/i18n"

export default function ReviewsPage() {
  const router = useRouter()
  const { language } = useLanguage()
  const { user, loading: sessionLoading } = useSession()
  const t = translations[language]
  const locale = LANGUAGE_META[language].locale
  const isAdmin = user?.role === "admin"

  if (sessionLoading) {
    return (
      <div className={`min-h-screen ${PAPER_BG} flex items-center justify-center`}>
        <p className={`${hand.className} text-2xl text-stone-500`}>{t.loading}</p>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${PAPER_BG} text-stone-800`}>
      <PaperHeader active="reviews" />

      <main>
        <ReviewsSection
          isAuthenticated={Boolean(user)}
          isAdmin={isAdmin}
          user={user}
          onLogin={() => router.push("/auth")}
          t={t}
          locale={locale}
        />
      </main>
    </div>
  )
}
