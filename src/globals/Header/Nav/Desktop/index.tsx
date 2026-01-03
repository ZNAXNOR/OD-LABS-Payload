'use client'
import React from 'react'
import type { Header as HeaderType } from '@/payload-types'
import { NavLinks } from './NavLinks'
import { MegaMenu } from './MegaMenu'

interface DesktopNavProps {
  tabs: NonNullable<HeaderType['tabs']>
  isScrolled: boolean
  openDropdown: number | null
  setOpenDropdown: (index: number | null) => void
}

export function DesktopNav({ tabs, isScrolled, openDropdown, setOpenDropdown }: DesktopNavProps) {
  return (
    <NavLinks
      tabs={tabs}
      isScrolled={isScrolled}
      openDropdown={openDropdown}
      setOpenDropdown={setOpenDropdown}
    />
  )
}

export { MegaMenu as DesktopMegaMenu }
export { NavLinks as DesktopNavLinks }
