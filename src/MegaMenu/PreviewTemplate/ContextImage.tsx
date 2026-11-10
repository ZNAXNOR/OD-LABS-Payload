import { Media as PayloadMedia } from '@/components/Media'
import type { Media } from '@/payload-types'

interface ContextImageProps {
  image: Media | null
  title: string
  compact?: boolean
}

export const ContextImage = ({ image, title, compact = false }: ContextImageProps) => {
  if (!image?.url) {
    return (
      <div
        aria-label={`Generated preview placeholder for ${title}`}
        className="relative flex aspect-[4/3] min-h-44 w-full max-w-full flex-col justify-between overflow-hidden border border-zinc-800 bg-black p-4 sm:p-5"
      >
        <div className="flex items-center justify-between gap-3 font-mono text-[9px] tracking-[0.2em] text-zinc-500 uppercase">
          <span>OD LABS</span>
          <span>Preview / 00</span>
        </div>
        <div className="relative z-10">
          <div className="mb-2 h-px w-8 bg-odl" />
          <p className="line-clamp-4 font-mono text-base font-medium leading-snug tracking-tight text-white sm:text-lg">
            {title}
          </p>
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-10 -right-6 size-40 rounded-full border border-zinc-800/80" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-5 -right-1 size-28 rounded-full border border-zinc-800/60" />
        <div className="font-mono text-[9px] tracking-widest text-zinc-600 uppercase"></div>
      </div>
    )
  }

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
