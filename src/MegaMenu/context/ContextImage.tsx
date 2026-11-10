import { Media as PayloadMedia } from '@/components/Media'
import type { Media } from '@/payload-types'

interface ContextImageProps {
  image: Media | null
  title: string
  compact?: boolean
}

export const ContextImage = ({ image, title, compact = false }: ContextImageProps) => {
  if (!image?.url) return null

  return (
    <div
      className={[
        'inline-flex max-w-full items-start overflow-hidden border border-zinc-800 bg-zinc-950',
        compact ? 'max-h-56 sm:max-h-64 lg:max-h-72' : 'mb-6 max-h-[32rem]',
      ].join(' ')}
    >
      <PayloadMedia
        resource={image}
        alt={image.alt || title}
        pictureClassName="block max-h-inherit max-w-full"
        imgClassName="block h-auto max-h-56 w-auto max-w-full object-contain sm:max-h-64 lg:max-h-72"
        size={compact ? '(max-width: 640px) 100vw, 30vw' : '(max-width: 1024px) 100vw, 40vw'}
      />
    </div>
  )
}
