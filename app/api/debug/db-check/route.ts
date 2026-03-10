import { NextResponse } from "next/server"
import sql from "@/lib/db"

export async function GET() {
  try {
    const [databaseInfo] = await sql`
      SELECT current_database() AS database_name, current_schema() AS schema_name
    `

    const tables = await sql`
      SELECT table_schema, table_name
      FROM information_schema.tables
      WHERE table_name IN ('users', 'user_sessions')
      ORDER BY table_schema, table_name
    `

    return NextResponse.json({
      ok: true,
      database: databaseInfo?.database_name ?? null,
      schema: databaseInfo?.schema_name ?? null,
      tables,
    })
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown database error",
      },
      { status: 500 },
    )
  }
}
