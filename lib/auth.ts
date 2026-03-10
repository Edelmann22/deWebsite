import { randomBytes, scryptSync, timingSafeEqual, createHash } from "crypto"
import { cookies } from "next/headers"
import sql from "@/lib/db"
import type { SessionUser, UserRole, UserRow } from "@/lib/db"

const SESSION_COOKIE = "deutschstube_session"
const SESSION_TTL_DAYS = 30

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex")
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex")
  const hash = scryptSync(password, salt, 64).toString("hex")
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, stored: string) {
  const [salt, existingHash] = stored.split(":")
  if (!salt || !existingHash) return false
  const candidate = scryptSync(password, salt, 64)
  const existing = Buffer.from(existingHash, "hex")
  return candidate.length === existing.length && timingSafeEqual(candidate, existing)
}

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return null

  const tokenHash = hashToken(token)
  const [row] = await sql`
    SELECT
      public.users.id,
      public.users.email,
      public.users.nickname,
      public.users.role,
      public.users.created_at,
      public.users.updated_at
    FROM public.user_sessions
    JOIN public.users ON public.users.id = public.user_sessions.user_id
    WHERE public.user_sessions.token_hash = ${tokenHash}
      AND public.user_sessions.expires_at > NOW()
    LIMIT 1
  `

  return (row ?? null) as SessionUser | null
}

export async function requireUser() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("UNAUTHORIZED")
  }
  return user
}

export async function requireRole(role: UserRole) {
  const user = await requireUser()
  if (user.role !== role) {
    throw new Error("FORBIDDEN")
  }
  return user
}

export async function createSession(userId: number) {
  const rawToken = randomBytes(32).toString("hex")
  const tokenHash = hashToken(rawToken)
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000).toISOString()

  await sql`
    INSERT INTO public.user_sessions (user_id, token_hash, expires_at)
    VALUES (${userId}, ${tokenHash}, ${expiresAt})
  `

  return rawToken
}

export async function clearSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return

  await sql`DELETE FROM public.user_sessions WHERE token_hash = ${hashToken(token)}`
}

export function sessionCookieConfig(token: string) {
  return {
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_DAYS * 24 * 60 * 60,
  }
}

export function expiredSessionCookie() {
  return {
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  }
}

export async function countAdmins() {
  const [row] = await sql`SELECT COUNT(*)::int AS count FROM public.users WHERE role = 'admin'`
  return Number(row?.count ?? 0)
}

export async function findUserByEmail(email: string) {
  const [row] = await sql`SELECT * FROM public.users WHERE email = ${email.toLowerCase()} LIMIT 1`
  return (row ?? null) as UserRow | null
}
