'use client'

import { useEffect, useState } from 'react'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'

const Time_Zone = 'Asia/Kolkata'
const Locale = 'en-IN'

const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat(Locale, {
    timeZone: Time_Zone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date)
}

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    const updateTime = () => setNow(new Date())
    updateTime()

    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <nav className="flex gap-6 items-center text-md font-mono tracking-wide">
      {navItems.map(({ link }, i) => {
        return (
          <React.Fragment key={i}>
            {i > 0 && <span className="text-zinc-800 select-none">•</span>}

            <CMSLink
              className="group relative inline-flex items-center text-zinc-400 hover:text-white"
              {...link}
              label={null}
            >
              <span className="text-red-500 text-2xl font-bold mr-1 opacity-0 group-hover:opacity-100 transition-opacity duration-100">
                {'['}
              </span>

              <span>{link.label}</span>

              <span className="text-red-500 text-2xl font-bold ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-100">
                {']'}
              </span>
            </CMSLink>
          </React.Fragment>
        )
      })}

      <span className="text-zinc-800 select-none">|</span>

      <Link href="/search">
        <span className="sr-only ">Search</span>
        <SearchIcon className="w-5 text-zinc-400 hover:text-white" />
      </Link>

      <span className="text-zinc-800 select-none">|</span>

      <div className="text-zinc-400 hover:text-white">
        <div
          className="text-md font-mono tracking-wide select-none"
          title="India Standard Time · UTC+5:30"
        >
          {now ? formatTime(now) : '--:-- --'}
          <span> IST</span>
        </div>
      </div>
    </nav>
  )
}
