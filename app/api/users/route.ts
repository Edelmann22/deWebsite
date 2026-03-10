import { NextResponse } from "next/server"
import sql from "@/lib/db"
import { requireRole } from "@/lib/auth"

export async function GET() {
  try {
    await requireRole("admin")
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error && error.message === "UNAUTHORIZED" ? "Unauthorized" : "Forbidden" }, { status: error instanceof Error && error.message === "UNAUTHORIZED" ? 401 : 403 })
  }

  const rows = await sql`
    SELECT id, nickname, email, role
    FROM public.users
    WHERE role = 'student'
    ORDER BY nickname ASC, email ASC
  `

  return NextResponse.json(rows)
}
