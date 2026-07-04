"use client"

import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { TranslationDictionary } from "@/lib/i18n"
import ClassDetailPanel from "../class-detail-panel"

interface HeroSectionProps {
  onLearnWithUs: () => void
  onWhyLearnGerman: () => void
  onViewSchedule: () => void
  t: TranslationDictionary
}

function GermanFlag()
{
    return (
        <div>
            <img src="/flagAllesPNG.png" alt="Flag"
            className="w-[750px] max-w-[85vw]" />
            
        </div>
    );
}

const SCATTER_IMAGES = [
    {src: "/A.png", className: "bottom-25 left-15 w-32 h-24 rotate-[-6deg] md:bottom-50 md:left-20 md:w-20 h-30" },
    {src: "/CH.png", className: "top-15 right-5 w-32 h-24 rotate-[-6deg] md:top-34 md:left-75 md:w-28 md:h-20 md:rotate-[4deg]" },
    {src: "/L.png", className: "bottom-151 left-5 w-26 h-25 rotate-[10deg] md:top-61 md:left-25 md:w-26 md:h-25 md:rotate-[10deg]"},
    {src: "/FL.png", className: "bottom-120 right-15 w-23 h-21 rotate-[7deg] md:bottom-120 md:right-40 md:w-23 md:h-21 md:rotate-[7deg]" },
    {src: "/D.png", className: "bottom-57 right-2 w-31 h-25 rotate-[-9deg] md:bottom-57 md:right-22 md:w-31 md:h-25 md:rotate-[-9deg]"}

]



export default function HeroSection({ onLearnWithUs, onWhyLearnGerman, onViewSchedule, t }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradients */}
     {/*} <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-orange-50" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.1),transparent_50%),radial-gradient(circle_at_bottom_right,rgba(251,146,60,0.1),transparent_40%)]" />
     
      {/* Decorative elements 
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000" />
      */}

      {SCATTER_IMAGES.map((img) => (
        <div
            key={img.src}
            className={`absolute ${img.className} z-[5] overflow-hidden `}
            >

            <img src={img.src} alt="" className="w-full h-full object-cover"/>

        </div>
      ))}
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <GermanFlag />
        {/* Badge */}
        {/*<div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 backdrop-blur-sm px-4 py-2 text-sm font-semibold text-blue-700 mb-8">
          {t.heroBadge}
        </div>*/}
       {/* 
        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-grey mb-6 leading-tight">
          {t.heroTitle}
          <span className="block text-red-500 mt-2">
            {t.heroTitleHighlight}
          </span>
            <p className="text-lg sm:text-xl lg:text-6xl text-yellow-300 mb-12 max-w-4xl mx-auto leading-relaxed font-bold">
            {t.heroSubtitle}
            </p>
        </h1>
       */}

        
        
        
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center text-sm text-white/70">
          <Button
            onClick={onLearnWithUs}
            size="lg"
            variant="outline"
            className="border border-gray-600 bg-black hover:bg-gray-800 hover:border-gray-400 hover:text-white-200 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-2 transform"
          >
            {t.learnWithUs}
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
          
          <Button
            onClick={onWhyLearnGerman}
            size="lg"
            variant="outline"
            className="border border-gray-600 bg-red-700 hover:bg-red-800 hover:border-gray-400 hover:text-white-200 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-2 transform"
          >
            {t.whyLearnGerman}
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
          
          <Button
            onClick={onViewSchedule}
           size="lg"
            variant="outline"
            className="border border-gray-600 bg-yellow-500 hover:bg-yellow-600 hover:border-gray-400 hover:text-white-200 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-2 transform"
          >
            {t.viewSchedule}
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
        
        {/* Trust indicators */}
        <div className="flex flex-col sm:flex-row sm:gap-14 gap-4 justify-center items-center text-sm text-white mt-3">
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
