"use client"

import { useState } from "react"
import { X, CalendarDays, Clock, MapPin, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { EventRow } from "@/lib/db"

type Props = {
  event: EventRow | null
  onClose: () => void
  locale: string
}

export default function EventDetailModal({ event, onClose, locale }: Props) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (!event) return null

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

  // Helper function to format created date
  function formatCreatedDate(dateString: string, locale: string) {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return "Today"
    else if (diffDays === 1) return "Yesterday"
    else if (diffDays < 7) return `${diffDays} days ago`
    else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7)
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`
    } else {
      return date.toLocaleDateString(locale, {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined
      })
    }
  }

  const nextImage = () => {
    if (event.images && event.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % event.images.length)
    }
  }

  const prevImage = () => {
    if (event.images && event.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + event.images.length) % event.images.length)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
              {event.event_date && (
                <div className="flex items-center gap-1">
                  <CalendarDays size={16} />
                  <span>{formatEventDate(event.event_date, locale)}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <span>Posted {formatCreatedDate(event.created_at, locale)}</span>
              </div>
              {event.images && event.images.length > 0 && (
                <div className="flex items-center gap-1">
                  <ImageIcon size={16} />
                  <span>{event.images.length} {event.images.length === 1 ? 'photo' : 'photos'}</span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Images Section */}
          {event.images && event.images.length > 0 && (
            <div className="relative bg-gray-100">
              <div className="aspect-video max-h-96 overflow-hidden">
                <img
                  src={event.images[currentImageIndex]}
                  alt={`${event.title} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-contain"
                />
              </div>
              
              {event.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {event.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImageIndex ? "bg-white" : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Text Content */}
          <div className="p-6">
            <div 
              className="prose prose-lg max-w-none text-gray-800"
              dangerouslySetInnerHTML={{ __html: event.content_html }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {event.images && event.images.length > 1 && (
                <span>Image {currentImageIndex + 1} of {event.images.length}</span>
              )}
            </div>
            <Button onClick={onClose} size="lg">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
