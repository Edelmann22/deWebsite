import { NextRequest, NextResponse } from "next/server"
import { createSession, findUserByEmail, sessionCookieConfig, verifyPassword } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const email = String(body.email ?? "").trim().toLowerCase()
    const password = String(body.password ?? "")

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const user = await findUserByEmail(email)
    if (!user || !verifyPassword(password, user.password_hash)) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const token = await createSession(user.id)
    const res = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    })
    res.cookies.set(sessionCookieConfig(token))
    return res
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed"
    return NextResponse.json(
      {
        error: message,
        debug:
          process.env.NODE_ENV !== "production"
            ? {
                name: error instanceof Error ? error.name : "UnknownError",
                message,
              }
            : undefined,
      },
      { status: 500 },
    )
  }
}
