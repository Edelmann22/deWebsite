import { NextResponse } from "next/server"
import { clearSession, expiredSessionCookie } from "@/lib/auth"

export async function POST() {
  await clearSession()
  const res = NextResponse.json({ success: true })
  res.cookies.set(expiredSessionCookie())
  return res
}
