'use client'

import { useEffect, useState } from 'react'

export const useShowLogo = () => {
  const [showLogo, setShowLogo] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setShowLogo(true)
      } else {
        setShowLogo(false)
      }
    }

    // Check on mount
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return showLogo
}
