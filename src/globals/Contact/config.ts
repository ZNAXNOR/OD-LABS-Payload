import type { GlobalConfig } from 'payload'

import { revalidateContactGlobal } from './hooks/revalidateContact'
import { authenticated } from '@/access/authenticated'

import { SocialMediaTab } from './tabs/SocialMedia'

export const ContactGlobal: GlobalConfig = {
  slug: 'contact',
  access: {
    read: () => true,
    update: authenticated,
  },
  label: 'Contact Global',
  fields: [
    {
      type: 'tabs',
      tabs: [SocialMediaTab],
    },
  ],
  hooks: {
    afterChange: [revalidateContactGlobal],
  },
}
