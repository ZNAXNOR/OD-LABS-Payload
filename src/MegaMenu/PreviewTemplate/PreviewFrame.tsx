import Link from 'next/link'
import { CalendarDays, SquareArrowOutUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ReactNode } from 'react'
import type { MegaMenuEntry } from '../registry'
import { ContextImage } from './ContextImage'

export const PreviewFrame = ({ entry, metadata, showSections = false }: { entry: MegaMenuEntry; metadata?: ReactNode; showSections?: boolean }) => {
  const showImage = entry.showSeoImageInMegaMenu && Boolean(entry.image?.url)
  const showPlaceholder = !entry.showSeoImageInMegaMenu && entry.showCssPreviewInMegaMenu
  const showVisual = showImage || showPlaceholder
  return (
    <div className={['grid min-h-0 min-w-0 grid-cols-1 gap-4 sm:gap-6', showVisual ? 'sm:grid-cols-[minmax(180px,0.8fr)_minmax(0,1.7fr)]' : ''].join(' ')}>
      {showVisual && <div className="min-w-0 select-none"><ContextImage image={showImage ? entry.image : null} title={entry.title} compact placeholder={showPlaceholder} /></div>}
      <div className="flex min-w-0 flex-col items-start">
        <h2 className="line-clamp-3 font-mono text-2xl font-bold tracking-tight text-white sm:text-3xl">{entry.title}</h2>
        {entry.description && <p className="mt-2 line-clamp-2 max-w-3xl font-sans text-xs leading-relaxed text-zinc-400 sm:text-sm">{entry.description}</p>}
        {metadata && <div className="mt-3 flex flex-wrap items-center gap-3">{metadata}</div>}
        <div className="mt-4"><Button asChild variant="outline" size="sm" className="!px-4 !py-2"><Link href={entry.href}>View {entry.destinationLabel}<SquareArrowOutUpRight aria-hidden="true" /></Link></Button></div>
        {showSections && entry.sections.length > 0 && <div className="mt-4 w-full min-w-0 space-y-2">
          <div className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">On This Page</div>
          <nav aria-label={entry.title + ' page sections'} className="flex flex-nowrap gap-2 overflow-x-auto pb-1">
            {entry.sections.map((section, index) => <Link key={section.id} href={section.href} className="shrink-0 border border-zinc-800 px-2.5 py-1.5 font-mono text-[10px] text-zinc-400 transition-colors hover:border-zinc-600 hover:text-white"><span className="mr-1.5 text-odl">{String(index + 1).padStart(2, '0')}</span>{section.label}</Link>)}
          </nav>
        </div>}
      </div>
    </div>
  )
}

export const PreviewDate = ({ value }: { value: string }) => <span className="inline-flex items-center gap-2 font-mono text-[11px] text-zinc-500"><CalendarDays className="size-3.5" aria-hidden="true" /><time dateTime={value}>{new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeZone: 'Asia/Kolkata' }).format(new Date(value))}</time></span>
