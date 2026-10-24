"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/hooks/use-language"
import { translations } from "@/lib/i18n"
import { BRAND_RED, PAPER_BG, PRINT_SHADOW, PageIntro, PaperHeader, Tape, hand, serif } from "@/components/paper"

const GROUP_SCHEDULE_KEYS = [
  "offersGroupA1",
  "offersGroupA2",
  "offersGroupB1",
  "offersGroupB2",
] as const

// "A1: Anfängergruppen …" -> ["A1", "Anfängergruppen …"]
function splitLevel(line: string) {
  const index = line.indexOf(":")
  if (index === -1) return [null, line] as const
  return [line.slice(0, index).trim(), line.slice(index + 1).trim()] as const
}

export default function OffersPage() {
  const router = useRouter()
  const { language } = useLanguage()
  const t = translations[language]

  const individualLines = [t.offersIndividualLowerLevels, t.offersIndividualHigherLevels]

  return (
    <div className={`min-h-screen ${PAPER_BG} text-stone-800`}>
      <PaperHeader active="offers" />

      <main>
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-16 sm:pt-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-end">
            <div className="md:col-span-8">
              <PageIntro note={t.offersPageNote} title={t.offersPageTitle} text={t.offersPageSubtitle} />
            </div>

            {/* Sticky note */}
            <aside className="md:col-span-4 mx-auto w-full max-w-xs">
              <div className={`relative rotate-2 bg-yellow-100 px-6 pt-8 pb-6 ${PRINT_SHADOW}`}>
                <Tape className="-top-3 left-1/2 -translate-x-1/2 -rotate-2 bg-white/60" />
                <p className={`${hand.className} text-2xl font-bold text-stone-900`}>{t.offersNoteTitle}</p>
                <p className={`${hand.className} mt-2 text-xl leading-snug text-stone-700`}>{t.offersGroupSeasonNote}</p>
              </div>
            </aside>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
          {/* 1. Group */}
          <section id="group" className="scroll-mt-28 border-t-2 border-stone-900 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4">
              <span className={`${serif.className} ${BRAND_RED} text-xl font-semibold`}>1.</span>
              <h2 className={`${serif.className} mt-1 text-3xl font-semibold text-stone-900`}>{t.offersGroupTitle}</h2>
              <p className="mt-3 leading-relaxed text-stone-600">{t.offersGroupIntro}</p>
              <Link href="/courses/group" className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-stone-900 underline decoration-stone-300 underline-offset-4 hover:decoration-[#D10026]">
                {t.readMore} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <ul className="lg:col-span-8 divide-y divide-stone-200 border-y border-stone-200 bg-white">
              {GROUP_SCHEDULE_KEYS.map((key) => {
                const [level, text] = splitLevel(t[key])
                return (
                  <li key={key} className="grid grid-cols-[4rem_1fr] gap-4 px-5 py-4">
                    <span className={`${serif.className} text-xl font-semibold text-stone-900`}>{level}</span>
                    <span className="text-stone-600 leading-relaxed">{text}</span>
                  </li>
                )
              })}
            </ul>
          </section>

          {/* 2. Individual */}
          <section id="individual" className="scroll-mt-28 border-t-2 border-stone-900 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4">
              <span className={`${serif.className} ${BRAND_RED} text-xl font-semibold`}>2.</span>
              <h2 className={`${serif.className} mt-1 text-3xl font-semibold text-stone-900`}>{t.offersIndividualTitle}</h2>
              <Link href="/courses/individual" className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-stone-900 underline decoration-stone-300 underline-offset-4 hover:decoration-[#D10026]">
                {t.readMore} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="lg:col-span-8">
              <ul className="divide-y divide-stone-200 border-y border-stone-200 bg-white">
                {individualLines.map((line) => {
                  const [level, text] = splitLevel(line)
                  return (
                    <li key={line} className="grid grid-cols-[4rem_1fr] gap-4 px-5 py-4">
                      <span className={`${serif.className} text-lg font-semibold text-stone-900`}>{level}</span>
                      <span className="text-stone-600 leading-relaxed">{text}</span>
                    </li>
                  )
                })}
              </ul>
              <p className="mt-4 text-sm italic text-stone-500">{t.offersIndividualCalendarNote}</p>
            </div>
          </section>

          {/* 3. Exam prep */}
          <section id="exam-prep" className="scroll-mt-28 border-t-2 border-stone-900 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4">
              <span className={`${serif.className} ${BRAND_RED} text-xl font-semibold`}>3.</span>
              <h2 className={`${serif.className} mt-1 text-3xl font-semibold text-stone-900`}>{t.offersExamPrepTitle}</h2>
              <Link href="/courses/exam-prep" className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-stone-900 underline decoration-stone-300 underline-offset-4 hover:decoration-[#D10026]">
                {t.readMore} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <p className="lg:col-span-8 text-lg leading-relaxed text-stone-600">{t.offersExamPrepDescription}</p>
          </section>

          <div className="border-t border-stone-200 pt-14 text-center">
            <p className={`${hand.className} ${BRAND_RED} text-4xl -rotate-2`}>{t.aboutSignature}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button onClick={() => router.push("/auth")} size="lg" className="rounded-md bg-stone-900 px-7 text-white hover:bg-stone-700">
                {t.offersPageCta}
              </Button>
              <Button onClick={() => router.push("/why-learn-german")} size="lg" variant="outline" className="rounded-md border-stone-300 bg-transparent px-7 text-stone-800 hover:bg-white">
                {t.aboutMeTitle}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
