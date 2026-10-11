import { NextRequest, NextResponse } from "next/server"
import sql from "@/lib/db"
import { changePassword, getCurrentUser, verifyPassword } from "@/lib/auth"

const MIN_PASSWORD_LENGTH = 6

// POST /api/auth/password — { currentPassword, newPassword }
export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized", code: "unauthorized" }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const currentPassword = String(body?.currentPassword ?? "")
  const newPassword = String(body?.newPassword ?? "")

  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json({ error: "New password is too short", code: "too_short" }, { status: 400 })
  }
  if (newPassword === currentPassword) {
    return NextResponse.json({ error: "New password must differ", code: "same_password" }, { status: 400 })
  }

  try {
    const [row] = await sql`SELECT password_hash FROM public.users WHERE id = ${user.id} LIMIT 1`
    if (!row || !verifyPassword(currentPassword, row.password_hash)) {
      return NextResponse.json({ error: "Current password is wrong", code: "wrong_current" }, { status: 403 })
    }

    await changePassword(user.id, newPassword)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Password change failed:", error)
    return NextResponse.json({ error: "Password change failed", code: "failed" }, { status: 500 })
  }
}
