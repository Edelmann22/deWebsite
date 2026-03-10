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
