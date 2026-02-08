import type { Media } from '@/payload-types'

export const imageAvatar1: Omit<Media, 'createdAt' | 'id' | 'updatedAt'> = {
  alt: 'Developer Avatar 1',
}
