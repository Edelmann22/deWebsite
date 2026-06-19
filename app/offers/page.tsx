"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Clock, GraduationCap, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useLanguage } from "@/hooks/use-language"
import { LANGUAGE_META, type Language, translations } from "@/lib/i18n"
import { TranslationDictionary } from "@/lib/i18n"

const GROUP_SCHEDULE_KEYS = [
  "offersGroupA1",
  "offersGroupA2",
  "offersGroupB1",
  "offersGroupB2",
] as const

export default function OffersPage() {
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = translations[language]
  const [openItem, setOpenItem] = useState<string>("group")

  useEffect(() => {
    const hash = window.location.hash.replace("#", "")
    if (hash === "group" || hash === "individual" || hash === "exam-prep") {
      setOpenItem(hash)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm">
                <Image src="/dudlogo.png" alt={`${t.appName} logo`} width={24} height={24} />
              </div>
            </Link>
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              {t.offersPageBackToHome}
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700"
              aria-label="Website language"
            >
              {Object.entries(LANGUAGE_META).map(([value, meta]) => (
                <option key={value} value={value}>
                  {meta.label}
                </option>
              ))}
            </select>
            <Button onClick={() => router.push("/auth")} className="bg-blue-600 hover:bg-blue-700">
              {t.offersPageCta}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <section className="text-center mb-10">
          <Badge className="mb-4 px-4 py-2 text-sm font-semibold">{t.offersPageBadge}</Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{t.offersPageTitle}</h1>
          <p className="text-lg text-gray-600">{t.offersPageSubtitle}</p>
        </section>

        <Card className="shadow-md border-gray-200">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t.offersTrainingSection}</h2>
            <Accordion
              type="single"
              collapsible
              value={openItem}
              onValueChange={(value) => setOpenItem(value)}
              className="w-full"
            >
              <AccordionItem value="group">
                <AccordionTrigger className="text-base font-semibold text-gray-900 hover:no-underline">
                  <span className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    {t.offersGroupTitle}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600 mb-4">{t.offersGroupIntro}</p>
                  <ul className="space-y-2">
                    {GROUP_SCHEDULE_KEYS.map((key) => (
                      <li key={key} className="flex items-start gap-2 text-sm text-gray-700">
                        <Clock className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                        {t[key]}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="individual">
                <AccordionTrigger className="text-base font-semibold text-gray-900 hover:no-underline">
                  <span className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-green-600" />
                    {t.offersIndividualTitle}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <Clock className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                      {t.offersIndividualLowerLevels}
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <Clock className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                      {t.offersIndividualHigherLevels}
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-600 italic">
                      <Calendar className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                      {t.offersIndividualCalendarNote}
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="exam-prep">
                <AccordionTrigger className="text-base font-semibold text-gray-900 hover:no-underline">
                  <span className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-purple-600" />
                    {t.offersExamPrepTitle}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-gray-700">{t.offersExamPrepDescription}</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-gray-600 bg-white/70 rounded-xl border border-gray-200 px-4 py-3">
          {t.offersGroupSeasonNote}
        </p>
      </main>
    </div>
  )
}
