import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { PageContextData } from '../../types'
import { ContextBreadcrumb } from '../ContextBreadcrumb'
import { ContextImage } from '../ContextImage'

interface PageContextProps {
  context: PageContextData
  mode: 'current' | 'preview'
}

export const PageContext = ({ context, mode }: PageContextProps) => (
  <aside className="space-y-6">
    <ContextBreadcrumb items={context.href === '/' ? [{ label: 'Home' }] : [{ label: 'Home', href: '/' }, { label: context.title }]} />
    <ContextImage image={context.seoImage} title={context.title} />

    <section className="space-y-3">
      <div className="font-mono text-[11px] tracking-widest text-odl uppercase">
        {mode === 'current' ? 'Current Page' : 'Page Preview'} // {context.title}
      </div>
      <h2 className="font-mono text-2xl font-bold tracking-tight text-white sm:text-3xl">{context.title}</h2>
      {context.description && (
        <p className="max-w-2xl font-sans text-xs leading-relaxed text-zinc-400 sm:text-sm">{context.description}</p>
      )}
    </section>

    {mode === 'preview' && context.sections.length > 0 && (
      <section className="space-y-3">
        <div className="border-b border-zinc-700/60 pb-2 font-mono text-[11px] tracking-widest text-zinc-500 uppercase">On This Page</div>
        <nav aria-label={`${context.title} page sections`} className="space-y-1.5">
          {context.sections.map((section, index) => (
            <Link
              key={section.id}
              href={section.href}
              className="group flex min-h-9 items-center justify-between gap-3 border border-zinc-800 bg-zinc-900/50 px-3 py-2 font-mono text-xs text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-odl"
            >
              <span className="flex min-w-0 items-center gap-2">
                <span className="shrink-0 text-odl">{String(index + 1).padStart(2, '0')}</span>
                <span className="truncate">{section.label}</span>
              </span>
              <ArrowUpRight className="size-3.5 shrink-0 text-zinc-500 transition-colors group-hover:text-odl" aria-hidden="true" />
            </Link>
          ))}
        </nav>
      </section>
    )}

    {mode === 'preview' && (
      <Button asChild variant="outline" className="w-full sm:w-auto">
        <Link href={context.href}>View page <ArrowUpRight aria-hidden="true" /></Link>
      </Button>
    )}
  </aside>
)
