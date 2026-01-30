// Define local type since ContentBlock is not in payload-types
interface ContentBlockProps {
  id?: string | null
  blockName?: string | null
  blockType: 'content'
  columns?: any[]
  gap?: 'small' | 'medium' | 'large'
  alignment?: 'top' | 'center' | 'bottom'
  // Add other content-specific properties as needed
}
import RichText from '@/components/ui/RichText'
import { cn } from '@/utilities/ui'
import React from 'react'

export interface ContentComponentProps extends ContentBlockProps {
  className?: string
}

export const ContentComponent: React.FC<ContentComponentProps> = ({
  columns,
  gap = 'medium',
  alignment = 'top',
  className,
}) => {
  if (!columns || columns.length === 0) return null

  return (
    <section className={cn('content-block', className)}>
      <div className="container mx-auto px-4">
        <div
          className={cn('grid', {
            'gap-4': gap === 'small',
            'gap-8': gap === 'medium',
            'gap-12': gap === 'large',
            'items-start': alignment === 'top',
            'items-center': alignment === 'center',
            'items-end': alignment === 'bottom',
          })}
          style={{
            gridTemplateColumns: columns
              .map((column: any) => {
                switch (column.width) {
                  case 'oneThird':
                    return '1fr'
                  case 'half':
                    return '1fr'
                  case 'twoThirds':
                    return '2fr'
                  case 'full':
                    return '1fr'
                  case 'auto':
                    return 'auto'
                  default:
                    return '1fr'
                }
              })
              .join(' '),
          }}
        >
          {columns.map((column: any, index: any) => {
            const ColumnWrapper = column.enableLink && column.link ? 'a' : 'div'
            const linkProps =
              column.enableLink && column.link
                ? {
                    href: column.link.type === 'custom' ? column.link.url || '#' : '#',
                    target: column.link.newTab ? '_blank' : undefined,
                    rel: column.link.newTab ? 'noopener noreferrer' : undefined,
                  }
                : {}

            return (
              <ColumnWrapper
                key={index}
                className={cn('content-column', {
                  'bg-white': column.backgroundColor === 'white',
                  'bg-zinc-50': column.backgroundColor === 'zinc-50',
                  'bg-zinc-100': column.backgroundColor === 'zinc-100',
                  'bg-primary': column.backgroundColor === 'brand-primary',
                  'p-0': column.padding === 'none',
                  'p-4': column.padding === 'small',
                  'p-6': column.padding === 'medium',
                  'p-8': column.padding === 'large',
                  'cursor-pointer hover:opacity-80 transition-opacity':
                    column.enableLink && column.link,
                })}
                {...linkProps}
              >
                <RichText data={column.content} enableGutter={false} />
              </ColumnWrapper>
            )
          })}
        </div>
      </div>
    </section>
  )
}
