"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Users, Clock, Calendar, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useLanguage } from "@/hooks/use-language"
import { LANGUAGE_META, type Language, translations } from "@/lib/i18n"

const flagStripes = ["bg-gray-900", "bg-red-600", "bg-yellow-400"]

const LEVELS = [
  {
    level: "A1",
    days: "Понеделник и Сряда",
    time: "08:00 – 10:10",
    color: "bg-blue-500",
    border: "border-blue-200",
    badge: "bg-blue-50 text-blue-700",
  },
  {
    level: "A2",
    days: "Понеделник и Сряда",
    time: "10:20 – 12:30",
    color: "bg-emerald-500",
    border: "border-emerald-200",
    badge: "bg-emerald-50 text-emerald-700",
  },
  {
    level: "B1",
    days: "Вторник и Четвъртък",
    time: "08:00 – 10:10",
    color: "bg-violet-500",
    border: "border-violet-200",
    badge: "bg-violet-50 text-violet-700",
  },
  {
    level: "B2",
    days: "Вторник и Четвъртък",
    time: "10:20 – 12:30",
    color: "bg-orange-500",
    border: "border-orange-200",
    badge: "bg-orange-50 text-orange-700",
  },
]

export default function GroupCoursePage() {
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = translations[language]

  return (
    <div className="min-h-screen bg-white">

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto pl-0 pr-2 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/deutschereiLogo.png"
                alt={`${t.appName} logo`}
                width={128}
                height={32}
                className="h-8 w-auto"
                priority
              />
            </Link>
            <div className="h-4 w-px bg-gray-300" />
            <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium">
              <ArrowLeft className="w-4 h-4" />
              Начало
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="h-8 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
              aria-label="Website language"
            >
              {Object.entries(LANGUAGE_META).map(([value, meta]) => (
                <option key={value} value={value}>{meta.label}</option>
              ))}
            </select>
            <Button onClick={() => router.push("/auth")} size="sm"
              className="bg-gray-900 hover:bg-gray-700 text-white rounded-lg">
              Запишете се
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gray-950 text-white">
        <div className="flex h-1.5 w-full">
          {flagStripes.map((c) => <div key={c} className={`flex-1 ${c}`} />)}
        </div>
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-yellow-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-12 h-48 w-48 rounded-full bg-red-600/10 blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4">
            Групово обучение
          </h1>
         {/*<p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Нива А1 до В2 · Два пъти седмично · 3 учебни часа (120 мин + 10 мин почивка)
            Учебна година 1 октомври – 31 май | Продължителност 120 мин + 10 мин почивка | Занятия 2 пъти седмично  
          </p>*/} 
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Button onClick={() => router.push("/auth")} size="lg"
              className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold rounded-xl px-8">
              Запишете се
            </Button>
            <Button onClick={() => router.push("/")} size="lg" variant="outline"
              className="border-white/20 text-white hover:bg-white/10 rounded-xl px-8 bg-transparent">
              Към началото
            </Button>
          </div>
        </div>
        <div className="flex h-1.5 w-full">
          {flagStripes.map((c) => <div key={c} className={`flex-1 ${c}`} />)}
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Schedule info bar */}
        <section className="py-12 flex justify-center items-center">
            <div 
                style={{
                backgroundColor: '#f3f4f6', // светлосив фон
                padding: '24px',
                borderRadius: '8px',
                maxWidth: '600px',
                textAlign: 'center',
                fontWeight: 'bold',
                }}
            >
                <p>Учебна година 1 октомври – 31 май | Продължителност 120 мин + 10 мин почивка | Занятия 2 пъти седмично</p>
            </div>
        </section>

        {/* Level cards */}
        <section className="pb-16 border-t border-gray-100 pt-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Разписание по нива</h2>
            <div className="mt-3 mx-auto w-16 h-1 rounded-full bg-yellow-400" />
          </div>

          <div className="divide-y divide-gray-100 border-y border-gray-100">
            {LEVELS.map((lvl) => (
                <div 
                key={lvl.level}
                className="py-3.5 px-3 flex items-center justify-between gap-4 hover:bg-gray-50/80 transition-colors rounded-xl group"
                >
                {/* Left: Level Pill + CEFR Badge */}
                <div className="flex items-center gap-3">
                    {/* Accent level badge */}
                    <span className={`inline-flex items-center justify-center min-w-[2.75rem] h-8 px-2.5 rounded-lg text-xs font-bold text-white shadow-sm ${lvl.color || 'bg-indigo-600'}`}>
                    {lvl.level}
                    </span>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${lvl.badge || 'bg-indigo-50 text-indigo-700'}`}>
                    CEFR {lvl.level}
                    </span>
                </div>

                {/* Right: Schedule Details with colored icons */}
                <div className="flex items-center gap-5 text-xs text-gray-700">
                    <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                    <span className="font-medium">{lvl.days}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-gray-100/70 px-2.5 py-1 rounded-md">
                    <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <span className="font-semibold text-gray-900">{lvl.time}</span>
                    </div>
                </div>
                </div>
            ))}
            </div>
        </section>

        {/* Summer course */}
        <section className="pb-16 border-t border-gray-100 pt-12">
          <div className="rounded-3xl bg-yellow-400 overflow-hidden relative">
            <div className="px-8 py-12">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-yellow-500/40 px-3 py-1 text-xs font-bold uppercase tracking-widest text-yellow-900 mb-4">
                    <Sun className="w-3.5 h-3.5" />
                    Летен курс – Юли
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    Интензивен летен курс
                  </h2>
                  <p className="text-gray-800 max-w-md">
                    Понеделник до Петък · 4 учебни часа дневно · Общо 80 часа
                  </p>
                </div>
                <Button onClick={() => router.push("/auth")} size="lg"
                  className="bg-gray-900 hover:bg-gray-700 text-white font-bold rounded-xl px-8 flex-shrink-0">
                  Запишете се
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="pb-24 pt-4">
          <div className="rounded-3xl bg-gray-950 text-white overflow-hidden relative">
            <div className="flex h-1.5 w-full absolute top-0">
              {flagStripes.map((c) => <div key={c} className={`flex-1 ${c}`} />)}
            </div>
            <div className="px-8 py-14 text-center">
              <h2 className="text-3xl font-bold mb-3">Готови ли сте да започнете?</h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Запишете се за групово обучение и направете първата стъпка към немски език.
              </p>
              <Button onClick={() => router.push("/auth")} size="lg"
                className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold rounded-xl px-8">
                Запишете се сега
              </Button>
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}
