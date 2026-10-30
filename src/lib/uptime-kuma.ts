export type ServiceStatus = 'operational' | 'degraded' | 'outage' | 'unknown'

export interface UptimeKumaStatus {
  status: ServiceStatus
  label: string
  checkedAt: string
}

interface StatusPageMonitor { id: number | string; name?: string }
interface StatusPageGroup { monitorList?: StatusPageMonitor[] }
interface StatusPageResponse {
  config?: { published?: boolean }
  incident?: { style?: string } | null
  publicGroupList?: StatusPageGroup[]
}
interface Heartbeat { status: number; time: string }
interface HeartbeatResponse { heartbeatList?: Record<string, Heartbeat[]> }

const STATUS_LABELS: Record<ServiceStatus, string> = {
  operational: 'All systems operational',
  degraded: 'Some services experiencing issues',
  outage: 'Service disruption detected',
  unknown: 'Status currently unavailable',
}

function result(status: ServiceStatus): UptimeKumaStatus {
  return { status, label: STATUS_LABELS[status], checkedAt: new Date().toISOString() }
}

function getStatusPageEndpoint(): { origin: string; slug: string } | null {
  const configuredURL = process.env.UPTIME_KUMA_STATUS_API_URL
  if (!configuredURL) return null
  try {
    const url = new URL(configuredURL)
    const match = url.pathname.match(/\/api\/status-page\/([^/]+)\/?$/)
    if (!match) return null
    return { origin: url.origin, slug: decodeURIComponent(match[1]) }
  } catch {
    return null
  }
}

async function fetchJSON<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    cache: 'no-store',
    signal: AbortSignal.timeout(5_000),
    headers: { Accept: 'application/json' },
  })
  if (!response.ok) throw new Error('Uptime Kuma request failed')
  return (await response.json()) as T
}

/** Reads Uptime Kuma's documented public status-page and heartbeat endpoints. */
export async function getUptimeKumaStatus(): Promise<UptimeKumaStatus> {
  const endpoint = getStatusPageEndpoint()
  if (!endpoint) return result('unknown')
  try {
    const slug = encodeURIComponent(endpoint.slug)
    const pageURL = endpoint.origin + '/api/status-page/' + slug
    const heartbeatURL = endpoint.origin + '/api/status-page/heartbeat/' + slug
    const [page, heartbeatData] = await Promise.all([
      fetchJSON<StatusPageResponse>(pageURL),
      fetchJSON<HeartbeatResponse>(heartbeatURL),
    ])
    if (page.config?.published === false) return result('unknown')
    const monitors = (page.publicGroupList ?? []).flatMap((group) => group.monitorList ?? [])
    if (monitors.length === 0) return result('unknown')
    const heartbeats = monitors.map((monitor) => {
      const history = heartbeatData.heartbeatList?.[String(monitor.id)] ?? []
      if (history.length === 0) return null
      return history.reduce((latest, current) =>
        Date.parse(current.time) > Date.parse(latest.time) ? current : latest,
      )
    })
    if (heartbeats.some((heartbeat) => heartbeat?.status === 0)) return result('outage')
    const incidentStyle = page.incident?.style?.toLowerCase()
    if (incidentStyle === 'danger' || incidentStyle === 'critical') return result('outage')
    if (incidentStyle === 'warning' || heartbeats.some((heartbeat) => heartbeat?.status === 3)) {
      return result('degraded')
    }
    if (heartbeats.some((heartbeat) => heartbeat?.status !== 1)) return result('unknown')
    return result('operational')
  } catch {
    return result('unknown')
  }
}