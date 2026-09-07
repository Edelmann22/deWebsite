"use client"

import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { TranslationDictionary } from "@/lib/i18n"
import { smoothScrollTo } from "@/lib/smooth-scroll"
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

export default function HeroSection({ onLearnWithUs, onWhyLearnGerman, onViewSchedule, t }: HeroSectionProps) {
  return (
    <section className="relative h-screen max-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradients */}
     {/*} <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-orange-50" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.1),transparent_50%),radial-gradient(circle_at_bottom_right,rgba(251,146,60,0.1),transparent_40%)]" />
     
      {/* Decorative elements 
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000" />
      */}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center popinter-events-none">
        <GermanFlag />
        <div className="mx-auto mt-1 flex min-h-[96px] w-[420px] max-w-[90vw] items-center justify-center text-[#D10026] sm:h-[60px] sm:min-h-0">
            <p className='font-["Gummy_Twist"] max-w-[90vw] text-center text-[42px] leading-none sm:whitespace-nowrap sm:text-[72px] lg:text-[76px]'>
              <span className="block sm:inline">Die</span>{" "}
              <span className="block sm:inline">beliebte</span>{" "}
              <a
                href="#courses"
                onClick={(event) => {
                  event.preventDefault()
                  smoothScrollTo("courses")
                }}
                className="block text-[30px] text-[#FFE13A] hover:text-blue-700 sm:inline sm:text-[72px] lg:text-[76px]"
              >
                Sprachwerkstatt
              </a>
            </p>
        </div>

        {/* CTA Buttons */}
        {/*<div className="flex flex-col sm:flex-row gap-8 justify-center items-center text-sm text-white/70">
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
        </div> */}
        
        {/* Trust indicators */}
        {/* 
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
        */}
      </div>
      
    </section>
  )
}
