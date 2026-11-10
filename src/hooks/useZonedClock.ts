'use client'

import { useEffect, useState } from 'react'

export const SITE_TIME_ZONE = 'Asia/Kolkata'
export const SITE_TIME_LOCALE = 'en-IN'

interface UseZonedClockOptions {
  enabled?: boolean
  intervalMs?: number
}

export const formatZonedTime = (
  date: Date,
  options: Intl.DateTimeFormatOptions = {},
  locale = SITE_TIME_LOCALE,
) =>
  new Intl.DateTimeFormat(locale, {
    timeZone: SITE_TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    ...options,
  }).format(date)

export const formatZonedDate = (
  date: Date,
  options: Intl.DateTimeFormatOptions = {},
  locale = SITE_TIME_LOCALE,
) =>
  new Intl.DateTimeFormat(locale, {
    timeZone: SITE_TIME_ZONE,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    ...options,
  }).format(date)

export const useZonedClock = ({
  enabled = true,
  intervalMs = 1000,
}: UseZonedClockOptions = {}) => {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    if (!enabled) return
    const update = () => setNow(new Date())
    update()
    const interval = window.setInterval(update, intervalMs)
    return () => window.clearInterval(interval)
  }, [enabled, intervalMs])

  return {
    now,
    time: now ? formatZonedTime(now) : null,
    date: now ? formatZonedDate(now) : null,
  }
}
