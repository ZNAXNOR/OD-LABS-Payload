'use client'
import React from 'react'
import Link from 'next/link'
import { Logo } from '@/components/layout/Logo/Logo'
import { cn } from '@/utilities/ui'

interface HeaderBarProps {
  isScrolled: boolean
  openDropdown: number | null
  isMobileMenuOpen: boolean
  navLinks: React.ReactNode
}

export function HeaderBar({
  isScrolled,
  openDropdown,
  isMobileMenuOpen,
  navLinks,
}: HeaderBarProps) {
  return (
    <div
      className={cn(
        'relative z-[300] w-full transition-[background-color] duration-500 ease-in-out',
        isScrolled || openDropdown !== null || isMobileMenuOpen
          ? 'bg-zinc-900/95 backdrop-blur-lg border-b border-zinc-800'
          : 'bg-transparent border-b border-transparent ',
      )}
    >
      <div className="container mx-auto px-6 flex justify-between items-stretch pt-2">
        <Link
          href="/"
          className={cn(
            'relative z-50 flex items-center transition-[padding] duration-500',
            isScrolled || openDropdown !== null || isMobileMenuOpen ? 'py-4' : 'py-8',
          )}
        >
          <Logo
            loading="eager"
            priority="high"
            className="transform transition-transform duration-300 hover:scale-105"
          />
        </Link>
        <div className="flex items-stretch">{navLinks}</div>
      </div>
    </div>
  )
}
