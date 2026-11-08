import { getUptimeKumaStatus } from '@/lib/uptime-kuma'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const status = await getUptimeKumaStatus()
  return NextResponse.json(status, {
    status: 200,
    headers: {
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=60',
    },
  })
}
