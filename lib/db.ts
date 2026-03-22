import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)
export default sql

export type ClassRow = {
  id: number
  title: string
  student_user_id: number | null
  language: string
  teacher: string
  color: string
  details_background_color: string
  slot_color: string
  online: boolean
  date: string       // YYYY-MM-DD
  start_time: string // HH:MM
  end_time: string   // HH:MM
  lesson_notes: string
  homework: string
  created_at: string
  updated_at: string
}

export type UserRole = "admin" | "student"

export type UserRow = {
  id: number
  email: string
  nickname: string
  password_hash: string
  role: UserRole
  created_at: string
  updated_at: string
}

export type SessionUser = Omit<UserRow, "password_hash">

export type EventRow = {
  id: number
  title: string
  content_html: string
  images: string[]
  event_date: string | null // YYYY-MM-DD or null
  created_by_user_id: number | null
  created_at: string
  updated_at: string
}

export type ReviewRow = {
  id: number
  user_id: number
  username: string
  rating: number
  comment: string
  course: string
  created_at: string
  updated_at: string
}
