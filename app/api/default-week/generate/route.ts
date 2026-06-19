import { NextRequest, NextResponse } from "next/server"
import { requireRole } from "@/lib/auth"
import { generateUpcomingWeek, getDefaultWeekSettings } from "@/lib/default-week"

export async function POST(req: NextRequest) {
  let userId: number
  try {
    const user = await requireRole("admin")
    userId = user.id
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { timeZoneOverride } = await req.json().catch(() => ({}))

  try {
    const settings = await getDefaultWeekSettings()
    const timeZone = timeZoneOverride ?? settings.timezone

    const result = await generateUpcomingWeek({
      now: new Date(),
      timeZone,
      createdByUserId: userId,
    })

    return NextResponse.json({ ...result, timeZone })
  } catch (error) {
    const message =
      error instanceof Error && /relation "default_week_settings" does not exist/i.test(error.message)
        ? "Default week tables are missing. Run the default-week migration."
        : error instanceof Error
          ? error.message
          : "Failed to generate upcoming week"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
