import { NextRequest, NextResponse } from "next/server"
import sql from "@/lib/db"
import { requireRole } from "@/lib/auth"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    console.log("Delete review attempt for ID:", resolvedParams.id)
    await requireRole("admin")

    const reviewId = parseInt(resolvedParams.id)
    console.log("Parsed review ID:", reviewId)
    if (isNaN(reviewId)) {
      console.log("Invalid review ID:", resolvedParams.id)
      return NextResponse.json(
        { error: "Invalid review ID" },
        { status: 400 }
      )
    }

    console.log("Attempting to delete review with ID:", reviewId)
    const result = await sql`
      DELETE FROM reviews 
      WHERE id = ${reviewId}
      RETURNING *
    `

    console.log("Delete result:", result)
    if (result.length === 0) {
      console.log("Review not found with ID:", reviewId)
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      )
    }

    console.log("Successfully deleted review:", result[0])
    return NextResponse.json({ success: true, deletedReview: result[0] })
  } catch (error) {
    console.error("Error deleting review:", error)
    console.error("Error type:", typeof error)
    console.error("Error message:", error instanceof Error ? error.message : "Not an Error object")
    
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      )
    }
    
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { 
        error: "Failed to delete review",
        details: error instanceof Error ? error.message : "Unknown error occurred",
        type: typeof error
      },
      { status: 500 }
    )
  }
}
