'use client'

import React from 'react'
import type { Header as HeaderType } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'
import { useZonedClock } from '@/hooks/useZonedClock'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const { time } = useZonedClock({ intervalMs: 1000 })

  return (
    <nav className="text-md flex items-center gap-6 font-mono tracking-wide">
      {navItems.map(({ link }, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="text-zinc-800 select-none">•</span>}
          <CMSLink
            className="group relative inline-flex items-center text-zinc-400 hover:text-white"
            {...link}
            label={null}
          >
            <span className="mr-1 text-2xl font-bold text-odl opacity-0 transition-opacity duration-100 group-hover:opacity-100">{'['}</span>
            <span>{link.label}</span>
            <span className="ml-1 text-2xl font-bold text-odl opacity-0 transition-opacity duration-100 group-hover:opacity-100">{']'}</span>
          </CMSLink>
        </React.Fragment>
      ))}

      <span className="text-zinc-800 select-none">|</span>
      <Link href="/search">
        <span className="sr-only">Search</span>
        <SearchIcon className="w-5 text-zinc-400 hover:text-white" />
      </Link>
      <span className="text-zinc-800 select-none">|</span>
      <div className="text-zinc-400 hover:text-white">
        <div className="text-md font-mono tracking-wide select-none" title="India Standard Time · UTC+5:30">
          {time ?? '--:-- --'}<span> IST</span>
        </div>
      </div>
    </nav>
  )
}
