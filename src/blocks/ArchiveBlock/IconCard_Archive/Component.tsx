import React from 'react'
import {
  Code,
  Cog,
  PenTool,
  Shrub,
  Zap,
  Cloud,
  Database,
  Monitor,
  Smartphone,
  Globe,
  Search,
  Mail,
  Layout,
} from 'lucide-react'
import type { Post, Page, ArchiveBlock as ArchiveBlockProps } from '@/payload-types'
import { cn } from '@/utilities/ui'
import RichText from '@/components/RichText'
import Link from 'next/link'

const icons = {
  cog: Cog,
  code: Code,
  penTool: PenTool,
  shrub: Shrub,
  zap: Zap,
  cloud: Cloud,
  database: Database,
  monitor: Monitor,
  smartphone: Smartphone,
  globe: Globe,
  search: Search,
  mail: Mail,
  layout: Layout,
}

export const IconCardArchive: React.FC<
  ArchiveBlockProps & {
    posts?: (Post | Page)[]
    relationTo?: 'posts' | 'pages'
  }
> = ({ posts, introContent, relationTo = 'posts' }) => {
  return (
    <section className={cn('py-32')}>
      <div className="container">
        <div className="mx-auto max-w-6xl space-y-12">
          {introContent && (
            <div className="space-y-4 text-center">
              <RichText
                className="ms-0 mx-auto max-w-2xl"
                data={introContent}
                enableGutter={false}
              />
            </div>
          )}

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {posts?.map((post, index) => {
              const { title, meta, slug } = post
              const iconKey = meta?.icon as keyof typeof icons
              const Icon = icons[iconKey] || Cog
              const href = `/${relationTo}/${slug}`

              return (
                <Link
                  key={index}
                  href={href}
                  className="space-y-6 rounded-lg border border-border p-8 transition-all hover:shadow-md hover:border-primary/20 block group"
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-muted p-3 group-hover:bg-primary/10 transition-colors">
                      <Icon className="h-6 w-6 group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {title}
                    </h3>
                  </div>
                  {meta?.description && (
                    <p className="leading-relaxed text-muted-foreground">{meta.description}</p>
                  )}
                  {'categories' in post &&
                    post.categories &&
                    Array.isArray(post.categories) &&
                    post.categories.length > 0 && (
                      <div className="space-y-2">
                        {post.categories.map((category, catIndex) => {
                          if (typeof category === 'object') {
                            return (
                              <div key={catIndex} className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-foreground" />
                                <span className="text-sm font-medium">{category.title}</span>
                              </div>
                            )
                          }
                          return null
                        })}
                      </div>
                    )}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
