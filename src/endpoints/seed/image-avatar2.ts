import type { Media } from '@/payload-types'

export const imageAvatar2: Omit<Media, 'createdAt' | 'id' | 'updatedAt'> = {
  alt: 'Developer Avatar 2',
}
