import Link from 'next/link'
import { ArrowUpRight, CalendarDays, Newspaper } from 'lucide-react'
import type { PostContextData } from '../../types'
import { ContextBreadcrumb } from '../ContextBreadcrumb'
import { ContextImage } from '../ContextImage'

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
        <div className="flex items-center gap-2 font-mono text-[11px] tracking-widest text-zinc-500 uppercase">
          <Newspaper className="size-3.5 text-odl" aria-hidden="true" />
          Related Publications
        </div>
        {context.relatedPosts.length > 0 ? (
          <nav aria-label="Related posts" className="space-y-2">
            {context.relatedPosts.slice(0, 4).map((post) => (
              <Link key={post.href} href={post.href} className="group flex items-center justify-between gap-3 border-b border-zinc-800 py-2 font-mono text-xs text-zinc-300 transition-colors hover:text-white">
                <span className="line-clamp-2">{post.title}</span>
                <ArrowUpRight className="size-3.5 shrink-0 text-zinc-500 group-hover:text-odl" aria-hidden="true" />
              </Link>
            ))}
          </nav>
        ) : (
          <p className="font-sans text-xs leading-relaxed text-zinc-500">No related posts have been selected for this publication.</p>
        )}
      </aside>
    )
  }

  return (
    <aside className="space-y-5">
      <ContextBreadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Posts', href: '/posts' }, { label: context.title }]} />
      <ContextImage image={context.seoImage} title={context.title} />
      <div className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-[11px] tracking-widest text-odl uppercase">
          <Newspaper className="size-3.5" aria-hidden="true" />
          Current Post
        </div>
        <h2 className="font-mono text-2xl font-bold tracking-tight text-white sm:text-3xl">{context.title}</h2>
        <p className="font-sans text-xs leading-relaxed text-zinc-400 sm:text-sm">{context.description}</p>
      </div>
      {context.publishedAt && (
        <div className="flex items-center gap-2 font-mono text-xs text-zinc-500">
          <CalendarDays className="size-3.5" aria-hidden="true" />
          <time dateTime={context.publishedAt}>{new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(context.publishedAt))}</time>
        </div>
      )}
      {context.categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {context.categories.map((category) => (
            <span key={category} className="border border-zinc-800 px-2 py-1 font-mono text-[10px] tracking-wide text-zinc-400 uppercase">{category}</span>
          ))}
        </div>
      )}
    </aside>
  )
}
