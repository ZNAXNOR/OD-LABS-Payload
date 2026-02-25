import type { Field } from 'payload'

// Import Sub-configs
import { standardHero } from './StandardHero/config'

// Export standard hero type, isolated to standard pages
export const hero: Field[] = [
  {
    ...standardHero,
    admin: {
      condition: (_: any, { pageType }: any = {}) => !pageType || pageType === 'standard',
    },
  } as any,
]
