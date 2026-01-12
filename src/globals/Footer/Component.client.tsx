'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import type { Footer } from '@/payload-types'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/CMSLink'
import { Logo } from '@/components/Logo/Logo'
import { cn } from '@/utilities/ui'

interface FooterClientProps {
  data: Footer
}

export function FooterClient({ data }: FooterClientProps) {
  const pathname = usePathname()
  const columns = data?.columns || []

  return (
    <footer
      className={cn(
        'border-t border-zinc-800 bg-zinc-900 text-white',
        pathname === '/' ? 'border-zinc-800/10' : '',
      )}
    >
      <div className="container py-16 gap-8 flex flex-col md:flex-row md:justify-between">
        <div className="flex flex-col gap-4">
          <Link className="flex items-center" href="/">
            {/* Force white logo since background is always dark */}
            <Logo loading="lazy" />
          </Link>
          <div className="flex flex-col gap-2">
            <p className="text-sm text-zinc-500">
              © {new Date().getFullYear()} OD LABS. All rights reserved.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-12 md:gap-24">
          {columns.map((col, i) => (
            <div key={i} className="flex flex-col gap-4">
              <h3 className="font-medium text-zinc-100">{col.label}</h3>
              <nav className="flex flex-col gap-3">
                {col.navItems?.map(({ link }, j) => (
                  <CMSLink
                    className="text-zinc-400 hover:text-white transition-colors text-sm"
                    key={j}
                    {...link}
                    appearance="inline"
                  />
                ))}
              </nav>
            </div>
          ))}

          <div className="flex flex-col gap-4">
            <h3 className="font-medium text-zinc-100">Preferences</h3>
            {/* ThemeSelector might need adjustment if it relies on global theme headers. 
                For now, placing it here as requested. */}
            <div className="text-zinc-400">
              <ThemeSelector />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
