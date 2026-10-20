'use client'

import { useEffect, useState } from 'react'

const Time_Zone = 'Asia/Kolkata'
const Locale = 'en-IN'

const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat(Locale, {
    timeZone: Time_Zone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(date)
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat(Locale, {
    timeZone: Time_Zone,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  }).format(date)
}

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

        {/* Availability */}
        <section className="space-y-3 border-t border-zinc-600/60 pt-6">
          <div className="font-mono text-[11px] tracking-widest text-zinc-400 uppercase">
            Availability
          </div>
          <div className="flex items-center gap-2 font-mono text-xs tracking-wide text-white">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-500 uppercase"></span>
            Open for Projects
          </div>
          <p className="pt-1 font-sans text-xs leading-relaxed text-zinc-400">
            I’m currently available for freelance and contract work. If you’d
            like to collaborate, say hi.
          </p>
        </section>

        {/* Contact & Dorect Inquiries */}
        <a
          href="mailto:omkar@odtechlab.com"
          className="group flex items-center gap-2 font-mono text-xs text-zinc-400 transition-colors hover:text-white"
        >
          <span
            aria-hidden="true"
            className="group inline-block h-1 w-1 bg-odl transition-transform duration-200 group-hover:scale-150"
          />
          <span> omkar@odtechlab.com </span>
        </a>
      </div>
    </aside>
  )
}
