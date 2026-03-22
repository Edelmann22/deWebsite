import { NextResponse } from "next/server"
import sql from "@/lib/db"

export async function GET() {
  try {
    // Check if table exists
    const tableCheck = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'reviews'
    `
    
    console.log("Table exists check:", tableCheck)
    
    // If table doesn't exist, create it
    if (tableCheck.length === 0) {
      console.log("Reviews table doesn't exist, creating it...")
      await sql`
        CREATE TABLE reviews (
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
      
      await sql`
        CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC)
      `
      
      await sql`
        CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id)
      `
      
      return NextResponse.json({ 
        success: true, 
        message: "Reviews table created" 
      })
    }
    
    // Get sample of reviews
    const reviews = await sql`SELECT * FROM reviews LIMIT 5`
    
    return NextResponse.json({ 
      success: true, 
      tableExists: tableCheck.length > 0,
      reviewCount: reviews.length,
      sampleReviews: reviews 
    })
  } catch (error) {
    console.error("Debug error:", error)
    return NextResponse.json(
      { 
        error: "Debug failed",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
