"use client"

import { CalendarDays, MapPin, Clock, Users, ArrowRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { TranslationDictionary } from "@/lib/i18n"
import type { EventRow } from "@/lib/db"

interface EventsSectionProps {
  events: EventRow[]
  eventsLoading: boolean
  onViewEventDetails: (eventId: number) => void
  t: TranslationDictionary
  locale: string
}

export default function EventsSection({ events, eventsLoading, onViewEventDetails, t, locale }: EventsSectionProps) {
  console.log("EventsSection rendered with events:", events?.length, "loading:", eventsLoading)
  
  // Helper function to extract text from HTML
  function extractTextFromHtml(html: string) {
    const doc = new DOMParser().parseFromString(html, "text/html")
    return (doc.body.textContent ?? "").replace(/\s+/g, " ").trim()
  }

  // Helper function to format event date
  function formatEventDate(dateString: string, locale: string) {
    if (!dateString) return null
    return new Date(dateString + "T12:00:00").toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Sort events by creation date (most recent first)
  const sortedEvents = events.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.eventsTitle || "Upcoming Events"}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t.eventsSubtitle || "Stay updated with our latest announcements, workshops, and special events."}
          </p>
        </div>

        {eventsLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">{t.eventsLoading || "Loading events..."}</p>
          </div>
        ) : sortedEvents.length === 0 ? (
          <div className="text-center py-12">
            <CalendarDays className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t.eventsEmpty || "No events yet"}</h3>
            <p className="text-gray-600">Check back soon for upcoming events and announcements.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedEvents.slice(0, 6).map((event) => (
              <Card 
                key={event.id} 
                className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group border border-gray-200 hover:border-blue-300"
                onClick={() => onViewEventDetails(event.id)}
              >
                {event.images && event.images.length > 0 && (
                  <div className="aspect-video overflow-hidden bg-gray-100">
                    <img
                      src={event.images[0]}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {formatEventDate(event.event_date || "", locale) || "No date set"}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {new Date(event.created_at).toLocaleDateString(locale, {
                        month: "short",
                        day: "numeric"
                      })}
                    </span>
                  </div>
                  <CardTitle className="text-xl line-clamp-2 group-hover:text-blue-600 transition-colors flex items-start justify-between gap-2">
                    <span>{event.title}</span>
                    <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 flex-shrink-0 mt-1" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="line-clamp-3 mb-4">
                    {extractTextFromHtml(event.content_html)}
                  </CardDescription>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {event.images && event.images.length > 0 && (
                        <span className="flex items-center gap-1">
                          📷 {event.images.length} {event.images.length === 1 ? 'photo' : 'photos'}
                        </span>
                      )}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-0 h-auto hover:text-blue-600 hover:bg-blue-50 rounded-md px-2 py-1 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        onViewEventDetails(event.id)
                      }}
                    >
                      <span className="flex items-center gap-1">
                        Read more
                        <ArrowRight size={14} />
                      </span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {sortedEvents.length > 6 && (
          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              size="lg"
              className="rounded-full px-8"
              onClick={() => onViewEventDetails(-1)} // Special signal to show all events
            >
              View all events
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
