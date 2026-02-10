import type { ContentBlock as ContentBlockProps } from '@/payload-types'
import { Timer, Zap, ZoomIn, type LucideIcon } from 'lucide-react'
import React from 'react'
import { cn } from '@/utilities/ui'

import RichText from '@/components/RichText'
import { colsSpanClasses } from '../index'

const icons: Record<string, LucideIcon> = {
  timer: Timer,
  zap: Zap,
  zoomIn: ZoomIn,
}

export const IconCardBlock: React.FC<ContentBlockProps> = (props) => {
  const { columns, intro, title } = props

  return (
    <section className="py-24 lg:py-32">
      <div className="container">
        {intro && <p className="mb-4 text-sm text-muted-foreground lg:text-base">{intro}</p>}
        {title && <h2 className="mb-14 text-3xl font-medium lg:text-4xl">{title}</h2>}
        <div className="grid grid-cols-4 lg:grid-cols-12 gap-y-8 gap-x-8">
          {columns?.map((col, index) => {
            const { icon, richText, size } = col
            const Icon = icon && icons[icon] ? icons[icon] : null

            return (
              <div
                className={cn(
                  `col-span-4 lg:col-span-${colsSpanClasses[size!]}`,
                  {
                    'md:col-span-2': size !== 'full',
                  },
                  'rounded-lg bg-accent p-5',
                )}
                key={index}
              >
                {Icon && (
                  <span className="mb-8 flex size-12 items-center justify-center rounded-full bg-background">
                    <Icon className="size-6" />
                  </span>
                )}
                {richText && <RichText data={richText} enableGutter={false} />}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
