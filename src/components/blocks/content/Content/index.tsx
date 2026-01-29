import RichText from '@/components/ui/RichText'
import type { ContentBlock as ContentBlockType } from '@/payload-types'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'

interface ContentBlockProps {
  block: ContentBlockType
  className?: string
}

export const ContentBlock: React.FC<ContentBlockProps> = ({ block, className }) => {
  const { columns, gap = 'medium', alignment = 'top' } = block

  // Early return if no columns
  if (!columns || columns.length === 0) {
    return null
  }

  const gapClasses = {
    none: 'gap-0',
    small: 'gap-4',
    medium: 'gap-8',
    large: 'gap-12',
  }

  const alignmentClasses = {
    top: 'items-start',
    center: 'items-center',
    bottom: 'items-end',
  }

  const widthClasses = {
    oneThird: 'md:w-1/3',
    half: 'md:w-1/2',
    twoThirds: 'md:w-2/3',
    full: 'w-full',
    auto: 'md:w-auto md:flex-1',
  }

  const backgroundClasses = {
    none: '',
    white: 'bg-white dark:bg-zinc-900',
    'zinc-50': 'bg-zinc-50 dark:bg-zinc-800',
    'zinc-100': 'bg-zinc-100 dark:bg-zinc-800',
    'brand-primary': 'bg-brand-primary text-white',
  }

  const paddingClasses = {
    none: '',
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8',
  }

  const getLinkHref = (linkData: any) => {
    if (!linkData) return '#'
    if (linkData.type === 'custom' && linkData.url) return linkData.url
    if (linkData.type === 'reference' && linkData.reference) {
      const ref = linkData.reference
      if (typeof ref === 'object' && ref.value && typeof ref.value === 'object' && ref.value.slug) {
        return `/${ref.value.slug}`
      }
    }
    return '#'
  }

  return (
    <section className={cn('py-16 px-4', className)}>
      <div className="container mx-auto max-w-7xl">
        <div
          className={cn(
            'flex flex-col md:flex-row w-full',
            gapClasses[gap as keyof typeof gapClasses],
            alignmentClasses[alignment as keyof typeof alignmentClasses],
          )}
        >
          {columns.map((column, index) => {
            // Safe access to column properties with fallbacks
            const columnWidth = column?.width || 'full'
            const columnBackgroundColor = column?.backgroundColor || 'none'
            const columnPadding = column?.padding || 'none'

            const hasLink =
              column?.enableLink && column?.link && (column.link.url || column.link.reference)

            const columnClasses = cn(
              'w-full',
              widthClasses[columnWidth as keyof typeof widthClasses],
              backgroundClasses[columnBackgroundColor as keyof typeof backgroundClasses],
              paddingClasses[columnPadding as keyof typeof paddingClasses],
              columnBackgroundColor !== 'none' && 'rounded-lg',
            )

            const columnContent = (
              <div className="prose prose-zinc dark:prose-invert max-w-none">
                {column?.content && (
                  <RichText data={column.content as any} enableGutter={false} enableProse={false} />
                )}
              </div>
            )

            return hasLink ? (
              <Link
                key={index}
                href={getLinkHref(column.link)}
                target={column.link?.newTab ? '_blank' : undefined}
                rel={column.link?.newTab ? 'noopener noreferrer' : undefined}
                className={cn(columnClasses, 'hover:opacity-90 transition-opacity')}
              >
                {columnContent}
              </Link>
            ) : (
              <div key={index} className={columnClasses}>
                {columnContent}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ContentBlock
