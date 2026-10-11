import { NextRequest, NextResponse } from "next/server"
import { requireRole } from "@/lib/auth"
import { getDefaultWeekLessons, getDefaultWeekSettings, updateDefaultWeekSettings } from "@/lib/default-week"

export async function GET() {
  try {
    await requireRole("admin")
  } catch (error) {
    return NextResponse.json({ error: "Нямаш достъп" }, { status: 403 })
  }

  try {
    const settings = await getDefaultWeekSettings()
    const lessons = await getDefaultWeekLessons()
    return NextResponse.json({ settings, lessons })
  } catch (error) {
    const message =
      error instanceof Error && /relation "default_week_settings" does not exist/i.test(error.message)
        ? "Липсват таблиците за седмицата по подразбиране. Стартирай миграцията default-week."
        : error instanceof Error
          ? error.message
          : "Неуспешно зареждане на седмицата по подразбиране"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireRole("admin")
  } catch (error) {
    return NextResponse.json({ error: "Нямаш достъп" }, { status: 403 })
  }

  const body = await req.json().catch(() => ({}))
  const { timezone, auto_generate } = body ?? {}
  // "" or null clears the end date; undefined leaves it unchanged.
  const rawActiveUntil = body?.active_until
  const active_until = rawActiveUntil === "" || rawActiveUntil === null ? null : rawActiveUntil

  if (active_until !== undefined && active_until !== null && !/^\d{4}-\d{2}-\d{2}$/.test(String(active_until))) {
    return NextResponse.json({ error: "Невалидна крайна дата" }, { status: 400 })
  }

  if (timezone) {
    try {
      new Intl.DateTimeFormat("en-US", { timeZone: timezone })
    } catch {
      return NextResponse.json({ error: "Невалидна часова зона" }, { status: 400 })
    }
  }

  try {
    const settings = await updateDefaultWeekSettings({ timezone, auto_generate, active_until })
    return NextResponse.json(settings)
  } catch (error) {
    const message =
      error instanceof Error && /relation "default_week_settings" does not exist/i.test(error.message)
        ? "Липсват таблиците за седмицата по подразбиране. Стартирай миграцията default-week."
        : error instanceof Error
          ? error.message
          : "Неуспешно запазване на настройките"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
