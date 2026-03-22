"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import ReviewsSection from "@/components/sections/reviews-section"
import { useSession } from "@/hooks/use-session"
import { useLanguage } from "@/hooks/use-language"
import { LANGUAGE_META, type Language, translations } from "@/lib/i18n"

export default function ReviewsPage() {
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const { user, loading: sessionLoading } = useSession()
  const t = translations[language]
  const locale = LANGUAGE_META[language].locale
  const isAdmin = user?.role === "admin"

  const handleBack = () => {
    router.push("/")
  }

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to Calendar
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Student Reviews</h1>
          </div>

          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      {/* Main Content */}
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
