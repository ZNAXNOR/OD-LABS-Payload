import { Media as PayloadMedia } from '@/components/Media'
import type { Media } from '@/payload-types'

interface ContextImageProps {
  image: Media | null
  title: string
}

export const ContextImage = ({ image, title }: ContextImageProps) => {
  if (!image?.url) return null

  return (
    <div className="mb-6 w-full overflow-hidden border border-zinc-800 bg-zinc-950">
      <PayloadMedia
        resource={image}
        alt={image.alt || title}
        pictureClassName="block w-full"
        imgClassName="block h-auto w-full"
        size="(max-width: 1024px) 100vw, 40vw"
      />
    </div>
  )
}
