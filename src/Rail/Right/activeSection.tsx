import { useEffect, useState } from 'react'
import type { PagesData } from '@/getPagesData'

const ACTIVE_OFFSET = 80

export const useActiveSection = (sections: PagesData['sections']) => {
  const [activeSection, setActiveSection] = useState<string | null>(sections[0].id ?? null)

  useEffect(() => {
    if (!sections.length) return

    const handleScroll = () => {
      let currentSection = sections[0]

      for (const section of sections) {
        const element = document.getElementById(section.id)

        if (!element) continue

        if (element.getBoundingClientRect().top <= ACTIVE_OFFSET) {
          currentSection = section
        } else {
          break
        }
      }
      setActiveSection(currentSection.id)
    }

    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [sections])

  return activeSection
}
