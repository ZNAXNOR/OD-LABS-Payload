'use client'
import React from 'react'
import { CMSLink } from '@/components/CMSLink'
import type { Header as HeaderType } from '@/payload-types'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/utilities/ui'

interface NavLinksProps {
  tabs: NonNullable<HeaderType['tabs']>
  isScrolled: boolean
  openDropdown: number | null
  setOpenDropdown: (index: number | null) => void
}

export function NavLinks({ tabs, isScrolled, openDropdown, setOpenDropdown }: NavLinksProps) {
  return (
    <nav className="hidden lg:flex h-full items-stretch">
      {tabs.map((tab, i) => (
        <div
          key={i}
          className={cn(
            'relative flex items-stretch transition-[padding] duration-300',
            isScrolled || openDropdown !== null ? 'py-4' : 'py-8',
          )}
          onMouseEnter={() => setOpenDropdown(i)}
          onMouseLeave={() => setOpenDropdown(null)}
        >
          {tab.enableDirectLink && tab.directLink?.link ? (
            <CMSLink
              {...tab.directLink.link}
              className="text-sm font-semibold text-white/80 hover:text-white transition-all duration-300 px-6 flex items-center gap-1 group h-full relative"
              label={null}
            >
              {tab.label}
              <div
                className={cn(
                  'absolute -bottom-4 left-0 w-full h-[3px] bg-brand-primary transition-transform duration-300 origin-left',
                  openDropdown === i ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                )}
              />
            </CMSLink>
          ) : (
            <button className="flex items-center gap-1.5 text-sm font-semibold text-white/80 hover:text-white transition-all duration-300 px-6 h-full group cursor-default relative">
              {tab.label}
              {tab.enableDropdown && (
                <ChevronDown
                  className={cn(
                    'w-4 h-4 transition-transform duration-300',
                    openDropdown === i && 'rotate-180 text-brand-primary',
                  )}
                />
              )}
              <div
                className={cn(
                  'absolute -bottom-4 left-0 w-full h-[3px] bg-brand-primary transition-transform duration-300 origin-left',
                  openDropdown === i ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                )}
              />
            </button>
          )}
        </div>
      ))}
    </nav>
  )
}
