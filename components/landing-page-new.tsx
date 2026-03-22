"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { useState } from "react"
import { LANGUAGE_META, type Language, type TranslationDictionary } from "@/lib/i18n"
import type { SessionUser, EventRow } from "@/lib/db"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { smoothScrollTo } from "@/lib/smooth-scroll"
import HeroSection from "@/components/sections/hero-section"
import CoursesSection from "@/components/sections/courses-section"
import ReviewsSection from "@/components/sections/reviews-section"
import EventsSection from "@/components/sections/events-section"

type Props = {
  language: Language
  onLanguageChange: (value: Language) => void
  t: TranslationDictionary
  locale: string
  events: EventRow[]
  eventsLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  user: SessionUser | null
  onLogin: () => void
  onContinueAsGuest: () => void
  onViewEventDetails: (eventId: number) => void
}

export default function NewLandingPage({
  language,
  onLanguageChange,
  t,
  locale,
  events,
  eventsLoading,
  isAuthenticated,
  isAdmin,
  user,
  onLogin,
  onContinueAsGuest,
  onViewEventDetails,
}: Props) {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLearnWithUs = () => {
    smoothScrollTo("courses")
  }

  const handleWhyLearnGerman = () => {
    router.push("/why-learn-german")
  }

  const handleViewSchedule = () => {
    router.push("/auth")
  }

  const handleEnroll = (courseId: string) => {
    router.push("/auth")
  }

  const handleViewEventDetails = (eventId: number) => {
    // Call the handler passed from the main page
    onViewEventDetails(eventId)
  }

  const handleViewExcursions = () => {
    smoothScrollTo("events")
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
                <Image src="/dudlogo.png" alt={`${t.appName} logo`} width={28} height={28} />
              </div>
              <span className="text-lg font-bold tracking-tight text-gray-900">{t.appName}</span>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <button
                onClick={handleLearnWithUs}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                {t.courses}
              </button>
              <button
                onClick={handleViewExcursions}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                {t.excursions}
              </button>
              <button
                onClick={handleWhyLearnGerman}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                {t.whyLearnGerman}
              </button>
              <button
                onClick={handleViewSchedule}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                {t.viewSchedule}
              </button>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <select
                value={language}
                onChange={(e) => onLanguageChange(e.target.value as Language)}
                className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Website language"
              >
                {Object.entries(LANGUAGE_META).map(([value, meta]) => (
                  <option key={value} value={value}>
                    {meta.label}
                  </option>
                ))}
              </select>

              {/* Login Button */}
              <Button
                onClick={onLogin}
                variant="outline"
                className="hidden sm:inline-flex border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                {t.loginSignup}
              </Button>

              {/* Continue as Guest Button */}
              <Button
                onClick={onContinueAsGuest}
                variant="ghost"
                className="hidden sm:inline-flex text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              >
                {t.continueAsGuest}
              </Button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <nav className="flex flex-col gap-4">
                <button
                  onClick={() => {
                    handleLearnWithUs()
                    setMobileMenuOpen(false)
                  }}
                  className="text-left text-gray-600 hover:text-gray-900 font-medium transition-colors py-2"
                >
                  {t.courses}
                </button>
                <button
                  onClick={() => {
                    handleViewExcursions()
                    setMobileMenuOpen(false)
                  }}
                  className="text-left text-gray-600 hover:text-gray-900 font-medium transition-colors py-2"
                >
                  {t.excursions}
                </button>
                <button
                  onClick={() => {
                    handleWhyLearnGerman()
                    setMobileMenuOpen(false)
                  }}
                  className="text-left text-gray-600 hover:text-gray-900 font-medium transition-colors py-2"
                >
                  {t.whyLearnGerman}
                </button>
                <button
                  onClick={() => {
                    handleViewSchedule()
                    setMobileMenuOpen(false)
                  }}
                  className="text-left text-gray-600 hover:text-gray-900 font-medium transition-colors py-2"
                >
                  {t.viewSchedule}
                </button>
                <Button
                  onClick={() => {
                    onLogin()
                    setMobileMenuOpen(false)
                  }}
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  {t.loginSignup}
                </Button>
                <Button
                  onClick={() => {
                    onContinueAsGuest()
                    setMobileMenuOpen(false)
                  }}
                  variant="ghost"
                  className="w-full text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  {t.continueAsGuest}
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <HeroSection
          onLearnWithUs={handleLearnWithUs}
          onWhyLearnGerman={handleWhyLearnGerman}
          onViewSchedule={handleViewSchedule}
          t={t}
        />

        {/* Courses Section */}
        <CoursesSection
          onEnroll={handleEnroll}
          t={t}
        />

        {/* Events Section */}
        <EventsSection
          events={events}
          eventsLoading={eventsLoading}
          onViewEventDetails={handleViewEventDetails}
          t={t}
          locale={locale}
        />

        {/* Reviews Section */}
        <ReviewsSection
          isAuthenticated={isAuthenticated}
          isAdmin={isAdmin}
          user={user}
          onLogin={onLogin}
          t={t}
          locale={locale}
          limit={6}
        />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex items-center gap-2.5 mb-4 hover:opacity-80 transition-opacity text-left"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
                  <Image src="/dudlogo.png" alt={`${t.appName} logo`} width={28} height={28} />
                </div>
                <span className="text-lg font-bold">{t.appName}</span>
              </button>
              <p className="text-gray-300 mb-4 max-w-md">
                {t.footerDescription}
              </p>
              <div className="flex gap-4">
                <Button variant="outline" size="sm" className="border-gray-600 text-gray-700 hover:bg-gray-800">
                  {t.socialFacebook}
                </Button>
                <Button variant="outline" size="sm" className="border-gray-600 text-gray-700 hover:bg-gray-800">
                  {t.socialInstagram}
                </Button>
                <Button variant="outline" size="sm" className="border-gray-600 text-gray-700 hover:bg-gray-800">
                  {t.socialLinkedIn}
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">{t.quickLinks}</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <button onClick={handleLearnWithUs} className="hover:text-white transition-colors">
                    {t.courses}
                  </button>
                </li>
                <li>
                  <button onClick={handleViewExcursions} className="hover:text-white transition-colors">
                    {t.excursions}
                  </button>
                </li>
                <li>
                  <button onClick={handleWhyLearnGerman} className="hover:text-white transition-colors">
                    {t.whyLearnGerman}
                  </button>
                </li>
                <li>
                  <button onClick={onLogin} className="hover:text-white transition-colors">
                    {t.loginSignup}
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-semibold mb-4">{t.contact}</h3>
              <ul className="space-y-2 text-gray-300">
                <li>{t.phoneLabel} <a href="tel:+359888559913" className="hover:text-white transition-colors">+359 888 559 913</a></li>
                <li>
                  <a 
                    href="https://maps.app.goo.gl/Ghicy5quB8bFGZe48"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    {t.location}
                  </a>
                </li>
                <li>{t.emailLabel} <a href="mailto:rosi@vasileva.gmail.com" className="hover:text-white transition-colors">rosi@vasileva.gmail.com</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 {t.appName}. {t.allRightsReserved}.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
