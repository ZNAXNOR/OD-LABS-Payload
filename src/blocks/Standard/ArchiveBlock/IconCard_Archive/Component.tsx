import type { Post, Page, ArchiveBlock as ArchiveBlockProps } from '@/payload-types'
import React from 'react'
import Link from 'next/link'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import {
  Cog,
  Code,
  PenTool,
  Trees as Shrub,
  Zap,
  Cloud,
  Database,
  Monitor,
  Smartphone,
  Globe,
  Search,
  Mail,
  Layout,
  ArrowRight,
} from 'lucide-react'

const iconMap = {
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
> = (props) => {
  const { posts, introContent, relationTo = 'posts' } = props

  return (
    <section className="py-24 lg:py-32">
      <div className="container">
        {introContent && (
          <div className="mb-14">
            <RichText data={introContent} enableGutter={false} />
          </div>
        )}
        <div className="grid grid-cols-4 lg:grid-cols-12 gap-y-8 gap-x-8">
          {posts?.map((post, index) => {
            const title = post.title
            const href = `/${relationTo}/${post.slug}`

            // Determine description
            let description = ''
            if ('shortDescription' in post && post.shortDescription) {
              description = post.shortDescription
            } else if (post.meta?.description) {
              description = post.meta.description
            }

            // Determine icon to use:
            // Manual icon field (Media)
            let IconComponent: any = null
            let iconMedia: any = null

            if ('icon' in post && post.icon) {
              iconMedia = post.icon
            } else if (
              post.meta &&
              'icon' in post.meta &&
              post.meta.icon &&
              post.meta.icon !== 'none'
            ) {
              IconComponent = iconMap[post.meta.icon as keyof typeof iconMap]
            }

            return (
              <Link
                href={href}
                key={index}
                className="col-span-4 lg:col-span-4 group flex flex-col h-full rounded-2xl bg-accent/50 p-8 transition-all hover:bg-accent border border-transparent hover:border-primary/20"
              >
                <div className="mb-8 flex size-14 items-center justify-center rounded-2xl bg-background shadow-sm overflow-hidden transition-transform group-hover:scale-110">
                  {iconMedia ? (
                    <Media
                      resource={iconMedia}
                      className="size-7 text-muted-foreground group-hover:text-primary transition-colors dark:invert"
                    />
                  ) : IconComponent ? (
                    <IconComponent className="size-7 text-muted-foreground group-hover:text-primary transition-colors" />
                  ) : (
                    <Layout className="size-7 text-muted-foreground group-hover:text-primary transition-colors" />
                  )}
                </div>

                <h3 className="mb-3 text-xl font-semibold lg:text-2xl transition-colors group-hover:text-primary">
                  {title}
                </h3>

                {description && (
                  <p className="mb-6 text-muted-foreground line-clamp-3 grow">{description}</p>
                )}
                <div className="flex items-center text-sm font-medium text-primary mt-auto">
                  Learn more{' '}
                  <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
