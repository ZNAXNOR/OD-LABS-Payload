import { getCachedGlobal } from '@/utilities/getGlobals'
import type { ContactSocial } from '@/payload-types'

export const getContactSocials = async (): Promise<ContactSocial | null> => {
  try {
    return await getCachedGlobal('contact-socials', 1)()
  } catch (error) {
    console.error('Failed to fetch contact socials:', error)
    return null
  }
}
