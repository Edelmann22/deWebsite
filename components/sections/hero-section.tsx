"use client"

import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { TranslationDictionary } from "@/lib/i18n"

interface HeroSectionProps {
  onLearnWithUs: () => void
  onWhyLearnGerman: () => void
  onViewSchedule: () => void
  t: TranslationDictionary
}

export default function HeroSection({ onLearnWithUs, onWhyLearnGerman, onViewSchedule, t }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-orange-50" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.1),transparent_50%),radial-gradient(circle_at_bottom_right,rgba(251,146,60,0.1),transparent_40%)]" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        {/*<div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 backdrop-blur-sm px-4 py-2 text-sm font-semibold text-blue-700 mb-8">
          {t.heroBadge}
        </div>*/}
        
        {/* Main headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-6 leading-tight">
          {t.heroTitle}
          <span className="block text-red-500 mt-2">
            {t.heroTitleHighlight}
          </span>
        </h1>
        
        {/* Supporting description */}
        <p className="text-lg sm:text-xl lg:text-3xl text-yellow-400 mb-12 max-w-4xl mx-auto leading-relaxed font-bold">
          {t.heroSubtitle}
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Button
            onClick={onLearnWithUs}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            {t.learnWithUs}
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
          
          <Button
            onClick={onWhyLearnGerman}
            variant="outline"
            size="lg"
            className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-4 text-lg font-semibold rounded-xl bg-white/80 backdrop-blur-sm hover:bg-gray-50 transition-all duration-300"
          >
            {t.whyLearnGerman}
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
          
          <Button
            onClick={onViewSchedule}
            variant="secondary"
            size="lg"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            {t.viewSchedule}
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
        
        {/* Trust indicators */}
        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            {t.trustIndicator1}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            {t.trustIndicator2}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            {t.trustIndicator3}
          </div>
        </div>
      </div>
      
    </section>
  )
}
