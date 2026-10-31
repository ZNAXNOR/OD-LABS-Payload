'use client'

import { useSyncExternalStore } from 'react'
import type { ServiceStatus, UptimeKumaStatus } from '@/lib/uptime-kuma'

type ServiceStatusProps = {
  variant?: 'compact' | 'block'
  className?: string
}

const presentation: Record<ServiceStatus, { dot: string; text: string; description: string }> = {
  operational: {
    dot: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.55)] motion-safe:animate-pulse',
    text: 'text-emerald-300',
    description: 'All systems operational',
  },
  degraded: {
    dot: 'bg-amber-400',
    text: 'text-amber-300',
    description: 'Some services experiencing issues',
  },
  outage: {
    dot: 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)] motion-safe:animate-pulse',
    text: 'text-red-400',
    description: 'Service disruption detected',
  },
  unknown: {
    dot: 'bg-zinc-500',
    text: 'text-zinc-400',
    description: 'Status currently unavailable',
  },
}

const CLIENT_CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

interface StatusState {
  status: ServiceStatus
  lastFetched: number
}

let globalState: StatusState = {
  status: 'unknown',
  lastFetched: 0,
}

const listeners = new Set<() => void>()
let inFlightFetch: Promise<ServiceStatus> | null = null
let sharedInterval: ReturnType<typeof setInterval> | null = null
let subscriberCount = 0

function notify() {
  listeners.forEach((listener) => listener())
}

async function fetchServiceStatus(): Promise<ServiceStatus> {
  const now = Date.now()
  if (globalState.lastFetched > 0 && now - globalState.lastFetched < CLIENT_CACHE_TTL_MS) {
    return globalState.status
  }

  if (inFlightFetch) {
    return inFlightFetch
  }

  inFlightFetch = (async () => {
    try {
      const response = await fetch('/api/service-status', {
        headers: { Accept: 'application/json' },
      })
      if (!response.ok) throw new Error('Status endpoint unavailable')
      const data = (await response.json()) as UptimeKumaStatus
      const allowed: ServiceStatus[] = ['operational', 'degraded', 'outage', 'unknown']
      const newStatus = allowed.includes(data.status) ? data.status : 'unknown'
      globalState = {
        status: newStatus,
        lastFetched: Date.now(),
      }
      notify()
      return newStatus
    } catch {
      if (globalState.lastFetched === 0) {
        globalState = {
          status: 'unknown',
          lastFetched: Date.now(),
        }
        notify()
      }
      return globalState.status
    } finally {
      inFlightFetch = null
    }
  })()

  return inFlightFetch
}

function startGlobalPolling() {
  if (!sharedInterval) {
    sharedInterval = setInterval(() => {
      void fetchServiceStatus()
    }, CLIENT_CACHE_TTL_MS)
  }
}

function stopGlobalPolling() {
  if (sharedInterval && subscriberCount === 0) {
    clearInterval(sharedInterval)
    sharedInterval = null
  }
}

export function useServiceStatus(): ServiceStatus {
  return useSyncExternalStore(
    (onStoreChange) => {
      listeners.add(onStoreChange)
      subscriberCount++
      startGlobalPolling()

      const isStale = Date.now() - globalState.lastFetched >= CLIENT_CACHE_TTL_MS
      if (isStale) {
        void fetchServiceStatus()
      }

      return () => {
        listeners.delete(onStoreChange)
        subscriberCount--
        if (subscriberCount === 0) {
          stopGlobalPolling()
        }
      }
    },
    () => globalState.status,
    () => 'unknown',
  )
}

export function ServiceStatus({ variant = 'compact', className = '' }: ServiceStatusProps) {
  const status = useServiceStatus()
  const current = presentation[status]
  const isBlock = variant === 'block'

  return (
    <a
      href="https://status.odtechlab.com"
      target="_blank"
      rel="noreferrer"
      aria-label={'Service status: ' + current.description + '. Open OD LABS status page in a new tab.'}
      className={[
        'group font-mono transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-odl',
        isBlock
          ? 'flex w-full items-center justify-between gap-4 border-t border-zinc-600/60 pt-6 text-xs'
          : 'inline-flex items-center gap-2 text-[11px] tracking-wide',
        className,
      ].join(' ')}
    >
      {isBlock ? (
        <>
          <span className="flex min-w-0 flex-col gap-2">
            <span className="text-xs tracking-widest text-zinc-400 uppercase">Service status</span>
            <span className="flex items-center gap-2.5">
              <span aria-hidden="true" className={'h-2 w-2 shrink-0 rounded-full ' + current.dot} />
              <span className={'leading-relaxed ' + current.text}>{current.description}</span>
            </span>
          </span>
          <span aria-hidden="true" className="shrink-0 text-zinc-500 transition-transform group-hover:translate-x-1 group-hover:text-white">↗</span>
        </>
      ) : (
        <>
          <span aria-hidden="true" className={'h-2 w-2 shrink-0 rounded-full ' + current.dot} />
          <span className={'transition-colors group-hover:text-white ' + current.text}>{current.description}</span>
          <span aria-hidden="true" className="text-zinc-600 transition-colors group-hover:text-white">↗</span>
        </>
      )}
    </a>
  )
}
