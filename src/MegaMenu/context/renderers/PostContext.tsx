import Link from 'next/link'
import { ArrowUpRight, CalendarDays, Newspaper } from 'lucide-react'
import type { PostContextData } from '../../types'
import { ContextImage } from '../ContextImage'

export const PostContext = ({ context }: { context: PostContextData }) => (
  <aside className="space-y-5">
    <ContextImage image={context.seoImage} title={context.title} />
    <div className="space-y-3">
      <div className="flex items-center gap-2 font-mono text-[11px] tracking-widest text-odl uppercase">
        <Newspaper className="size-3.5" aria-hidden="true" />
        Current Post
      </div>
      <h2 className="font-mono text-2xl font-bold tracking-tight text-white sm:text-3xl">
        {context.title}
      </h2>
      <p className="font-sans text-xs leading-relaxed text-zinc-400 sm:text-sm">
        {context.description}
      </p>
    </div>

    {context.publishedAt && (
      <div className="flex items-center gap-2 font-mono text-xs text-zinc-500">
        <CalendarDays className="size-3.5" aria-hidden="true" />
        <time dateTime={context.publishedAt}>
          {new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(context.publishedAt))}
        </time>
      </div>
    )}

    {context.categories.length > 0 && (
      <div className="flex flex-wrap gap-2">
        {context.categories.map((category) => (
          <span key={category} className="border border-zinc-800 px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-zinc-400">
            {category}
          </span>
        ))}
      </div>
    )}

    {context.relatedPosts.length > 0 && (
      <section className="space-y-2 border-t border-zinc-800 pt-4">
        <div className="font-mono text-[11px] tracking-widest text-zinc-500 uppercase">Related Posts</div>
        {context.relatedPosts.slice(0, 3).map((post) => (
          <Link key={post.href} href={post.href} className="group flex items-center justify-between gap-3 py-1 font-mono text-xs text-zinc-300 hover:text-white">
            <span className="line-clamp-1">{post.title}</span>
            <ArrowUpRight className="size-3.5 shrink-0 text-zinc-500 group-hover:text-odl" aria-hidden="true" />
          </Link>
        ))}
      </section>
    )}
  </aside>
)
