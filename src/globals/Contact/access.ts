import type { GlobalConfig } from 'payload'
import { authenticated } from '@/access/authenticated'

export const access: GlobalConfig['access'] = {
  // Anyone can read contact information (needed for frontend)
  read: () => true,
  // Only authenticated users can update contact information
  update: authenticated,
}
