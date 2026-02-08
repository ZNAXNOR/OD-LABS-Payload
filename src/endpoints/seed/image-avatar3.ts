import type { Media } from '@/payload-types'

export const imageAvatar3: Omit<Media, 'createdAt' | 'id' | 'updatedAt'> = {
  alt: 'Developer Avatar 3',
}
