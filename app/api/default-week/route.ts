import { NextRequest, NextResponse } from "next/server"
import { requireRole } from "@/lib/auth"
import { getDefaultWeekLessons, getDefaultWeekSettings, updateDefaultWeekSettings } from "@/lib/default-week"

export async function GET() {
  try {
    await requireRole("admin")
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const settings = await getDefaultWeekSettings()
    const lessons = await getDefaultWeekLessons()
    return NextResponse.json({ settings, lessons })
  } catch (error) {
    const message =
      error instanceof Error && /relation "default_week_settings" does not exist/i.test(error.message)
        ? "Default week tables are missing. Run the default-week migration."
        : error instanceof Error
          ? error.message
          : "Failed to load default week"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireRole("admin")
  } catch (error) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await req.json().catch(() => ({}))
  const { timezone, auto_generate } = body ?? {}

  if (timezone) {
    try {
      new Intl.DateTimeFormat("en-US", { timeZone: timezone })
    } catch {
      return NextResponse.json({ error: "Invalid time zone" }, { status: 400 })
    }
  }

  try {
    const settings = await updateDefaultWeekSettings({ timezone, auto_generate })
    return NextResponse.json(settings)
  } catch (error) {
    const message =
      error instanceof Error && /relation "default_week_settings" does not exist/i.test(error.message)
        ? "Default week tables are missing. Run the default-week migration."
        : error instanceof Error
          ? error.message
          : "Failed to update default week settings"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
