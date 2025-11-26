import { link } from '@/fields/link'
import { GlobalConfig } from 'payload'

import { revalidateMegaMenu } from './hooks/revalidateMegaMenu'

export const MegaMenu: GlobalConfig = {
  slug: 'mega-menu',
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/MegaMenu/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateMegaMenu],
  },
}
