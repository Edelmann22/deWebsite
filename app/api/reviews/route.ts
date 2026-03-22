import { NextRequest, NextResponse } from "next/server"
import sql from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    const reviews = await sql`
      SELECT 
        r.id,
        r.user_id,
        r.username,
        r.rating,
        r.comment,
        r.course,
        r.created_at,
        r.updated_at
      FROM reviews r
      ORDER BY r.created_at DESC
    `
    
    return NextResponse.json(reviews)
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    // Check if user already has a review
    const existingReview = await sql`
      SELECT id FROM reviews 
      WHERE user_id = ${user.id}
      LIMIT 1
    `
    
    if (existingReview.length > 0) {
      return NextResponse.json(
        { 
          error: "You have already submitted a review. Each user can only leave one review.",
          existingReviewId: existingReview[0].id
        },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { username, rating, comment, course } = body

    if (!username || !rating || !comment) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      )
    }

    const result = await sql`
      INSERT INTO reviews (user_id, username, rating, comment, course)
      VALUES (${user.id}, ${username}, ${rating}, ${comment}, ${course})
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    )
  }
}
