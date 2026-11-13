import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * Lightweight application liveness check for uptime monitoring.
 * Intentionally does not initialize Payload or access the database.
 */
export async function GET() {
  return NextResponse.json(
    { status: 'ok', checks: { application: 'ok' } },
    {
      status: 200,
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    },
  )
}
