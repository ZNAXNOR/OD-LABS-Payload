import type { GlobalConfig } from 'payload'
import { revalidateFooter } from './hooks/revalidateFooter'

export const hooks: GlobalConfig['hooks'] = {
  afterChange: [revalidateFooter],
}
