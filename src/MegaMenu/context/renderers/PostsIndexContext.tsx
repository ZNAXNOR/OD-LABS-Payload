import Link from 'next/link'
import { ArrowUpRight, Newspaper } from 'lucide-react'
import type { PostsIndexContextData } from '../../types'

export const PostsIndexContext = ({ context }: { context: PostsIndexContextData }) => (
  <aside className="space-y-5">
    <div className="flex items-center gap-2 font-mono text-[11px] tracking-widest text-zinc-500 uppercase">
      <Newspaper className="size-3.5 text-odl" aria-hidden="true" />
      Latest Publications
    </div>
    <div>
      <h2 className="font-mono text-2xl font-bold tracking-tight text-white sm:text-3xl">{context.title}</h2>
      <p className="mt-3 font-sans text-xs leading-relaxed text-zinc-400">{context.description}</p>
    </div>
    <nav aria-label="Latest posts" className="space-y-2 border-t border-zinc-800 pt-4">
      {context.latestPosts.map((post) => (
        <Link key={post.href} href={post.href} className="group flex items-center justify-between gap-3 py-1 font-mono text-xs text-zinc-300 hover:text-white">
          <span className="line-clamp-1">{post.title}</span>
          <ArrowUpRight className="size-3.5 shrink-0 text-zinc-500 group-hover:text-odl" aria-hidden="true" />
        </Link>
      ))}
    </nav>
  </aside>
)
