"use client"

import { useState, useEffect } from "react"
import { Star, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { BRAND_RED, hand, serif } from "@/components/paper-fonts"
import type { TranslationDictionary } from "@/lib/i18n"
import type { ReviewRow, SessionUser } from "@/lib/db"

interface Review {
  id: number
  user_id: number
  username: string
  rating: number
  comment: string
  course: string
  created_at: string
  updated_at: string
}

interface ReviewsSectionProps {
  isAuthenticated: boolean
  isAdmin: boolean
  user: SessionUser | null
  onLogin: () => void
  t: TranslationDictionary
  locale: string
  limit?: number
}

export default function ReviewsSection({ isAuthenticated, isAdmin, user, onLogin, t, locale, limit }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [newReview, setNewReview] = useState({
    username: user?.nickname || "",
    rating: 5,
    comment: "",
    course: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Check if current user has already submitted a review
  const userHasReview = user && reviews.some(review => review.user_id === user.id)
  
  // Apply limit to reviews
  const displayedReviews = limit ? reviews.slice(0, limit) : reviews

  useEffect(() => {
    fetchReviews()
  }, [])

  useEffect(() => {
    // Update username when user changes
    setNewReview(prev => ({ ...prev, username: user?.nickname || "" }))
  }, [user])

  const fetchReviews = async () => {
    try {
      const response = await fetch("/api/reviews")
      if (response.ok) {
        const data = await response.json()
        setReviews(data)
      }
    } catch (error) {
      console.error("Error fetching reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      onLogin()
      return
    }

    if (!newReview.comment.trim()) {
      setError(t.reviewCommentRequired)
      return
    }

    setError(null)
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReview),
      })

      if (response.ok) {
        setNewReview({ username: user?.nickname || "", rating: 5, comment: "", course: "" })
        setShowReviewDialog(false)
        fetchReviews() // Refresh reviews
      } else {
        const errorData = await response.json()
        setError(errorData.error || t.reviewSubmitFailed)
      }
    } catch (error) {
      console.error("Error submitting review:", error)
      setError(t.genericError)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteReview = async (reviewId: number) => {
    if (!confirm(t.reviewDeleteConfirm)) {
      return
    }

    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchReviews() // Refresh reviews
      } else {
        console.error("Failed to delete review")
      }
    } catch (error) {
      console.error("Error deleting review:", error)
    }
  }

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex gap-0.5" aria-label={`${rating}/5`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${interactive ? "w-7 h-7" : "w-4 h-4"} ${star <= rating ? "fill-amber-400 text-amber-400" : "text-stone-300"} ${
              interactive ? "cursor-pointer hover:text-amber-400" : ""
            }`}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
          />
        ))}
      </div>
    )
  }

  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0

  // Notes pinned at slightly different angles
  const tilts = ["md:-rotate-1", "md:rotate-[0.6deg]", "md:-rotate-[0.4deg]", "md:rotate-1"]

  return (
    <section id="reviews" className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-24 sm:pt-20">
      {/* Intro + rating */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-end">
        <div className="md:col-span-8 max-w-2xl">
          <p className={`${hand.className} ${BRAND_RED} text-3xl -rotate-2 origin-left`}>{t.reviewsPageNote}</p>
          <h1 className={`${serif.className} mt-3 text-4xl sm:text-5xl leading-[1.15] font-semibold text-stone-900`}>
            {t.reviewsTitle}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-stone-600">{t.reviewsSubtitle}</p>
        </div>
        {reviews.length > 0 && (
          <div className="md:col-span-4 md:justify-self-end flex items-center gap-4 border-l-2 border-stone-900 pl-5">
            <span className={`${serif.className} text-5xl font-semibold text-stone-900`}>{averageRating.toFixed(1)}</span>
            <div>
              {renderStars(Math.round(averageRating))}
              <p className="mt-1 text-sm text-stone-500">
                {t.reviewsAverage} · {reviews.length} {t.reviews}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Notes */}
      <div className="mt-16">
        {loading ? (
          <p className={`${hand.className} py-16 text-center text-2xl text-stone-500`}>{t.reviewsLoading}</p>
        ) : reviews.length === 0 ? (
          <div className="py-16 text-center">
            <p className={`${serif.className} text-2xl font-semibold text-stone-900`}>{t.reviewsEmptyTitle}</p>
            <p className="mt-2 text-stone-500">{t.reviewsEmptyText}</p>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8">
            {displayedReviews.map((review, index) => (
              <article
                key={review.id}
                className={`mb-8 break-inside-avoid bg-white p-6 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.25)] ${tilts[index % tilts.length]}`}
              >
                <div className="flex items-start justify-between gap-3">
                  {renderStars(review.rating)}
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => handleDeleteReview(review.id)}
                      aria-label={t.deleteEvent}
                      className="-m-1 p-1 text-stone-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="mt-4 leading-relaxed text-stone-700 whitespace-pre-line">{review.comment}</p>
                <footer className="mt-5 flex items-end justify-between gap-3 border-t border-stone-100 pt-4">
                  <div>
                    <p className={`${hand.className} text-2xl leading-none text-stone-900`}>{review.username}</p>
                    {review.course && <p className="mt-1 text-xs text-stone-500">{review.course}</p>}
                  </div>
                  <time className="text-xs text-stone-400" dateTime={review.created_at}>
                    {new Date(review.created_at).toLocaleDateString(locale)}
                  </time>
                </footer>
              </article>
            ))}
          </div>
        )}
      </div>

      {limit && reviews.length > limit && (
        <div className="text-center mt-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => window.location.href = "/reviews"}
            className="rounded-md border-stone-300 bg-transparent px-7 text-stone-800 hover:bg-white"
          >
            {t.reviewViewAll} ({reviews.length})
          </Button>
        </div>
      )}

      {/* Write a review */}
      <div className="mt-16 border-t border-stone-200 pt-14 text-center max-w-xl mx-auto">
        {isAuthenticated ? (
          userHasReview ? (
            <>
              <p className={`${serif.className} text-2xl font-semibold text-stone-900`}>{t.reviewAlreadyTitle}</p>
              <p className="mt-2 text-stone-600">{t.reviewAlreadyBody}</p>
              {isAdmin && <p className="mt-2 text-xs text-stone-500">{t.reviewAdminNote}</p>}
            </>
          ) : (
            <Dialog open={showReviewDialog} onOpenChange={(open) => {
              if (!open || !userHasReview) {
                setShowReviewDialog(open)
              }
            }}>
              <DialogTrigger asChild>
                <Button size="lg" className="rounded-md bg-stone-900 px-7 text-white hover:bg-stone-700">
                  {t.leaveReview}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] bg-[#FBF7F0]">
                <DialogHeader>
                  <DialogTitle className={`${serif.className} text-2xl`}>{t.writeReview}</DialogTitle>
                </DialogHeader>

                {error && (
                  <div className="border border-red-200 bg-red-50 p-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">{t.yourRating}</label>
                    {renderStars(newReview.rating, true, (rating) =>
                      setNewReview({ ...newReview, rating })
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">{t.yourComment}</label>
                    <Textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      placeholder={t.reviewPlaceholder}
                      rows={5}
                      className="bg-white"
                    />
                  </div>
                  <div className="flex gap-3 justify-end">
                    <Button variant="outline" onClick={() => setShowReviewDialog(false)} className="rounded-md border-stone-300 bg-transparent">
                      {t.cancel}
                    </Button>
                    <Button
                      onClick={handleSubmitReview}
                      disabled={isSubmitting || !newReview.comment.trim()}
                      className="rounded-md bg-stone-900 text-white hover:bg-stone-700"
                    >
                      {isSubmitting ? t.submitting : t.submitReview}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )
        ) : (
          <>
            <p className={`${serif.className} text-2xl font-semibold text-stone-900`}>{t.loginToReview}</p>
            <p className="mt-2 text-stone-600">{t.loginToReviewDescription}</p>
            <Button onClick={onLogin} size="lg" className="mt-6 rounded-md bg-stone-900 px-7 text-white hover:bg-stone-700">
              {t.loginToLeaveReview}
            </Button>
          </>
        )}
      </div>
    </section>
  )
}
