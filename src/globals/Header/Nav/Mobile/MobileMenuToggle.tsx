'use client'
import React from 'react'
import { Menu, X } from 'lucide-react'
import { CMSLink } from '@/components/CMSLink'
import type { Header as HeaderType } from '@/payload-types'
import { cn } from '@/utilities/ui'

interface MobileMenuToggleProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  menuCta?: HeaderType['menuCta']
}

export function MobileMenuToggle({ isOpen, setIsOpen, menuCta }: MobileMenuToggleProps) {
  return (
    <div className="flex items-center gap-4 lg:hidden">
      {/* Mobile CTA Button */}
      {menuCta && (
        <CMSLink
          {...menuCta}
          appearance="default"
          className="!px-4 !py-2 !text-xs !font-bold !rounded-full !bg-[#E94235] !text-white !border-0 whitespace-nowrap"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Hamburger Button */}
      <button
        className={cn(
          'relative z-[300] w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 active:scale-95 transition-all duration-300',
          isOpen ? 'opacity-0 invisible scale-90' : 'opacity-100 visible scale-100',
        )}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Menu"
      >
        <Menu size={20} />
      </button>
    </div>
  )
}
