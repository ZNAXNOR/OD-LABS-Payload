import type { ContactSocial } from '@/payload-types'

export type FormattedContactAction = {
  label?: string | null
  href: string
  description?: string | null
  newTab?: boolean
}

export type FormattedSocialLink = {
  profile?: string | null
  platform?: string | null
  url: string
}

export const getActionHref = (action?: any): string => {
  if (!action) return '#'
  if (action.link) {
    if (action.link.type === 'custom') {
      return action.link.url || '#'
    }
    if (action.link.type === 'reference' && action.link.reference?.value) {
      const refVal = action.link.reference.value
      if (typeof refVal === 'object' && refVal?.slug) {
        const relationTo = action.link.reference.relationTo
        return `${relationTo && relationTo !== 'pages' ? `/${relationTo}` : ''}/${refVal.slug}`
      }
      if (typeof refVal === 'string') return `/${refVal}`
    }
    if (action.link.url) return action.link.url
  }
  return action.href || '#'
}

export const formatContactActions = (
  actions?: ContactSocial['contactActions'],
): FormattedContactAction[] => {
  if (!actions) return []
  return actions
    .filter((item) => {
      if (item.enabled === false) return false
      const href = getActionHref(item)
      return Boolean((href && href !== '#') || (item as any).href)
    })
    .map((action) => ({
      label: action.link?.label || (action as any).label,
      href: getActionHref(action),
      description: action.description,
      newTab: action.link?.newTab ?? false,
    }))
}

export const formatSocialLinks = (
  links?: ContactSocial['socialLinks'],
): FormattedSocialLink[] => {
  if (!links) return []
  return links
    .filter((item) => item.enabled !== false && Boolean(item.url))
    .map((social) => ({
      profile: social.profile,
      platform: social.platform,
      url: social.url || '',
    }))
}
