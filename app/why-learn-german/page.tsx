"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Lora, Caveat } from "next/font/google"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/hooks/use-language"
import { LANGUAGE_META, type Language, translations } from "@/lib/i18n"

const serif = Lora({ subsets: ["latin", "cyrillic"], display: "swap" })
const hand = Caveat({ subsets: ["latin", "cyrillic"], weight: ["500", "700"], display: "swap" })

// TODO: replace with a real portrait (e.g. drop /teacher.jpg into /public).
const TEACHER_PHOTO = "/placeholder-user.jpg"
const SIDE_PHOTO = { src: "/Ph5.jpg", caption: "Neuschwanstein" }
const CONTACT_EMAIL = "rosi_vasseva@abv.bg"

const BRAND_RED = "text-[#D10026]"

function Tape({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`absolute h-6 w-24 bg-yellow-200/70 shadow-sm ${className}`}
    />
  )
}

export default function AboutPage() {
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const t = translations[language]

  const approach = [
    { title: t.aboutApproach1Title, text: t.aboutApproach1Text },
    { title: t.aboutApproach2Title, text: t.aboutApproach2Text },
    { title: t.aboutApproach3Title, text: t.aboutApproach3Text },
  ]

  const offers = [
    { href: "/courses/group", title: t.offersGroupTitle, text: t.aboutOfferGroupText },
    { href: "/courses/individual", title: t.offersIndividualTitle, text: t.aboutOfferIndividualText },
    { href: "/courses/exam-prep", title: t.offersExamPrepTitle, text: t.aboutOfferExamText },
  ]

  const reasons = [
    { title: t.whyGermanReason1Title, text: t.whyGermanReason1Description },
    { title: t.whyGermanReason2Title, text: t.whyGermanReason2Description },
    { title: t.whyGermanReason3Title, text: t.whyGermanReason3Description },
    { title: t.whyGermanReason4Title, text: t.whyGermanReason4Description },
    { title: t.whyGermanReason5Title, text: t.whyGermanReason5Description },
    { title: t.whyGermanReason6Title, text: t.whyGermanReason6Description },
  ]

  return (
    <div className="min-h-screen bg-[#FBF7F0] text-stone-800">

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-[#FBF7F0]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors text-sm font-medium">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{t.whyGermanBackToHome}</span>
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
      </header>

      <main>

        {/* ── Wer bin ich ── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-20 sm:pt-20 sm:pb-28">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-14 md:gap-10 items-start">
            <div className="md:col-span-7 md:pt-6">
              <p className={`${hand.className} ${BRAND_RED} text-3xl -rotate-2 origin-left`}>
                {t.aboutMeTitle}
              </p>
              <h1 className={`${serif.className} mt-3 text-4xl sm:text-5xl leading-[1.15] font-semibold text-stone-900`}>
                {t.aboutGreeting}
              </h1>
              <div className="mt-8 space-y-5 text-lg leading-relaxed text-stone-600 max-w-xl">
                <p>{t.aboutMeBio1}</p>
                <p>{t.aboutMeBio2}</p>
              </div>
            </div>

            {/* Photos, pinned like prints */}
            <div className="md:col-span-5 relative mx-auto w-full max-w-sm md:max-w-none">
              <figure className="relative z-10 w-[78%] rotate-2 bg-white p-3 pb-4 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.25)]">
                <Tape className="-top-3 left-1/2 -translate-x-1/2 -rotate-3" />
                <div className="relative aspect-[4/5] bg-stone-100">
                  <Image src={TEACHER_PHOTO} alt={t.aboutPhotoCaption} fill sizes="320px" className="object-cover" />
                </div>
                <figcaption className={`${hand.className} mt-3 text-center text-2xl text-stone-700`}>
                  {t.aboutPhotoCaption}
                </figcaption>
              </figure>
              <figure className="absolute right-0 top-[52%] z-20 w-[46%] rotate-[5deg] bg-white p-2 pb-3 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)]">
                <Tape className="-top-3 right-4 rotate-6 w-16" />
                <div className="relative aspect-square bg-stone-100">
                  <Image src={SIDE_PHOTO.src} alt={SIDE_PHOTO.caption} fill sizes="200px" className="object-cover" />
                </div>
                <figcaption className={`${hand.className} mt-2 text-center text-lg text-stone-600`}>
                  {SIDE_PHOTO.caption}
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* ── Woher kommt der Name ── */}
        <section className="border-y border-stone-200 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
            <h2 className={`${serif.className} text-2xl sm:text-3xl font-semibold text-stone-900`}>{t.aboutTitle}</h2>
            <p className='mt-8 font-["Gummy_Twist"] text-5xl sm:text-7xl leading-none text-stone-900'>
              <span className={BRAND_RED}>Deutsch</span>
              <span className="mx-3 text-stone-400">+</span>
              erei
            </p>
            <p className="mt-8 text-lg leading-relaxed text-stone-600">{t.aboutNameText}</p>
          </div>
        </section>

        {/* ── So arbeite ich ── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-24">
          <h2 className={`${serif.className} text-3xl sm:text-4xl font-semibold text-stone-900`}>{t.aboutApproachTitle}</h2>
          <ol className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
            {approach.map((item, i) => (
              <li key={item.title} className="border-t-2 border-stone-900 pt-5">
                <span className={`${serif.className} ${BRAND_RED} text-xl font-semibold`}>{i + 1}.</span>
                <h3 className="mt-2 text-lg font-semibold text-stone-900">{item.title}</h3>
                <p className="mt-2 leading-relaxed text-stone-600">{item.text}</p>
              </li>
            ))}
          </ol>

          <blockquote className="mt-20 max-w-3xl mx-auto text-center">
            <p className={`${serif.className} text-2xl sm:text-3xl italic leading-snug text-stone-800`}>
              „{t.aboutQuote}“
            </p>
          </blockquote>
        </section>

        {/* ── Kurse ── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
          <h2 className={`${serif.className} text-3xl sm:text-4xl font-semibold text-stone-900`}>{t.aboutOfferTitle}</h2>
          <ul className="mt-10 divide-y divide-stone-200 border-y border-stone-200">
            {offers.map((offer) => (
              <li key={offer.href}>
                <Link
                  href={offer.href}
                  className="group grid grid-cols-[1fr_auto] sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)_auto] items-center gap-x-6 gap-y-1 py-6 px-2 transition-colors hover:bg-white focus:outline-none focus:bg-white"
                >
                  <span className={`${serif.className} text-xl font-semibold text-stone-900`}>{offer.title}</span>
                  <span className="col-start-1 row-start-2 sm:col-start-auto sm:row-start-auto text-stone-500">{offer.text}</span>
                  <span className="row-span-2 sm:row-span-1 col-start-2 row-start-1 sm:col-start-auto sm:row-start-auto inline-flex items-center gap-1.5 text-sm font-medium text-stone-900">
                    <span className="hidden sm:inline">{t.aboutLearnMore}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Warum Deutsch ── */}
        <section className="border-t border-stone-200 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-24 grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div>
              <h2 className={`${serif.className} text-3xl sm:text-4xl font-semibold text-stone-900`}>{t.aboutWhyTitle}</h2>
              <p className="mt-4 text-stone-600 leading-relaxed">{t.aboutWhyIntro}</p>
            </div>
            <dl className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
              {reasons.map((reason) => (
                <div key={reason.title}>
                  <dt className="font-semibold text-stone-900">{reason.title}</dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-stone-500">{reason.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── Kontakt ── */}
        <section className="border-t border-stone-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 sm:py-24 text-center">
            <h2 className={`${serif.className} text-3xl sm:text-4xl font-semibold text-stone-900`}>{t.aboutContactTitle}</h2>
            <p className="mt-5 text-lg leading-relaxed text-stone-600">{t.aboutContactText}</p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-6 inline-block text-lg font-medium text-stone-900 underline decoration-[#D10026] decoration-2 underline-offset-4 hover:text-[#D10026] break-all"
            >
              {CONTACT_EMAIL}
            </a>
            <p className={`${hand.className} ${BRAND_RED} mt-10 text-4xl -rotate-2`}>{t.aboutSignature}</p>
            <div className="mt-12 flex flex-wrap justify-center gap-3">
              <Button onClick={() => router.push("/auth")} size="lg" className="rounded-md bg-stone-900 px-7 text-white hover:bg-stone-700">
                {t.whyGermanPrimaryCta}
              </Button>
              <Button onClick={() => router.push("/reviews")} size="lg" variant="outline" className="rounded-md border-stone-300 bg-transparent px-7 text-stone-800 hover:bg-white">
                {t.reviewsBadge}
              </Button>
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}
