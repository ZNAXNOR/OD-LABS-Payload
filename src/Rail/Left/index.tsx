'use client'

import { SquareLogo } from '@/components/Logo/Logo'
import { AppearanceControls } from '@/components/AppearanceControls'
import Link from 'next/link'
import { cn } from '@/utilities/ui'
import { useShowLogo } from './showLogo'

export const LeftRail = () => {
  const showLogo = useShowLogo()

  return (
    <aside
      className="hidden h-full w-18 flex-col border-r border-border-default bg-[repeating-linear-gradient(315deg,var(--pattern-fg)_0,var(--pattern-fg)_1px,transparent_0,transparent_50%)] bg-size-[10px_10px] [--pattern-fg:var(--color-text-muted)]/10 lg:flex"
      aria-label="Brand navigation"
    >
      <Link
        href="/"
        aria-label="Go to home"
        className={cn(
          'sticky top-0 flex h-18 w-full cursor-pointer items-center justify-center border-b border-border-default bg-surface transition-opacity duration-150',
          showLogo ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
      >
        <SquareLogo className="px-3" />
      </Link>
      <div className="sticky bottom-4 mt-auto flex justify-center pb-4">
        <AppearanceControls />
      </div>
    </aside>
  )
}
