import type { GlobalConfig } from 'payload'
import { revalidateHeader } from './hooks/revalidateHeader'

export const hooks: GlobalConfig['hooks'] = {
  afterChange: [revalidateHeader],
}
