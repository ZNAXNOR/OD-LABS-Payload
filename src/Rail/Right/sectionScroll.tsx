import type { PagesData } from '@/getPagesData'

export type SectionScrollTarget = {
  id?: string
  href?: string
}

export type SectionScrollProps = {
  section?: PagesData['sections'][0] | SectionScrollTarget
  target?: HTMLElement | null
  event?: React.MouseEvent<HTMLAnchorElement | HTMLElement>
  offset?: number
}

export const handleSectionScroll = ({
  section,
  target: explicitTarget,
  event,
  offset = 16,
}: SectionScrollProps) => {
  const target = explicitTarget ?? (section?.id ? document.getElementById(section.id) : null)

  if (!target) return

  event?.preventDefault()

  const sectionScrollTop = target.getBoundingClientRect().top + window.scrollY - offset
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  window.scrollTo({
    top: sectionScrollTop,
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
  })

  const targetHref = section?.href ?? (target.id ? `#${target.id}` : undefined)

  if (targetHref && window.history && window.history.pushState) {
    window.history.pushState(null, '', targetHref)
  }

  return sectionScrollTop
}

