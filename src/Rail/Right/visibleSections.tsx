import { PagesData } from '@/getPagesData'
import { useActiveSection } from './activeSection'

const MAX_VISIBLE_SECTIONS = 5

export const getVisibleSections = (
  sections: PagesData['sections'],
  activeSection: string | null,
) => {
  if (sections.length <= MAX_VISIBLE_SECTIONS) {
    return sections.map((section, index) => ({
      section,
      index,
      isCompressed: false,
    }))
  }

  const activeIndex = Math.max(
    0,
    sections.findIndex((section) => section.id === activeSection),
  )

  let start = activeIndex - 2
  let end = activeIndex + 2

  if (start < 0) {
    start = 0
    end = MAX_VISIBLE_SECTIONS - 1
  }

  if (sections.length <= end) {
    end = sections.length - 1
    start = sections.length - MAX_VISIBLE_SECTIONS
  }

  return sections.slice(start, end + 1).map((section, index) => {
    const actualIndex = start + index

    return {
      section,
      index: actualIndex,
      isCompressed:
        (actualIndex === start && start > 0) || (actualIndex === end && end < sections.length - 1),
    }
  })
}
