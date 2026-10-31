import config from '@payload-config'
import { getPayload } from 'payload'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * Uptime Kuma readiness check. Payload initialization plus a lightweight
 * Local API read verifies that the application can query its database.
 */
export async function GET() {
  try {
    const payload = await getPayload({ config })
    await payload.find({
      collection: 'pages',
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })

    return NextResponse.json(
      { status: 'ok', checks: { application: 'ok', database: 'ok' } },
      { status: 200, headers: { 'Cache-Control': 'no-store, max-age=0' } },
    )
  } catch {
    // Do not disclose connection strings, hostnames, or stack traces.
    return NextResponse.json(
      { status: 'error', checks: { application: 'unknown', database: 'error' } },
      { status: 503, headers: { 'Cache-Control': 'no-store, max-age=0' } },
    )
  }
}