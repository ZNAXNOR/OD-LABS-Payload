import type { GlobalConfig } from 'payload'
import { authenticated } from '@/access/authenticated'

export const access: GlobalConfig['access'] = {
  // Anyone can read footer data (needed for frontend)
  read: () => true,
  // Only authenticated users can update footer
  update: authenticated,
}
