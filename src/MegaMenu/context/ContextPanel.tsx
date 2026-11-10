'use client'

import { CalendarDays } from 'lucide-react'
import type { CurrentPageInfo } from '../types'
import type { MegaMenuEntry } from '../registry'
import { ContextBreadcrumb } from './ContextBreadcrumb'
import { ContextImage } from '../PreviewTemplate/ContextImage'
import { MegaMenu_CurrentPage } from '../Sections/currentPage'
import { PagePreview } from '../PreviewTemplate/PagePreview'
import { PostPreview } from '../PreviewTemplate/PostPreview'
import { LegalPreview } from '../PreviewTemplate/LegalPreview'

interface ContextPanelProps {
  currentPage: CurrentPageInfo
  preview: MegaMenuEntry | null
}

const StateAndBreadcrumb = ({ state, items }: { state: 'CURRENT' | 'PREVIEW'; items: { label: string; href?: string }[] }) => (
  <div className="mb-3 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
    <span className="shrink-0 font-mono text-[10px] tracking-[0.16em] text-odl uppercase">[{state}]</span>
    <ContextBreadcrumb items={items} />
  </div>
)

export const MegaMenu_ContextPanel = ({ currentPage, preview }: ContextPanelProps) => {
  if (!preview && currentPage.type === 'error') return <div className="min-h-0"><MegaMenu_CurrentPage page={currentPage} /></div>

  if (preview) {
    const crumbs = preview.kind === 'post'
      ? [{ label: 'Home', href: '/' }, { label: 'Posts', href: '/posts' }, { label: preview.title }]
      : preview.kind === 'legal'
        ? [{ label: 'Home', href: '/' }, { label: 'Legal' }, { label: preview.title }]
        : preview.href === '/' ? [{ label: 'Home' }] : [{ label: 'Home', href: '/' }, { label: preview.title }]

    return (
      <section className="grid min-h-0 min-w-0 grid-cols-1 gap-2 overflow-hidden border-b border-zinc-800/80 pb-4 lg:pb-5">
        <StateAndBreadcrumb state="PREVIEW" items={crumbs} />
        {preview.kind === 'page' && <PagePreview entry={preview} />}
        {preview.kind === 'post' && <PostPreview entry={preview} />}
        {preview.kind === 'legal' && <LegalPreview entry={preview} />}
      </section>
    )
  }

  const title = currentPage.title
  const image = currentPage.type === 'page' || currentPage.type === 'post' || currentPage.type === 'legal' ? currentPage.seoImage : null
  const crumbs = currentPage.type === 'post'
    ? [{ label: 'Home', href: '/' }, { label: 'Posts', href: '/posts' }, { label: title }]
    : currentPage.type === 'legal'
      ? [{ label: 'Home', href: '/' }, { label: 'Legal' }, { label: title }]
      : currentPage.href === '/' ? [{ label: 'Home' }] : [{ label: 'Home', href: '/' }, { label: title }]
  const sections = currentPage.type === 'page' ? currentPage.sections : []
  const publishedAt = currentPage.type === 'post' ? currentPage.publishedAt : null
  const updatedAt = currentPage.type === 'legal' ? currentPage.updatedAt : null
  const categories = currentPage.type === 'post' ? currentPage.categories : []

  return (
    <section className="grid min-h-0 min-w-0 grid-cols-1 gap-2 overflow-hidden border-b border-zinc-800/80 pb-4 lg:pb-5">
      <StateAndBreadcrumb state="CURRENT" items={crumbs} />
      <div className={['grid min-h-0 min-w-0 grid-cols-1 gap-4 sm:gap-6', image?.url ? 'sm:grid-cols-[minmax(180px,0.8fr)_minmax(0,1.7fr)]' : ''].join(' ')}>
        {image?.url && <div className="min-w-0 select-none"><ContextImage image={image} title={title} compact placeholder={false} /></div>}
        <div className="flex min-w-0 flex-col items-start">
          <h2 className="line-clamp-3 font-mono text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h2>
          {currentPage.description && <p className="mt-2 line-clamp-2 max-w-3xl font-sans text-xs leading-relaxed text-zinc-400 sm:text-sm">{currentPage.description}</p>}
          {(publishedAt || updatedAt || categories.length || (currentPage.type === 'legal' && currentPage.documentType)) && (
            <div className="mt-3 flex flex-wrap items-center gap-3">
              {(publishedAt || updatedAt) && <span className="inline-flex items-center gap-2 font-mono text-[11px] text-zinc-500"><CalendarDays className="size-3.5" aria-hidden="true" /><time dateTime={publishedAt ?? updatedAt ?? undefined}>{new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeZone: 'Asia/Kolkata' }).format(new Date(publishedAt ?? updatedAt ?? ''))}</time></span>}
              {currentPage.type === 'legal' && currentPage.documentType && <span className="border border-zinc-800 px-2 py-1 font-mono text-[10px] tracking-wide text-zinc-400 uppercase">{currentPage.documentType.replaceAll('-', ' ')}</span>}
              {categories.map((category) => <span key={category} className="border border-zinc-800 px-2 py-1 font-mono text-[10px] tracking-wide text-zinc-400 uppercase">{category}</span>)}
            </div>
          )}
          {sections.length > 0 && <nav aria-label={title + ' page sections'} className="mt-3 flex max-w-full flex-nowrap gap-2 overflow-x-auto pb-1">{sections.map((section, index) => <span key={section.id} className="shrink-0 border border-zinc-800 px-2.5 py-1.5 font-mono text-[10px] text-zinc-400"><span className="mr-1.5 text-odl">{String(index + 1).padStart(2, '0')}</span>{section.label}</span>)}</nav>}
        </div>
      </div>
    </section>
  )
}
