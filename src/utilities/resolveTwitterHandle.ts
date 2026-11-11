import type { ContactSocial } from '@/payload-types'

const DEFAULT_TWITTER_HANDLE = '@Omkar_Dalvi2004'

function extractHandle(rawUrlOrHandle?: string | null): string | null {
  if (!rawUrlOrHandle) return null
  const trimmed = rawUrlOrHandle.trim()
  if (!trimmed) return null

  if (trimmed.startsWith('@')) {
    return trimmed
  }

  try {
    const urlObj = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`)
    const pathname = urlObj.pathname.replace(/^\/+|\/+$/g, '')
    if (pathname && !pathname.includes('/')) {
      return `@${pathname}`
    }
  } catch {
    if (!trimmed.includes('/') && !trimmed.includes(' ')) {
      return `@${trimmed}`
    }
  }

  return null
}

/**
 * Resolves the Twitter / X creator handle according to the priority hierarchy:
 * 1. OD LABS handle in Contact Globals
 * 2. Omkar Dalvi handle in Contact Globals
 * 3. Fallback: @Omkar_Dalvi2004
 */
export function resolveTwitterHandle(contactSocials?: ContactSocial | null): string {
  const links = contactSocials?.socialLinks || []

  // 1. OD LABS handle in Globals
  const odLabsX = links.find(
    (item) =>
      item.enabled !== false &&
      item.profile === 'od-labs' &&
      (item.platform === 'x' || (item.platform as string) === 'twitter'),
  )
  const odLabsHandle = extractHandle(odLabsX?.url)
  if (odLabsHandle) return odLabsHandle

  // 2. Omkar handle in Globals
  const omkarX = links.find(
    (item) =>
      item.enabled !== false &&
      item.profile === 'omkar-dalvi' &&
      (item.platform === 'x' || (item.platform as string) === 'twitter'),
  )
  const omkarHandle = extractHandle(omkarX?.url)
  if (omkarHandle) return omkarHandle

  // 3. Fallback
  return DEFAULT_TWITTER_HANDLE
}
