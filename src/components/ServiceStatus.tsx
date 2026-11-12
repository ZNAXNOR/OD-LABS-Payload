'use client'

import { useSyncExternalStore } from 'react'
import { SquareArrowOutUpRight } from 'lucide-react'
import type { ServiceStatus as ServiceStatusValue, UptimeKumaStatus } from '@/lib/uptime-kuma'

type ServiceStatusProps = {
  variant?: 'compact' | 'block'
  className?: string
}

type StatusState = {
  status: ServiceStatusValue
  lastFetched: number
}

const CLIENT_CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

let globalState: StatusState = {
  status: 'unknown',
  lastFetched: 0,
}

const listeners = new Set<() => void>()
let inFlightFetch: Promise<ServiceStatusValue> | null = null
let sharedInterval: ReturnType<typeof setInterval> | null = null
let subscriberCount = 0

const presentation: Record<
  ServiceStatusValue,
  { dot: string; text: string; description: string }
> = {
  operational: {
    dot: 'bg-emerald-400 shadow-[0_0_0_3px_rgba(52,211,153,0.12)]',
    text: 'text-emerald-300',
    description: 'All systems operational',
  },
  degraded: {
    dot: 'bg-amber-400 shadow-[0_0_0_3px_rgba(251,191,36,0.12)]',
    text: 'text-amber-300',
    description: 'Some services experiencing issues',
  },
  outage: {
    dot: 'bg-red-400 shadow-[0_0_0_3px_rgba(248,113,113,0.14)]',
    text: 'text-red-300',
    description: 'Service disruption detected',
  },
  unknown: {
    dot: 'bg-zinc-500',
    text: 'text-zinc-400',
    description: 'Status currently unavailable',
  },
}

function notify() {
  listeners.forEach((listener) => listener())
}

async function fetchServiceStatus(): Promise<ServiceStatusValue> {
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
      const allowed: ServiceStatusValue[] = ['operational', 'degraded', 'outage', 'unknown']
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

export function useServiceStatus(): StatusState {
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
    () => globalState,
    () => globalState,
  )
}

export function ServiceStatus({ variant = 'compact', className = '' }: ServiceStatusProps) {
  const state = useServiceStatus()
  const isLoading = state.lastFetched === 0
  const current = presentation[state.status]
  const isBlock = variant === 'block'
  const description = isLoading ? 'Checking system status' : current.description
  const dotClass = isLoading
    ? 'bg-odl shadow-[0_0_0_3px_rgba(233,66,53,0.14)] motion-safe:animate-pulse'
    : current.dot
  const textClass = isLoading ? 'text-zinc-300' : current.text

  return (
    <a
      href="https://status.odtechlab.com"
      target="_blank"
      rel="noreferrer"
      aria-label={'Service status: ' + description + '. Open OD LABS status page in a new tab.'}
      className={[
        'group font-mono transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-odl',
        isBlock
          ? 'flex w-full items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs'
          : 'inline-flex items-center gap-3 rounded-sm border border-white/10 bg-white/[0.02] px-3 py-2 text-[11px] tracking-wide hover:border-odl/50 hover:bg-white/[0.04]',
        className,
      ].join(' ')}
    >
      {isBlock ? (
        <>
          <span className="flex min-w-0 flex-col gap-2">
            <span className="text-[10px] tracking-[0.2em] text-zinc-500 uppercase">
              OD LABS / System status
            </span>
            <span className="flex items-center gap-3">
              <span aria-hidden="true" className={'h-2 w-2 shrink-0 rounded-full ' + dotClass} />
              <span className={'leading-relaxed ' + textClass}>{description}</span>
            </span>
          </span>
          <SquareArrowOutUpRight
            aria-hidden="true"
            className="size-3.5 shrink-0 text-zinc-500 transition-transform group-hover:translate-x-0.5 group-hover:text-odl"
          />
        </>
      ) : (
        <>
          <span
            aria-hidden="true"
            className={'h-2 w-2 shrink-0 rounded-full ' + dotClass}
          />
          <span className="text-[10px] tracking-[0.16em] text-zinc-500 uppercase">
            System
          </span>
          <span className={'transition-colors group-hover:text-white ' + textClass}>
            {description}
          </span>
          <SquareArrowOutUpRight
            aria-hidden="true"
            className="size-3 text-zinc-600 transition-colors group-hover:text-odl"
          />
        </>
      )}
    </a>
  )
}
