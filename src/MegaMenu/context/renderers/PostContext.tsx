import Link from 'next/link'
import { ArrowUpRight, CalendarDays, Newspaper } from 'lucide-react'
import type { PostContextData } from '../../types'
import { ContextBreadcrumb } from '../ContextBreadcrumb'
import { ContextImage } from '../../PreviewTemplate/ContextImage'

export const PostContext = ({
  context,
  mode = 'current',
}: {
  context: PostContextData
  mode?: 'current' | 'panel'
}) => {
  if (mode === 'panel') {
    return (
      <aside className="space-y-4">
        <div className="flex items-center gap-2 font-mono text-[11px] tracking-widest text-text-muted uppercase">
          <Newspaper className="size-3.5 text-odl" aria-hidden="true" />
          Related Publications
        </div>
        {context.relatedPosts.length > 0 ? (
          <nav aria-label="Related posts" className="space-y-2">
            {context.relatedPosts.slice(0, 4).map((post) => (
              <Link key={post.href} href={post.href} className="group flex items-center justify-between gap-3 border-b border-border-default py-2 font-mono text-xs text-text-secondary transition-colors hover:text-text-primary">
                <span className="line-clamp-2">{post.title}</span>
                <ArrowUpRight className="size-3.5 shrink-0 text-text-muted group-hover:text-odl" aria-hidden="true" />
              </Link>
            ))}
          </nav>
        ) : (
          <p className="font-sans text-xs leading-relaxed text-text-muted">No related posts have been selected for this publication.</p>
        )}
      </aside>
    )
  }

  return (
    <aside className="space-y-5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1"><span className="font-mono text-[10px] tracking-[0.16em] text-odl uppercase">[CURRENT]</span><ContextBreadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Posts', href: '/posts' }, { label: context.title }]} /></div>
      <ContextImage image={context.seoImage} title={context.title} placeholder={false} />
      <div className="space-y-3">
        <h2 className="font-mono text-2xl font-bold tracking-tight text-white sm:text-3xl">{context.title}</h2>
        <p className="font-sans text-xs leading-relaxed text-text-secondary sm:text-sm">{context.description}</p>
      </div>
      {context.publishedAt && (
        <div className="flex items-center gap-2 font-mono text-xs text-text-muted">
          <CalendarDays className="size-3.5" aria-hidden="true" />
          <time dateTime={context.publishedAt}>{new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeZone: 'Asia/Kolkata' }).format(new Date(context.publishedAt))}</time>
        </div>
      )}
      {context.categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {context.categories.map((category) => (
            <span key={category} className="border border-border-default px-2 py-1 font-mono text-[10px] tracking-wide text-text-secondary uppercase">{category}</span>
          ))}
        </div>
      )}
    </aside>
  )
}
