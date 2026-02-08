import type { Media } from '@/payload-types'

export const imageAvatar4: Omit<Media, 'createdAt' | 'id' | 'updatedAt'> = {
  alt: 'Developer Avatar 4',
}
