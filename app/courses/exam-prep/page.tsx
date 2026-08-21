"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, BookOpen, Clock, Target, Zap, CheckCircle, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useLanguage } from "@/hooks/use-language"
import { LANGUAGE_META, type Language, translations } from "@/lib/i18n"

const flagStripes = ["bg-gray-900", "bg-red-600", "bg-yellow-400"]

const FEATURES = [
  { icon: <Clock className="w-5 h-5" />, color: "bg-red-500", title: "3 учебни часа", body: "Всеки урок е интензивен тричасов блок, фокусиран върху изпитния материал." },
  { icon: <Zap className="w-5 h-5" />, color: "bg-yellow-500", title: "Интензивност по нужда", body: "Програмата се адаптира спрямо датата на изпита — колкото по-близо, толкова по-интензивно." },
  { icon: <Target className="w-5 h-5" />, color: "bg-emerald-500", title: "Фокус върху сертификата", body: "Подготовка за официални изпити — Goethe-Zertifikat, TestDaF, DSD и др." },
  { icon: <CheckCircle className="w-5 h-5" />, color: "bg-blue-500", title: "Всички умения", body: "Четене, писане, слушане и говорене — цялостна подготовка за всяка секция на изпита." },
]

const EXAMS = [
  { name: "Goethe-Zertifikat", levels: "A1 – C2", color: "border-l-yellow-400" },
  { name: "TestDaF", levels: "B2 – C1", color: "border-l-blue-500" },
  { name: "DSD", levels: "A2 – C1", color: "border-l-emerald-500" },
  { name: "ÖSD", levels: "A1 – C2", color: "border-l-red-500" },
]

export default function ExamPrepPage() {
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = translations[language]

  return (
    <div className="min-h-screen bg-white">

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium">
              <ArrowLeft className="w-4 h-4" />
              Начало
            </Link>
            <div className="h-4 w-px bg-gray-300" />
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
          </div>
          <div className="flex items-center gap-3">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="h-8 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
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
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-red-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-12 h-48 w-48 rounded-full bg-yellow-400/10 blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6">
            <BookOpen className="w-3.5 h-3.5" />
            Подготовка за изпит
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4">
            Вземете сертификата,<br />който ви трябва
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Интензивна подготовка · 3 учебни часа на урок · Адаптирана към датата на вашия изпит
          </p>
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

        {/* Features */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Как работи подготовката</h2>
            <div className="mt-3 mx-auto w-16 h-1 rounded-full bg-yellow-400" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i}
                className="group relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className={`absolute top-0 left-6 right-6 h-0.5 rounded-full ${f.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${f.color} text-white mb-4`}>
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Supported exams */}
        <section className="pb-16 border-t border-gray-100 pt-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Изпити</h2>
            <div className="mt-3 mx-auto w-16 h-1 rounded-full bg-red-600" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {EXAMS.map((exam) => (
              <div key={exam.name}
                className={`flex items-center justify-between rounded-2xl border-l-4 ${exam.color} border border-gray-100 bg-gray-50 px-5 py-4 hover:bg-gray-100 transition-colors`}>
                <div>
                  <p className="font-bold text-gray-900">{exam.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Нива {exam.levels}</p>
                </div>
                <BookOpen className="w-5 h-5 text-gray-400" />
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-yellow-200 bg-yellow-50 px-5 py-4">
            <Zap className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800 font-medium">
              Интензивността на подготовката се определя спрямо датата на вашия изпит. Свържете се с нас за индивидуален план.
            </p>
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
        <section className="pb-24">
          <div className="rounded-3xl bg-gray-950 text-white overflow-hidden relative">
            <div className="flex h-1.5 w-full absolute top-0">
              {flagStripes.map((c) => <div key={c} className={`flex-1 ${c}`} />)}
            </div>
            <div className="px-8 py-14 text-center">
              <h2 className="text-3xl font-bold mb-3">Изпитът ви наближава?</h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Не чакайте — запишете се сега и започнете интензивна подготовка с опитен преподавател.
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
