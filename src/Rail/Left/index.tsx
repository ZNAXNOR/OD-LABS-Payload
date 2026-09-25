'use client'

import { SquareLogo } from '@/components/Logo/Logo'
import Link from 'next/link'
import { cn } from '@/utilities/ui'
import { useShowLogo } from './showLogo'

export const LeftRail = () => {
  const showLogo = useShowLogo()

  return (
    <aside className="hidden h-full w-18 border-r border-zinc-600 bg-[repeating-linear-gradient(315deg,var(--pattern-fg)_0,var(--pattern-fg)_1px,transparent_0,transparent_50%)] bg-size-[10px_10px] [--pattern-fg:var(--color-zinc-100)]/10 lg:block">
      <Link
        href="/"
        className={cn(
          'sticky top-0  flex h-18 w-full cursor-pointer items-center justify-center border-b border-zinc-600 bg-zinc-950 transition-opacity duration-150',
          showLogo ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
      >
        <SquareLogo className="px-3" />
      </Link>
    </aside>
  )
}
