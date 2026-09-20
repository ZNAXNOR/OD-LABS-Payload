'use client'

import { MegaMenuHeader } from './Nav/header'
import { MegaMenuFooter } from './Nav/footer'
import { useEffect } from 'react'
import { MegaMenuMain } from './main'

interface MegaMenuProps {
  open: boolean
  onClose: () => void
}

export const MegaMenu = ({ open, onClose }: MegaMenuProps) => {
  useEffect(() => {
    if (!open) return

    const handleESC = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleESC)

    return () => document.removeEventListener('keydown', handleESC)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return

    //Disable scroll on body when megamenu opens
    const originalStyle = document.body.style.overflow

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalStyle
    }
  }, [open])

  return (
    <div
      className={[
        'fixed inset-0 z-50 bg-[#0A0A0A]',
        'flex flex-col',
        'transition-opacity duration-300',
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
      ].join(' ')}
      aria-hidden={!open}
      aria-modal="true"
    >
      <MegaMenuHeader onClose={onClose} />

      <MegaMenuMain />

      <MegaMenuFooter />
    </div>
  )
}
