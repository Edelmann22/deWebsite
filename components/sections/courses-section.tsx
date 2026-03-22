"use client"

import { Clock, Users, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { TranslationDictionary } from "@/lib/i18n"

interface Offer {
  id: string
  title: string
  duration: string
  price: number
  description: string
  features: string[]
  popular?: boolean
}

interface CoursesSectionProps {
  onEnroll: (courseId: string) => void
  t: TranslationDictionary
}

export default function CoursesSection({ onEnroll, t }: CoursesSectionProps) {
  const offers: Offer[] = [
    {
      id: "single-lesson",
      title: t.singleLessonTitle,
      duration: t.singleLessonDuration,
      price: 60,
      description: t.singleLessonDescription,
      features: [
        t.singleLessonFeature1,
        t.singleLessonFeature2,
        t.singleLessonFeature3,
        t.singleLessonFeature4,
      ],
    },
    {
      id: "package-10",
      title: t.package10Title,
      duration: t.package10Duration,
      price: 300,
      description: t.package10Description,
      features: [
        t.package10Feature1,
        t.package10Feature2,
        t.package10Feature3,
        t.package10Feature4,
      ],
      popular: true,
    },
  ]

  return (
    <section id="courses" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-semibold">
            {t.coursesBadge}
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {t.offersTitle}
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            {t.offersSubtitle}
          </p>
        </div>

        {/* Offer Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {offers.map((offer) => (
            <Card key={offer.id} className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${offer.popular ? 'ring-2 ring-blue-500 shadow-lg' : 'shadow-md'}`}>
              {/* Popular Badge */}
              {offer.popular && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-blue-500 text-white px-3 py-1 text-xs font-semibold">
                    {t.popularBadge}
                  </Badge>
                </div>
              )}

              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-gray-900">
                  {offer.title}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {offer.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Offer Info */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {offer.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {t.classSize}
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-2 mb-6">
                  {offer.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Price and CTA */}
                <div className="border-t pt-4">
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-bold text-gray-900">€{offer.price}</span>
                    <span className="text-sm text-gray-500">/{t.perOffer}</span>
                  </div>
                  <Button 
                    onClick={() => onEnroll(offer.id)}
                    className={`w-full ${offer.popular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-900 hover:bg-gray-800'} text-white font-semibold py-3 transition-all duration-300`}
                  >
                    {t.enrollNow}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info 
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-md p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t.readyToStart}
            </h3>
            <p className="text-gray-600 mb-6">
              {t.chooseOffer}
            </p>
            <Button onClick={() => onEnroll("single-lesson")} size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
              {t.getStartStarted}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
        */}
      </div>
    </section>
  )
}
