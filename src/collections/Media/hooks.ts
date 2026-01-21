import type { CollectionConfig } from 'payload'
import { autoGenerateAltText, revalidateMedia } from '@/hooks/collections/media'

export const hooks: CollectionConfig['hooks'] = {
  beforeChange: [autoGenerateAltText],
  afterChange: [revalidateMedia],
}
