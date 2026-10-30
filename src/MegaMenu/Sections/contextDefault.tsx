'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ServiceStatus } from '@/components/ServiceStatus'

const Time_Zone = 'Asia/Kolkata'
const Locale = 'en-IN'

const formatTime = (date: Date) =>
  new Intl.DateTimeFormat(Locale, {
    timeZone: Time_Zone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(date)

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat(Locale, {
    timeZone: Time_Zone,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  }).format(date)

export const MegaMenu_ContextDefault = () => {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    const updateTime = () => setNow(new Date())
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <aside className="flex flex-col justify-between pt-8 lg:pt-0">
      <div className="space-y-8">
        {/* Local Time */}
        <section className="space-y-4">
          <div className="font-mono text-xs tracking-widest text-zinc-400 uppercase">
            Local time
          </div>
          <div
            className="font-mono text-3xl font-semibold tracking-tight text-white tabular-nums sm:text-4xl"
            aria-live="off"
          >
            {now ? formatTime(now) : '--:--:-- --'}
            <span className="hidden text-white sm:inline"> IST</span>
          </div>
          <div
            className="font-mono text-xs tracking-wide text-zinc-300"
            aria-live="off"
          >
            {now ? formatDate(now) : 'Loading date...'}
          </div>
          <div className="font-mono text-xs text-zinc-500">
            Asia / Kolkata (UTC +05:30)
          </div>
        </section>

        {/* Contact actions */}
        <section className="space-y-3 border-t border-zinc-600/60 pt-6">
          <div className="font-mono text-xs tracking-widest text-zinc-400 uppercase">
            Contact
          </div>
          <div className="flex flex-col gap-2">
            <Link
              href="/contact"
              className="group border-odl bg-odl hover:bg-odl/90 hover:border-odl/60 focus-visible:outline-odl flex min-h-12 w-full items-center justify-between border px-4 py-3 font-mono text-xs tracking-wide text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              <span>[ Build a project ]</span>
              <span
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-1"
              >
                ↗
              </span>
            </Link>
            <Link
              href="/book"
              className="group focus-visible:outline-odl hover:bg-odl/5 hover:border-odl flex min-h-12 w-full items-center justify-between border border-zinc-800 px-4 py-3 font-mono text-xs tracking-wide text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              <span>[ Schedule a meeting ]</span>
              <span
                aria-hidden="true"
                className="text-zinc-500 transition-transform group-hover:translate-x-1 group-hover:text-white"
              >
                ↗
              </span>
            </Link>
          </div>
        </section>

        {/* Public service status */}
        <ServiceStatus variant="block" />
      </div>
    </aside>
  )
}
