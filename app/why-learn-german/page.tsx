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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Navigation */}
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
              {t.whyGermanBackToHome}
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
              {t.whyGermanPrimaryCta}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <Badge className="mb-4 px-4 py-2 text-sm font-semibold">
            {t.whyGermanBadge}
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            {t.whyGermanTitle}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t.whyGermanSubtitle}
          </p>
        </section>

        {/* Main Reasons Grid */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {t.whyGermanReasonsTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reasons.map((reason, index) => (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-gray-50 rounded-full w-fit">
                    {reason.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {reason.title}
                  </CardTitle>
                  <Badge variant="secondary" className="w-fit mx-auto">
                    {reason.stats}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-gray-600 leading-relaxed">
                    {reason.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Industry Applications */}
        <section className="mb-20 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            {t.whyGermanIndustriesTitle}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {industries.map((industry, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-gray-700">{industry}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {t.whyGermanTestimonialsTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="shadow-md">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                      <CardDescription>{testimonial.role}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            {t.whyGermanCtaTitle}
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            {t.whyGermanCtaSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => router.push("/")}
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              {t.whyGermanCtaSecondary}
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => router.push("/auth")}
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              {t.whyGermanCtaPrimary}
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
}
