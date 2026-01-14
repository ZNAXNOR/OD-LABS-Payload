'use client'

import { useEffect, useState } from 'react'

export const useHeaderScroll = () => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const header = document.querySelector('header')
    const updateHeaderHeight = () => {
      if (header) {
        document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`)
      }
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
      updateHeaderHeight()
    }

    updateHeaderHeight()
    window.addEventListener('resize', updateHeaderHeight)
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('resize', updateHeaderHeight)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return isScrolled
}
