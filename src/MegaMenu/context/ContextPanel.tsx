'use client'
import Link from 'next/link'
import { CalendarDays, SquareArrowOutUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { CurrentPageInfo } from '../types'
import type { MegaMenuEntry } from '../registry'
import { ContextBreadcrumb } from './ContextBreadcrumb'
import { ContextImage } from './ContextImage'
import { MegaMenu_CurrentPage } from '../Sections/currentPage'
interface Props { currentPage: CurrentPageInfo; preview: MegaMenuEntry | null }
export const MegaMenu_ContextPanel = ({ currentPage, preview }: Props) => {
  if (!preview && currentPage.type === 'error') return <div className="min-h-0"><MegaMenu_CurrentPage page={currentPage} /></div>
  const isPreview = Boolean(preview)
  const title = preview?.title ?? currentPage.title
  const href = preview?.href ?? currentPage.href
  const description = preview?.description ?? currentPage.description
  const image = preview?.image ?? (currentPage.type === 'page' || currentPage.type === 'post' || currentPage.type === 'legal' ? currentPage.seoImage : null)
  const sections = preview?.sections ?? (currentPage.type === 'page' ? currentPage.sections : [])
  const publishedAt = preview?.publishedAt ?? (currentPage.type === 'post' ? currentPage.publishedAt : null)
  const categories = preview?.categories ?? (currentPage.type === 'post' ? currentPage.categories : [])
  const crumbs = preview
    ? (preview.kind === 'post' ? [{label:'Home',href:'/'},{label:preview?.breadcrumbLabel ?? 'Insights',href:'/posts'},{label:title}] : href === '/' ? [{label:'Home'}] : [{label:'Home',href:'/'},{label:title}])
    : (currentPage.type === 'post' ? [{label:'Home',href:'/'},{label:'Insights',href:'/posts'},{label:title}] : href === '/' ? [{label:'Home'}] : [{label:'Home',href:'/'},{label:title}])
  return <section className="grid min-w-0 shrink-0 grid-cols-1 gap-6 border-b border-zinc-800/80 pb-7 sm:grid-cols-[minmax(180px,0.8fr)_minmax(0,1.7fr)] sm:gap-8 lg:pb-8">
    {image ? <div className="min-w-0"><ContextImage image={image} title={title} compact /></div> : <div className="hidden min-h-36 border border-zinc-800 bg-zinc-950 sm:block" aria-hidden="true" />}
    <div className="flex min-w-0 flex-col items-start">
      <ContextBreadcrumb items={crumbs} />
      <div className="mb-2 font-mono text-[11px] tracking-widest text-odl uppercase">{isPreview ? preview?.previewLabel : currentPage.type === 'post' ? 'Current Post' : 'Current Page'} // {title}</div>
      <h2 className="font-mono text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h2>
      {description && <p className="mt-2 max-w-3xl font-sans text-xs leading-relaxed text-zinc-400 sm:text-sm">{description}</p>}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {isPreview && <Button asChild variant="outline" size="sm"><Link href={href}>View {preview?.destinationLabel ?? 'page'} <SquareArrowOutUpRight aria-hidden="true" /></Link></Button>}
        {publishedAt && <span className="inline-flex items-center gap-2 font-mono text-[11px] text-zinc-500"><CalendarDays className="size-3.5" aria-hidden="true" />
          <time dateTime={publishedAt}>{new Intl.DateTimeFormat('en-IN', {dateStyle:'medium',timeZone:'Asia/Kolkata'}).format(new Date(publishedAt))}</time></span>}
        {categories.map((category) => <span key={category} className="border border-zinc-800 px-2 py-1 font-mono text-[10px] tracking-wide text-zinc-400 uppercase">{category}</span>)}
      </div>
      {sections.length > 0 && <div className="mt-5 w-full space-y-2">
        <div className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">On This Page</div>
        <nav aria-label={title + ' page sections'} className="flex flex-nowrap gap-2 overflow-x-auto pb-1">
          {sections.map((section,index) => <Link key={section.id} href={section.href} className="border border-zinc-800 px-2.5 py-1.5 font-mono text-[10px] text-zinc-400 transition-colors hover:border-zinc-600 hover:text-white">
            <span className="mr-1.5 text-odl">{String(index+1).padStart(2,'0')}</span>{section.label}</Link>)}
        </nav>
      </div>}
    </div>
  </section>
}