"use client"

// Shared look for the "paper" pages (about, offers, events, reviews):
// warm paper background, serif headings, handwritten notes and taped prints.

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { LANGUAGE_META, type Language, translations } from "@/lib/i18n"
import { BRAND_RED, hand, serif } from "@/components/paper-fonts"

export { BRAND_RED, PAPER_BG, PRINT_SHADOW, hand, serif } from "@/components/paper-fonts"

export function Tape({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`absolute h-6 w-24 bg-yellow-200/70 shadow-sm ${className}`} />
}

type NavKey = "offers" | "events" | "reviews"

export function PaperHeader({ active }: { active?: NavKey }) {
  const { language, setLanguage } = useLanguage()
  const t = translations[language]

  const nav: { key: NavKey; href: string; label: string }[] = [
    { key: "offers", href: "/offers", label: t.courses },
    { key: "events", href: "/events", label: t.events },
    { key: "reviews", href: "/reviews", label: t.reviewsBadge },
  ]

  return (
    <header className={`sticky top-0 z-40 border-b border-stone-200 bg-[#FBF7F0]/90 backdrop-blur-md`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{t.home}</span>
          </Link>
          <div className="h-4 w-px bg-stone-300" />
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/deutschereiLogo.png"
              alt={`${t.appName} logo`}
              width={100}
              height={35}
              className="h-[35px] w-auto max-w-none shrink-0"
              priority
            />
          </Link>
        </div>

        <nav aria-label="Page navigation" className="hidden md:flex items-center gap-7 text-sm">
          {nav.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              aria-current={item.key === active ? "page" : undefined}
              className={
                item.key === active
                  ? "font-semibold text-stone-900 underline decoration-[#D10026] decoration-2 underline-offset-[6px]"
                  : "text-stone-500 hover:text-stone-900 transition-colors"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="h-8 rounded-md border border-stone-300 bg-white px-3 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-300"
          aria-label={t.language}
        >
          {Object.entries(LANGUAGE_META).map(([value, meta]) => (
            <option key={value} value={value}>{meta.label}</option>
          ))}
        </select>
      </div>

      {/* Phone: page links on their own row */}
      <nav aria-label="Page navigation" className="md:hidden border-t border-stone-200">
        <div className="max-w-6xl mx-auto px-4 flex justify-center gap-7 py-2.5 text-sm">
          {nav.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              aria-current={item.key === active ? "page" : undefined}
              className={item.key === active ? "font-semibold text-stone-900 underline decoration-[#D10026] decoration-2 underline-offset-4" : "text-stone-500"}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}

export function PageIntro({ note, title, text }: { note?: string; title: string; text?: string }) {
  return (
    <div className="max-w-2xl">
      {note && <p className={`${hand.className} ${BRAND_RED} text-3xl -rotate-2 origin-left`}>{note}</p>}
      <h1 className={`${serif.className} mt-3 text-4xl sm:text-5xl leading-[1.15] font-semibold text-stone-900`}>{title}</h1>
      {text && <p className="mt-6 text-lg leading-relaxed text-stone-600">{text}</p>}
    </div>
  )
}
