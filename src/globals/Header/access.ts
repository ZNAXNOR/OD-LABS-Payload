import type { GlobalConfig } from 'payload'
import { authenticated } from '@/access/authenticated'

export const access: GlobalConfig['access'] = {
  // Anyone can read header data (needed for frontend)
  read: () => true,
  // Only authenticated users can update header
  update: authenticated,
}
