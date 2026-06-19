import { NextResponse } from "next/server"
import sql from "@/lib/db"

export async function POST() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS default_week_settings (
        id SERIAL PRIMARY KEY,
        timezone TEXT NOT NULL DEFAULT 'UTC',
        auto_generate BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS default_week_lessons (
        id SERIAL PRIMARY KEY,
        day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        student_user_id INTEGER NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
        language TEXT NOT NULL DEFAULT 'Deutsch',
        teacher TEXT NOT NULL DEFAULT 'Rosi Vaseva',
        color TEXT NOT NULL DEFAULT '#009bb3',
        details_background_color TEXT NOT NULL DEFAULT '#e7f6f8',
        slot_color TEXT NOT NULL DEFAULT '#cfecee',
        online BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    await sql`
      CREATE INDEX IF NOT EXISTS idx_default_week_lessons_day_time
      ON default_week_lessons (day_of_week, start_time)
    `

    await sql`
      CREATE TABLE IF NOT EXISTS deactivated_slots (
        id SERIAL PRIMARY KEY,
        slot_key TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    return NextResponse.json({
      success: true,
      message: "Default week tables created successfully",
    })
  } catch (error) {
    console.error("Migration error:", error)
    return NextResponse.json(
      {
        error: "Failed to create default week tables",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
