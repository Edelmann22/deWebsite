"use client"

import { useState, useEffect } from "react"
import { Star, MessageSquare, User, Calendar, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
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
      setError("Please write a comment for your review.")
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
        setError(errorData.error || "Failed to submit review")
      }
    } catch (error) {
      console.error("Error submitting review:", error)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteReview = async (reviewId: number) => {
    if (!confirm("Are you sure you want to delete this review?")) {
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
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} ${
              interactive ? "cursor-pointer hover:text-yellow-400" : ""
            }`}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
          />
        ))}
      </div>
    )
  }

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length

  return (
    <section id="reviews" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-semibold">
            {t.reviewsBadge}
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {t.reviewsTitle}
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {t.reviewsSubtitle}
          </p>
          
          {/* Rating Summary */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <span className="text-4xl font-bold text-gray-900">{averageRating.toFixed(1)}</span>
              {renderStars(Math.round(averageRating))}
            </div>
            <div className="text-sm text-gray-500">
              <div>{reviews.length} {t.reviews}</div>
              {/*<div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <div key={rating} className="flex items-center gap-1">
                    <span className="text-xs">{rating}</span>
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      {/*<div
                        className="h-full bg-yellow-400"
                        style={{
                          width: `${(reviews.filter(r => r.rating === rating).length / reviews.length) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>*/}
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500">Loading reviews...</div>
            </div>
          ) : reviews.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
              <p className="text-gray-500">Be the first to share your experience!</p>
            </div>
          ) : (
            displayedReviews.map((review) => (
            <Card key={review.id} className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>
                        <User className="w-5 h-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-gray-900">{review.username}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {new Date(review.created_at).toLocaleDateString(locale)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {review.course}
                    </Badge>
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteReview(review.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="mb-3">
                  {renderStars(review.rating)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {review.comment}
                </p>
              </CardContent>
            </Card>
            ))
          )}
        </div>

        {/* View All Reviews Button */}
        {limit && reviews.length > limit && (
          <div className="text-center">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => window.location.href = "/reviews"}
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              View All {reviews.length} Reviews
            </Button>
          </div>
        )}

        {/* Add Review CTA */}
        <div className="text-center">
          {isAuthenticated ? (
            userHasReview ? (
              <div className="bg-gray-100 border border-gray-300 rounded-lg p-6 max-w-md mx-auto">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">You've already shared your experience</h3>
                <p className="text-gray-600 text-sm">Thank you for your review! Each user can only leave one review.</p>
                {isAdmin && (
                  <p className="text-gray-500 text-xs mt-2">As an admin, you can manage all reviews.</p>
                )}
              </div>
            ) : (
              <Dialog open={showReviewDialog} onOpenChange={(open) => {
                if (!open || !userHasReview) {
                  setShowReviewDialog(open)
                }
              }}>
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    {t.leaveReview}
                  </Button>
                </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>{t.writeReview}</DialogTitle>
                </DialogHeader>
                
                {/* Error Display */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                )}
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.yourRating}
                    </label>
                    {renderStars(newReview.rating, true, (rating) =>
                      setNewReview({ ...newReview, rating })
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.yourComment}
                    </label>
                    <Textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      placeholder={t.reviewPlaceholder}
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-3 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setShowReviewDialog(false)}
                    >
                      {t.cancel}
                    </Button>
                    <Button
                      onClick={handleSubmitReview}
                      disabled={isSubmitting || !newReview.comment.trim()}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isSubmitting ? t.submitting : t.submitReview}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            )
          ) : (
            <div className="bg-gray-50 rounded-2xl p-8 max-w-2xl mx-auto">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t.loginToReview}
              </h3>
              <p className="text-gray-600 mb-6">
                {t.loginToReviewDescription}
              </p>
              <Button onClick={onLogin} size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                {t.loginToLeaveReview}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
