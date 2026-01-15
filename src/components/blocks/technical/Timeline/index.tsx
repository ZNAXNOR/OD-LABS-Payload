import React from 'react'
import * as LucideIcons from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import type { Media } from '@/payload-types'

type TimelineItem = {
  date: string
  title: string
  description: string
  icon?: string
  image?: string | Media
  link?: {
    url?: string
    label?: string
  }
}

type TimelineBlockProps = {
  block: {
    blockType: 'timeline'
    heading?: string
    orientation: 'vertical' | 'horizontal'
    style: 'default' | 'minimal' | 'detailed'
    items: TimelineItem[]
  }
}

export function TimelineBlock({ block }: TimelineBlockProps) {
  const { heading, orientation, style, items } = block

  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName]
    return Icon ? <Icon className="h-5 w-5" /> : null
  }

  const getImageUrl = (image: string | Media | undefined) => {
    if (!image) return null
    if (typeof image === 'string') return image
    return image.url || null
  }

  if (orientation === 'horizontal') {
    return (
      <section className="py-16 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {heading && (
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 text-center mb-12">
                {heading}
              </h2>
            )}

            <div className="relative">
              {/* Horizontal line */}
              <div className="absolute top-8 left-0 right-0 h-0.5 bg-zinc-200 dark:bg-zinc-800" />

              <div className="flex overflow-x-auto pb-4 gap-8">
                {items.map((item, index) => (
                  <div key={index} className="flex-shrink-0 w-64 relative">
                    {/* Dot */}
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-brand-primary border-4 border-white dark:border-zinc-950 z-10" />

                    <div className="pt-16">
                      <div className="text-sm font-medium text-brand-primary mb-2">{item.date}</div>
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">{item.description}</p>
                      {item.link?.url && item.link?.label && (
                        <Link
                          href={item.link.url}
                          className="inline-block mt-2 text-sm text-brand-primary hover:underline"
                        >
                          {item.link.label} →
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Vertical timeline
  return (
    <section className="py-16 bg-white dark:bg-zinc-950">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {heading && (
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 text-center mb-12">
              {heading}
            </h2>
          )}

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-zinc-200 dark:bg-zinc-800" />

            <div className="space-y-8">
              {items.map((item, index) => {
                const imageUrl = getImageUrl(item.image)

                return (
                  <div key={index} className="relative pl-20">
                    {/* Icon/Dot */}
                    <div className="absolute left-5 top-0 w-6 h-6 rounded-full bg-brand-primary border-4 border-white dark:border-zinc-950 flex items-center justify-center text-white">
                      {item.icon ? (
                        getIcon(item.icon)
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>

                    <div
                      className={`${
                        style === 'default' || style === 'detailed'
                          ? 'p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'
                          : ''
                      }`}
                    >
                      <div className="text-sm font-medium text-brand-primary mb-2">{item.date}</div>
                      <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                        {item.title}
                      </h3>

                      {style === 'detailed' && imageUrl && (
                        <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                          <Image src={imageUrl} alt={item.title} fill className="object-cover" />
                        </div>
                      )}

                      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {item.description}
                      </p>

                      {item.link?.url && item.link?.label && (
                        <Link
                          href={item.link.url}
                          className="inline-block mt-4 text-sm font-medium text-brand-primary hover:text-brand-primary/80 transition-colors"
                        >
                          {item.link.label} →
                        </Link>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
