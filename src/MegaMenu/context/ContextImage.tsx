import { Media as PayloadMedia } from '@/components/Media'
import type { Media } from '@/payload-types'
interface ContextImageProps { image: Media | null; title: string; compact?: boolean }
export const ContextImage = ({ image, title, compact = false }: ContextImageProps) => {
  if (!image?.url) return null
  return <div className={`w-full overflow-hidden border border-zinc-800 bg-zinc-950 ${compact ? 'h-36 sm:h-40 lg:h-44' : 'mb-6'}`}>
    <PayloadMedia resource={image} alt={image.alt || title} pictureClassName="block h-full w-full"
      imgClassName={compact ? 'block h-full w-full object-contain' : 'block h-auto w-full'}
      size={compact ? '(max-width: 640px) 100vw, 30vw' : '(max-width: 1024px) 100vw, 40vw'} />
  </div>
}