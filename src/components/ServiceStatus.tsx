'use client'

import { useEffect, useState } from 'react'
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

export function ServiceStatus({ variant = 'compact', className = '' }: ServiceStatusProps) {
  const [status, setStatus] = useState<ServiceStatus>('unknown')

  useEffect(() => {
    let active = true
    const refresh = async () => {
      try {
        const response = await fetch('/api/service-status', {
          cache: 'no-store',
          headers: { Accept: 'application/json' },
        })
        if (!response.ok) throw new Error('Status endpoint unavailable')
        const data = (await response.json()) as UptimeKumaStatus
        const allowed: ServiceStatus[] = ['operational', 'degraded', 'outage', 'unknown']
        if (!allowed.includes(data.status)) throw new Error('Invalid status response')
        if (active) setStatus(data.status)
      } catch {
        if (active) setStatus('unknown')
      }
    }

    void refresh()
    const interval = window.setInterval(() => void refresh(), 60_000)
    return () => {
      active = false
      window.clearInterval(interval)
    }
  }, [])

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
          <span className="flex min-w-0 items-center gap-3">
            <span aria-hidden="true" className={'h-2 w-2 shrink-0 rounded-full ' + current.dot} />
            <span className="flex min-w-0 flex-col gap-1">
              <span className="text-[11px] tracking-widest text-zinc-400 uppercase">Service status</span>
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