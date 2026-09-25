import type { PagesData } from '@/getPagesData'


type sectionScrollProps = {
  section: PagesData['sections'][0]
  event: React.MouseEvent<HTMLAnchorElement>
}

export const handleSectionScroll = ({ section, event }: sectionScrollProps) => {
  const target = document.getElementById(section.id)

  if (!target) return

  event.preventDefault()

  const offset = 16

  const sectionScrollTop = target.getBoundingClientRect().top + window.scrollY - offset

  window.scrollTo({
    top: sectionScrollTop,
    behavior: 'smooth',
  })

  return sectionScrollTop
}
