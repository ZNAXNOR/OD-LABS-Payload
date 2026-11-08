'use client'

import { useEffect, useState } from 'react'

export const useShowLogo = () => {
  const [showLogo, setShowLogo] = useState(false)

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (ticking) return
      ticking = true

      requestAnimationFrame(() => {
        ticking = false
        setShowLogo(window.scrollY > 68)
      })
    }

    // Check on mount
    setShowLogo(window.scrollY > 68)

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return showLogo
}
