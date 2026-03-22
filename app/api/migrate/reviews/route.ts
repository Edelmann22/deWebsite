import { NextResponse } from "next/server"
import sql from "@/lib/db"

export async function POST() {
  try {
    // Create reviews table
    await sql`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        username VARCHAR(255) NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT NOT NULL,
        course VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    // Create indexes for faster queries
    await sql`
      CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC)
    `
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id)
    `

    return NextResponse.json({ 
      success: true, 
      message: "Reviews table created successfully" 
    })
  } catch (error) {
    console.error("Migration error:", error)
    return NextResponse.json(
      { 
        error: "Failed to create reviews table",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
