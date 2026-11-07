import { useEffect, useState } from 'react'
import type { PagesData } from '@/getPagesData'

const ACTIVE_OFFSET = 80

export const useActiveSection = (sections: PagesData['sections']) => {
  const [activeSection, setActiveSection] = useState<string | null>(
    sections && sections.length > 1 ? sections[0].id : null,
  )

  useEffect(() => {
    if (!sections || sections.length <= 1) {
      setActiveSection(null)
      return
    }

    setActiveSection(sections[0].id)

    let ticking = false

    const handleScroll = () => {
      if (ticking) return
      ticking = true

      requestAnimationFrame(() => {
        ticking = false

        // Check if user is scrolled to the bottom of the page
        const isBottom =
          window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 50

        if (isBottom) {
          setActiveSection(sections[sections.length - 1].id)
          return
        }

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
      })
    }

    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [sections])

  return activeSection
}
