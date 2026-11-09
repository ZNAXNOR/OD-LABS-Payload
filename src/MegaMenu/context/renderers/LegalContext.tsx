import Link from 'next/link'
import { ArrowUpRight, Scale } from 'lucide-react'
import type { LegalContextData } from '../../types'
import { ContextImage } from '../ContextImage'

export const LegalContext = ({
  context,
  mode = 'current',
}: {
  context: LegalContextData
  mode?: 'current' | 'panel'
}) => (
  <aside className="space-y-5">
    {mode === 'current' && <ContextImage image={context.seoImage} title={context.title} />}
    <div className="flex items-center gap-2 font-mono text-[11px] tracking-widest text-zinc-500 uppercase">
      <Scale className="size-3.5 text-odl" aria-hidden="true" />
      Legal Document
    </div>
    {mode === 'current' && (
      <>
        <h2 className="font-mono text-2xl font-bold tracking-tight text-white sm:text-3xl">{context.title}</h2>
        <p className="font-sans text-xs leading-relaxed text-zinc-400">{context.description}</p>
      </>
    )}
    {context.documentType && (
      <div className="font-mono text-xs text-zinc-500">
        TYPE // <span className="text-zinc-300">{context.documentType.replaceAll('-', ' ')}</span>
      </div>
    )}
    <div className="font-mono text-xs text-zinc-500">
      UPDATED // <time dateTime={context.updatedAt}>{new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(context.updatedAt))}</time>
    </div>
    <Link href={context.href} className="inline-flex items-center gap-2 font-mono text-xs text-zinc-300 transition-colors hover:text-white">
      Open document <ArrowUpRight className="size-3.5 text-odl" aria-hidden="true" />
    </Link>
  </aside>
)
