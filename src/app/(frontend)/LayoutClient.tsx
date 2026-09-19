'use client'

import React, { useState } from 'react'
import { RightRail } from '@/Rail/Right'
import { MegaMenu } from '@/MegaMenu'

export const LayoutClient = ({ 
  children,
  header,
  footer,
  leftRail
}: { 
  children: React.ReactNode;
  header: React.ReactNode;
  footer: React.ReactNode;
  leftRail: React.ReactNode;
}) => {
  const [MegaMenuOpen, setMegaMenuOpen] = useState(false)

  return (
    <>
      <div className="mx-auto w-full max-w-380 grid grid-cols-1 lg:grid-cols-[64px_minmax(0,1fr)_64px]">
        {/* Left rail */}
        {leftRail}

        {/* Main Site */}
        <div className="flex flex-col min-h-screen">
          {header}
          {children}
          {footer}
        </div>

        {/* Right rail */}
        <RightRail onMenuOpen={() => setMegaMenuOpen(true)} />
      </div>

      {/* Mega menu */}
      <MegaMenu open={MegaMenuOpen} onClose={() => setMegaMenuOpen(false)} />
    </>
  )
}

