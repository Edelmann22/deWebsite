import { NextResponse } from "next/server"
import sql from "@/lib/db"
import { generateUpcomingWeek, getDefaultWeekSettings } from "@/lib/default-week"
import { isSundayMidnight } from "@/lib/timezone"

async function resolveSystemAdminId() {
  const [row] = await sql`
    SELECT id FROM public.users WHERE role = 'admin' ORDER BY id ASC LIMIT 1
  `
  return row?.id ?? null
}

export async function GET() {
  try {
    const settings = await getDefaultWeekSettings()
    if (!settings.auto_generate) {
      return NextResponse.json({ skipped: true, reason: "Auto-generation disabled" })
    }

    const now = new Date()
    if (!isSundayMidnight(now, settings.timezone, 10)) {
      return NextResponse.json({ skipped: true, reason: "Outside Sunday midnight window" })
    }

    const systemAdminId = await resolveSystemAdminId()
    const result = await generateUpcomingWeek({
      now,
      timeZone: settings.timezone,
      createdByUserId: systemAdminId,
    })

    return NextResponse.json({ ...result, timeZone: settings.timezone })
  } catch (error) {
    const message =
      error instanceof Error && /relation "default_week_settings" does not exist/i.test(error.message)
        ? "Default week tables are missing. Run the default-week migration."
        : error instanceof Error
          ? error.message
          : "Failed to auto-generate upcoming week"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
