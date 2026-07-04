"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Globe, Briefcase, GraduationCap, Users, Brain, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useLanguage } from "@/hooks/use-language"
import { LANGUAGE_META, type Language, translations } from "@/lib/i18n"

export default function WhyLearnGermanPage() {
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = translations[language]

  const reasons = [
    {
      icon: <Globe className="w-8 h-8 text-blue-600" />,
      title: t.whyGermanReason1Title,
      description: t.whyGermanReason1Description,
      stats: t.whyGermanReason1Stats,
    },
    {
      icon: <Briefcase className="w-8 h-8 text-green-600" />,
      title: t.whyGermanReason2Title,
      description: t.whyGermanReason2Description,
      stats: t.whyGermanReason2Stats,
    },
    {
      icon: <GraduationCap className="w-8 h-8 text-purple-600" />,
      title: t.whyGermanReason3Title,
      description: t.whyGermanReason3Description,
      stats: t.whyGermanReason3Stats,
    },
    {
      icon: <Users className="w-8 h-8 text-orange-600" />,
      title: t.whyGermanReason4Title,
      description: t.whyGermanReason4Description,
      stats: t.whyGermanReason4Stats,
    },
    {
      icon: <Brain className="w-8 h-8 text-red-600" />,
      title: t.whyGermanReason5Title,
      description: t.whyGermanReason5Description,
      stats: t.whyGermanReason5Stats,
    },
    {
      icon: <Heart className="w-8 h-8 text-pink-600" />,
      title: t.whyGermanReason6Title,
      description: t.whyGermanReason6Description,
      stats: t.whyGermanReason6Stats,
    },
  ]

  const industries = [
    t.whyGermanIndustry1,
    t.whyGermanIndustry2,
    t.whyGermanIndustry3,
    t.whyGermanIndustry4,
    t.whyGermanIndustry5,
    t.whyGermanIndustry6,
  ]

  const testimonials = [
    {
      name: t.whyGermanTestimonial1Name,
      role: t.whyGermanTestimonial1Role,
      content: t.whyGermanTestimonial1Content,
      avatar: t.whyGermanTestimonial1Avatar,
    },
    {
      name: t.whyGermanTestimonial2Name,
      role: t.whyGermanTestimonial2Role,
      content: t.whyGermanTestimonial2Content,
      avatar: t.whyGermanTestimonial2Avatar,
    },
    {
      name: t.whyGermanTestimonial3Name,
      role: t.whyGermanTestimonial3Role,
      content: t.whyGermanTestimonial3Content,
      avatar: t.whyGermanTestimonial3Avatar,
    },
  ]

  const flagStripes = ["bg-gray-900", "bg-red-600", "bg-yellow-400"]

    return (
    <div className="min-h-screen bg-white">
 
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium">
              <ArrowLeft className="w-4 h-4" />
              {t.whyGermanBackToHome}
            </Link>
            <div className="h-4 w-px bg-gray-300" />
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white shadow-sm border border-gray-100">
                <Image src="/dudlogo.png" alt={t.appName} width={20} height={20} />
              </div>
              <span className="font-bold text-gray-900 text-sm">{t.appName}</span>
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
            <Button onClick={() => router.push("/auth")} size="sm" className="bg-gray-900 hover:bg-gray-700 text-white rounded-lg">
              {t.whyGermanPrimaryCta}
            </Button>
          </div>
        </div>
      </header>
 
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gray-950 text-white">
        {/* German flag stripe accent — top of section */}
        <div className="flex h-1.5 w-full">
          {flagStripes.map((c) => <div key={c} className={`flex-1 ${c}`} />)}
        </div>
 
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "40px 40px" }}
        />
 
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gray-400 mb-8">
            {t.whyGermanBadge}
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            {t.whyGermanTitle}
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {t.whyGermanSubtitle}
          </p>
          <div className="mt-10 flex flex-wrap gap-3 justify-center">
            <Button onClick={() => router.push("/auth")} size="lg"
              className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold rounded-xl px-8">
              {t.whyGermanPrimaryCta}
            </Button>
            <Button onClick={() => router.push("/#courses")} size="lg" variant="outline"
              className="border-white/20 text-white hover:bg-white/10 rounded-xl px-8 bg-transparent">
              {t.whyGermanCtaSecondary}
            </Button>
          </div>
        </div>
 
        {/* German flag stripe accent — bottom of section */}
        <div className="flex h-1.5 w-full">
          {flagStripes.map((c) => <div key={c} className={`flex-1 ${c}`} />)}
        </div>
      </section>
 
      <main className="max-w-7xl mx-auto px-4 sm:px-6">
 
        {/* ── Reasons grid ── */}
        <section className="py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              {t.whyGermanReasonsTitle}
            </h2>
            <div className="mt-3 mx-auto w-16 h-1 rounded-full bg-yellow-400" />
          </div>
 
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reasons.map((reason, i) => (
              <div key={i}
                className="group relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                {/* Colored top border on hover */}
                <div className={`absolute top-0 left-6 right-6 h-0.5 rounded-full ${reason.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
 
                <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${reason.color} text-white mb-4`}>
                  {reason.icon}
                </div>
 
                <Badge variant="secondary" className="mb-3 text-xs font-semibold">
                  {reason.stats}
                </Badge>
 
                <h3 className="text-lg font-bold text-gray-900 mb-2">{reason.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{reason.description}</p>
              </div>
            ))}
          </div>
        </section>
 
        {/* ── Industries ── */}
        <section className="py-16 border-t border-gray-100">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">{t.whyGermanIndustriesTitle}</h2>
            <div className="mt-3 mx-auto w-16 h-1 rounded-full bg-red-600" />
          </div>
 
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {industries.map((industry, i) => (
              <div key={i}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors text-center">
                <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-yellow-400" />
                </div>
                <p className="text-xs font-semibold text-gray-700 leading-snug">{industry}</p>
              </div>
            ))}
          </div>
        </section>
 
        {/* ── Testimonials ── */}
        <section className="py-16 border-t border-gray-100">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">{t.whyGermanTestimonialsTitle}</h2>
            <div className="mt-3 mx-auto w-16 h-1 rounded-full bg-gray-900" />
          </div>
 
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col gap-4">
                {/* Quote mark */}
                <span className="text-5xl leading-none text-gray-200 font-serif select-none">"</span>
                <p className="text-gray-600 text-sm leading-relaxed -mt-4 flex-1">
                  {testimonial.content}
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-gray-900 text-yellow-400 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-xs text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
 
        {/* ── CTA Banner ── */}
        <section className="py-16 border-t border-gray-100 pb-24">
          <div className="rounded-3xl bg-gray-950 text-white overflow-hidden relative">
            <div className="flex h-1.5 w-full absolute top-0">
              {flagStripes.map((c) => <div key={c} className={`flex-1 ${c}`} />)}
            </div>
            <div className="px-8 py-14 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Bereit anzufangen?
              </h2>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                {t.whyGermanSubtitle}
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button onClick={() => router.push("/auth")} size="lg"
                  className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold rounded-xl px-8">
                  {t.whyGermanPrimaryCta}
                </Button>
                <Button onClick={() => router.push("/#courses")} size="lg" variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 rounded-xl px-8 bg-transparent">
                  {t.whyGermanCtaSecondary}
                </Button>
              </div>
            </div>
          </div>
        </section>
 
      </main>
    </div>
  )

}
