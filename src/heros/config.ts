import type { Field } from 'payload'

// Import Sub-configs
import { standardHero } from './StandardHero/config'
import { servicesHero } from './ServicesHero/config'

// Export both hero types, isolated by pageType
export const hero: Field[] = [
  {
    ...standardHero,
    admin: {
      condition: (_: any, { pageType }: any = {}) => !pageType || pageType === 'standard',
    },
  } as any,
  servicesHero,
]
