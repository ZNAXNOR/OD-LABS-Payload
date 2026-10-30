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
          <div className="font-mono text-xs tracking-widest text-zinc-400 uppercase">Local time</div>
          <div className="font-mono text-3xl font-semibold tracking-tight text-white tabular-nums sm:text-4xl" aria-live="off">
            {now ? formatTime(now) : '--:--:-- --'}
            <span className="hidden text-white sm:inline"> IST</span>
          </div>
          <div className="font-mono text-xs tracking-wide text-zinc-300" aria-live="off">
            {now ? formatDate(now) : 'Loading date...'}
          </div>
          <div className="font-mono text-xs text-zinc-500">Asia / Kolkata (UTC +05:30)</div>
        </section>

        {/* Contact actions */}
        <section className="space-y-3 border-t border-zinc-600/60 pt-6">
          <div className="font-mono text-[11px] tracking-widest text-zinc-400 uppercase">Contact</div>
          <div className="flex flex-col gap-2">
            <Link
              href="/contact"
              className="group flex min-h-12 w-full items-center justify-between border border-odl bg-odl px-4 py-3 font-mono text-xs tracking-wide text-black transition-colors hover:bg-lime-300 hover:border-lime-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-odl"
            >
              <span>[ Build a project ]</span>
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">↗</span>
            </Link>
            <Link
              href="/book"
              className="group flex min-h-12 w-full items-center justify-between border border-zinc-800 px-4 py-3 font-mono text-xs tracking-wide text-white transition-colors hover:border-zinc-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-odl"
            >
              <span>[ Schedule a meeting ]</span>
              <span aria-hidden="true" className="text-zinc-500 transition-colors group-hover:text-white">↗</span>
            </Link>
          </div>
          <a
            href="mailto:omkar@odtechlab.com"
            className="group flex items-center gap-2 pt-1 font-mono text-xs text-zinc-400 transition-colors hover:text-white"
          >
            <span aria-hidden="true" className="inline-block h-1 w-1 bg-odl transition-transform duration-200 group-hover:scale-150" />
            <span>omkar@odtechlab.com</span>
          </a>
        </section>

        {/* Public service status */}
        <ServiceStatus variant="block" />
      </div>
    </aside>
  )
}