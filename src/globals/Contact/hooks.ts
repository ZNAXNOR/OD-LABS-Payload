import type { GlobalConfig } from 'payload'
import { revalidateContactGlobal } from './hooks/revalidateContact'

export const hooks: GlobalConfig['hooks'] = {
  afterChange: [revalidateContactGlobal],
}
