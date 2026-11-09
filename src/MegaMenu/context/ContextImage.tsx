import { Media as PayloadMedia } from '@/components/Media'
import type { Media } from '@/payload-types'

interface ContextImageProps {
  image: Media | null
  title: string
}

export const ContextImage = ({ image, title }: ContextImageProps) => {
  if (!image?.url) return null

  return (
    <div className="relative mb-6 aspect-video overflow-hidden border border-zinc-800 bg-zinc-950">
      <PayloadMedia
        resource={image}
        fill
        alt={image.alt || title}
        pictureClassName="absolute inset-0"
        imgClassName="object-cover"
        size="(max-width: 1024px) 100vw, 40vw"
      />
    </div>
  )
}
