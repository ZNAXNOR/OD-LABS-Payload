import Link from 'next/link'
import { ArrowUpRight, Scale } from 'lucide-react'
import type { LegalContextData } from '../../types'
import { ContextBreadcrumb } from '../ContextBreadcrumb'
import { ContextImage } from '../../PreviewTemplate/ContextImage'

export const LegalContext = ({
  context,
  mode = 'current',
}: {
  context: LegalContextData
  mode?: 'current' | 'panel'
}) => (
  <aside className="space-y-5">
    {mode === 'current' && (
      <>
        <ContextBreadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Legal' }, { label: context.title }]} />
        <ContextImage image={context.seoImage} title={context.title} placeholder={false} />
      </>
    )}
    <div className="flex items-center gap-2 font-mono text-[11px] tracking-widest text-text-muted uppercase">
      <Scale className="size-3.5 text-odl" aria-hidden="true" />
      Legal Document
    </div>
    {mode === 'current' && (
      <>
        <h2 className="font-mono text-2xl font-bold tracking-tight text-white sm:text-3xl">{context.title}</h2>
        <p className="font-sans text-xs leading-relaxed text-text-secondary">{context.description}</p>
      </>
    )}
    {context.documentType && (
      <div className="font-mono text-xs text-text-muted">TYPE // <span className="text-text-secondary">{context.documentType.replaceAll('-', ' ')}</span></div>
    )}
    <div className="font-mono text-xs text-text-muted">
      UPDATED // <time dateTime={context.updatedAt}>{new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeZone: 'Asia/Kolkata' }).format(new Date(context.updatedAt))}</time>
    </div>
    <Link href={context.href} className="inline-flex items-center gap-2 font-mono text-xs text-text-secondary transition-colors hover:text-text-primary">
      Open document <ArrowUpRight className="size-3.5 text-odl" aria-hidden="true" />
    </Link>
  </aside>
)
