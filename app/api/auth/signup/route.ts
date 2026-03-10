import { NextRequest, NextResponse } from "next/server"
import sql from "@/lib/db"
import { countAdmins, createSession, findUserByEmail, hashPassword, sessionCookieConfig } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const email = String(body.email ?? "").trim().toLowerCase()
    const nickname = String(body.nickname ?? "").trim()
    const password = String(body.password ?? "")

    if (!email || !nickname || password.length < 6) {
      return NextResponse.json({ error: "Invalid signup data" }, { status: 400 })
    }

    const existing = await findUserByEmail(email)
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 })
    }

    const role = (await countAdmins()) === 0 ? "admin" : "student"
    const [user] = await sql`
      INSERT INTO public.users (email, nickname, password_hash, role)
      VALUES (${email}, ${nickname}, ${hashPassword(password)}, ${role})
      RETURNING id, email, nickname, role, created_at, updated_at
    `

    const token = await createSession(user.id)
    const res = NextResponse.json({ user }, { status: 201 })
    res.cookies.set(sessionCookieConfig(token))
    return res
  } catch (error) {
    const message = error instanceof Error ? error.message : "Signup failed"
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
