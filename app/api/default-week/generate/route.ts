import { NextRequest, NextResponse } from "next/server"
import { requireRole } from "@/lib/auth"
import { generateUpcomingWeek, generateWeeksUntil, getDefaultWeekSettings } from "@/lib/default-week"

export async function POST(req: NextRequest) {
  let userId: number
  try {
    const user = await requireRole("admin")
    userId = user.id
  } catch {
    return NextResponse.json({ error: "Нямаш достъп" }, { status: 403 })
  }

  const { timeZoneOverride, until } = await req.json().catch(() => ({}))

  if (until !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(String(until))) {
    return NextResponse.json({ error: "Невалидна крайна дата" }, { status: 400 })
  }

  try {
    const settings = await getDefaultWeekSettings()
    const timeZone = timeZoneOverride ?? settings.timezone

    const result = until
      ? await generateWeeksUntil({ now: new Date(), timeZone, createdByUserId: userId, until })
      : await generateUpcomingWeek({
          now: new Date(),
          timeZone,
          createdByUserId: userId,
          activeUntil: settings.active_until,
        })

    return NextResponse.json({ ...result, timeZone })
  } catch (error) {
    const message =
      error instanceof Error && /relation "default_week_settings" does not exist/i.test(error.message)
        ? "Липсват таблиците за седмицата по подразбиране. Стартирай миграцията default-week."
        : error instanceof Error
          ? error.message
          : "Неуспешно генериране на седмицата"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
