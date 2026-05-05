import type { Page, ArchiveBlock as ArchiveBlockProps } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { Card } from '@/components/ui/card'
import { cn } from '@/utilities/ui'

export const ServicesGridArchiveBlock: React.FC<
  ArchiveBlockProps & {
    id?: string
  }
> = async (props) => {
  const { heading, subheading, populateByServices, selectedServices, limit: limitFromProps } = props

  const payload = await getPayload({ config: configPromise })

  let items: {
    title: string
    description?: string | null
    tag?: string | null
    highlight?: boolean | null
    style?: ('default' | 'dark') | null
    size?: ('standard' | 'wide') | null
    id?: string | null
  }[] = []

  if (populateByServices === 'selection' && selectedServices?.length) {
    items = selectedServices.map((item) => {
      const page = item.page as Page
      return {
        title: page.title,
        description: item.description,
        tag: item.tag,
        highlight: item.highlight,
        style: item.style,
        size: item.size,
        id: item.id,
      }
    })
  } else if (populateByServices === 'collection') {
    const limit = limitFromProps || 10
    const fetchedPages = await payload.find({
      collection: 'pages',
      where: {
        pageType: {
          equals: 'services',
        },
      },
      depth: 1,
      limit,
    })

    items = fetchedPages.docs.map((page: Page) => ({
      title: page.title,
      description: null,
      tag: null,
      highlight: false,
      style: 'default',
      size: 'standard',
      id: page.id.toString(),
    }))
  }

  return (
    <section className="max-w-7xl mx-auto px-8 py-24">
      {/* Header */}
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>
        {subheading && <p className="text-lg text-gray-600">{subheading}</p>}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items?.map((item, i) => {
          const isWide = item.size === 'wide'
          const isDark = item.style === 'dark'
          const isHighlighted = item.highlight

          return (
            <Card
              key={item.id || i}
              className={cn(
                'p-10 rounded-xl border-none shadow-none flex flex-col justify-between min-h-73',
                isWide && 'md:col-span-2',
                isDark ? 'bg-zinc-800 text-white' : 'bg-gray-50',
                !isDark && i === 1 && 'bg-gray-100',
              )}
            >
              <div className="space-y-4">
                <h3 className={cn('text-2xl font-bold', isDark ? 'text-white' : 'text-black')}>
                  {item.title}
                </h3>

                {item.description && (
                  <p
                    className={cn(
                      'text-lg',
                      isWide ? 'max-w-lg' : '',
                      isDark ? 'text-gray-300' : 'text-gray-500',
                    )}
                  >
                    {item.description}
                  </p>
                )}

                {item.tag && !isHighlighted && (
                  <p className="text-xs uppercase tracking-widest text-gray-400 mt-6">{item.tag}</p>
                )}
              </div>

              {isHighlighted && item.tag && (
                <div className=" bg-white px-6 py-3 rounded-xs border-l-4 border-teal-700">
                  <p className="text-teal-700 italic font-medium">"{item.tag}"</p>
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </section>
  )
}
