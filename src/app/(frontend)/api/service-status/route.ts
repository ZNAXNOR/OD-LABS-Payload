import { getUptimeKumaStatus } from '@/lib/uptime-kuma'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const status = await getUptimeKumaStatus()
  return NextResponse.json(status, {
    status: 200,
    headers: {
      // Do not serve stale green data when Uptime Kuma cannot be reached.
      'Cache-Control': 'no-store, max-age=0',
    },
  })
}