"use client"

import type { EventRow } from "@/lib/db"
import Image from "next/image"
import { LANGUAGE_META, type Language, type TranslationDictionary } from "@/lib/i18n"
import { ChevronRight, Sparkles, Users, Briefcase, Newspaper, Megaphone, Rocket, Star } from "lucide-react"

type Offer = { title: string; body: string; icon: React.ReactNode }
type NewsItem = { title: string; body: string; icon: React.ReactNode }

type Props = {
  language: Language
  onLanguageChange: (value: Language) => void
  t: TranslationDictionary
  locale: string
  events: EventRow[]
  eventsLoading: boolean
  onGetStarted: () => void
  onLogin: () => void
}

function formatEventDate(value: string, locale: string) {
  return new Date(value + "T12:00:00").toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function eventPreview(html: string, wordLimit = 18) {
  if (!html) return ""
  const doc = new DOMParser().parseFromString(html, "text/html")
  const text = (doc.body.textContent ?? "").replace(/\s+/g, " ").trim()
  if (!text) return ""
  const words = text.split(" ")
  if (words.length <= wordLimit) return text
  return `${words.slice(0, wordLimit).join(" ")}…`
}

export default function LandingPage({
  language,
  onLanguageChange,
  t,
  locale,
  events,
  eventsLoading,
  onGetStarted,
  onLogin,
}: Props) {
  const offers: Offer[] = [
    { title: t.offerKidsTitle, body: t.offerKidsBody, icon: <Sparkles size={18} /> },
    { title: t.offerTeensTitle, body: t.offerTeensBody, icon: <Users size={18} /> },
    { title: t.offerAdultsTitle, body: t.offerAdultsBody, icon: <Briefcase size={18} /> },
  ]

  const news: NewsItem[] = [
    { title: t.newsOneTitle, body: t.newsOneBody, icon: <Megaphone size={18} /> },
    { title: t.newsTwoTitle, body: t.newsTwoBody, icon: <Rocket size={18} /> },
    { title: t.newsThreeTitle, body: t.newsThreeBody, icon: <Star size={18} /> },
  ]

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(91,175,189,0.16),transparent_40%),radial-gradient(circle_at_top_right,rgba(234,179,90,0.16),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(111,80,200,0.08),transparent_45%)]" />
      <div className="relative z-10">
        <header className="sticky top-0 z-40 border-b border-border bg-card/85 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
                <Image src="/dudlogo.png" alt={`${t.appName} logo`} width={28} height={28} />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">{t.appName}</span>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={language}
                onChange={(e) => onLanguageChange(e.target.value as Language)}
                className="h-9 rounded-lg border border-border bg-card px-3 text-sm text-foreground"
                aria-label="Website language"
              >
                {Object.entries(LANGUAGE_META).map(([value, meta]) => (
                  <option key={value} value={value}>
                    {meta.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={onLogin}
                className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary"
              >
                {t.loginSignup}
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 pb-16 pt-10 sm:px-6">
          <section className="grid items-center gap-10 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="flex flex-col gap-6">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                <Sparkles size={12} />
                {t.heroBadge}
              </span>
              <h1 className="text-4xl font-bold leading-tight text-foreground sm:text-5xl">
                {t.heroTitle}
              </h1>
              <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
                {t.heroSubtitle}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onGetStarted}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
                >
                  {t.getStarted}
                  <ChevronRight size={16} />
                </button>
                <button
                  type="button"
                  onClick={onLogin}
                  className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground hover:bg-secondary"
                >
                  {t.loginSignup}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">{t.heroFootnote}</p>
            </div>

            <div className="relative">
              <div className="absolute -left-6 -top-6 h-24 w-24 rounded-3xl bg-accent/25 blur-2xl" />
              <div className="absolute -bottom-8 -right-8 h-28 w-28 rounded-full bg-primary/20 blur-2xl" />
              <div className="grid gap-4 rounded-[2rem] border border-border bg-card/90 p-6 shadow-[0_30px_70px_rgba(60,40,10,0.18)]">
                <div className="flex items-center gap-3 rounded-2xl border border-border bg-secondary/60 p-4">
                  <CalendarDays size={18} className="text-primary" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.heroHighlightOneTitle}</p>
                    <p className="text-xs text-muted-foreground">{t.heroHighlightOneBody}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-border bg-secondary/60 p-4">
                  <Newspaper size={18} className="text-primary" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.heroHighlightTwoTitle}</p>
                    <p className="text-xs text-muted-foreground">{t.heroHighlightTwoBody}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-border bg-secondary/60 p-4">
                  <Sparkles size={18} className="text-primary" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.heroHighlightThreeTitle}</p>
                    <p className="text-xs text-muted-foreground">{t.heroHighlightThreeBody}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{t.offersTitle}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{t.offersSubtitle}</p>
              </div>
              <span className="hidden rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground sm:inline">
                {t.offersBadge}
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {offers.map((offer) => (
                <div key={offer.title} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-secondary text-primary">
                      {offer.icon}
                    </span>
                    {offer.title}
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{offer.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.15fr,0.85fr]">
            <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground">{t.eventsTitle}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{t.eventsSubtitle}</p>
                </div>
                <CalendarDays size={20} className="text-primary" />
              </div>
              {eventsLoading && (
                <div className="rounded-xl border border-border bg-secondary/60 p-4 text-sm text-muted-foreground">
                  {t.eventsLoading}
                </div>
              )}
              {!eventsLoading && events.length === 0 && (
                <div className="rounded-xl border border-dashed border-border bg-secondary/40 p-4 text-sm text-muted-foreground">
                  {t.eventsEmpty}
                </div>
              )}
              <div className="grid gap-4">
                {events.slice(0, 3).map((event) => (
                  <div key={event.id} className="rounded-xl border border-border bg-background/70 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{event.title}</p>
                        {event.event_date && (
                          <p className="mt-1 text-xs text-muted-foreground">{formatEventDate(event.event_date, locale)}</p>
                        )}
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">{eventPreview(event.content_html)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground">{t.newsTitle}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{t.newsSubtitle}</p>
                </div>
                <Newspaper size={20} className="text-primary" />
              </div>
              <div className="grid gap-4">
                {news.map((item) => (
                  <div key={item.title} className="rounded-xl border border-border bg-background/70 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-secondary text-primary">
                        {item.icon}
                      </span>
                      {item.title}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
