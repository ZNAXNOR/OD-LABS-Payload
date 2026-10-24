'use client'

import React, { useState } from 'react'
import type {
  ContentBlock as ContentBlockProps,
  Media as MediaProps,
} from '@/payload-types'
import { ArrowLeft, ArrowRight } from 'lucide-react'

import { Header, Eyebrow } from '@/blocks/Content/Varients/Header'
import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

type TestimonialEntry = NonNullable<ContentBlockProps['columns']>[number] & {
  clientName?: string | null
  clientPosition?: string | null
  clientCompany?: string | null
  clientMedia?: number | MediaProps | null
}

type Props = ContentBlockProps & {
  blockIndex?: number
}

function getMedia(value: TestimonialEntry['clientMedia']): MediaProps | null {
  return value && typeof value === 'object' ? value : null
}

export const Testimonial_ContentBlock: React.FC<Props> = ({
  eyebrow,
  richText,
  linkGroup,
  columns,
  blockIndex = 0,
}) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const items = (columns ?? []) as TestimonialEntry[]
  const hasMultiple = items.length > 1

  if (!items.length) {
    return (
      <section className="border-b border-zinc-800 px-6 py-10 lg:px-12 lg:py-14">
        <Eyebrow eyebrow={eyebrow} blockIndex={blockIndex} />
        <Header richText={richText} linkGroup={linkGroup} />
      </section>
    )
  }

  const active = items[Math.min(activeIndex, items.length - 1)]
  const photo = getMedia(active.clientMedia)

  const move = (direction: -1 | 1) => {
    setActiveIndex(
      (current) => (current + direction + items.length) % items.length,
    )
  }

  return (
    <section className="border-b border-zinc-800 px-6 py-10 lg:px-12 lg:py-14">
      <Eyebrow eyebrow={eyebrow} blockIndex={blockIndex} />

      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-16">
        <Header
          richText={richText}
          linkGroup={linkGroup}
          className="lg:col-span-6"
        />

        <div
          className="min-w-0 lg:col-span-6"
          aria-live={hasMultiple ? 'polite' : undefined}
        >
          <div
            className="text-odl -my-8 -ml-3 font-mono text-8xl leading-none"
            aria-hidden="true"
          >
            “
          </div>

          {active.richText && (
            <div className="text-muted-foreground text-xl font-medium sm:text-2xl lg:text-3xl">
              <RichText
                data={active.richText}
                enableGutter={false}
                enableProse={false}
              />
            </div>
          )}

          <div className="mt-8 flex items-center gap-4 pt-6">
            {photo ? (
              <div className="relative size-14 shrink-0 overflow-hidden rounded-full border border-zinc-700">
                <Media
                  resource={photo}
                  fill
                  imgClassName="object-cover"
                  pictureClassName="absolute inset-0"
                  size="56px"
                />
              </div>
            ) : null}

            <div className="min-w-0">
              {active.clientName ? (
                <p className="font-mono text-lg font-semibold tracking-wide text-zinc-100 uppercase">
                  {active.clientName}
                </p>
              ) : null}
              {(active.clientPosition || active.clientCompany) && (
                <p className="text-md mt-1 text-zinc-400">
                  {[active.clientPosition, active.clientCompany]
                    .filter(Boolean)
                    .join(' at ')}
                </p>
              )}
            </div>
          </div>

          {hasMultiple && (
            <div className="mt-8 flex items-center justify-between gap-4">
              <p className="font-mono text-xs tracking-widest text-zinc-500">
                {String(activeIndex + 1).padStart(2, '0')} /{' '}
                {String(items.length).padStart(2, '0')}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => move(-1)}
                  aria-label="Previous testimonial"
                  className={cn(
                    'hover:border-odl hover:text-odl inline-flex size-11 items-center justify-center border border-zinc-700 text-zinc-200 transition-colors',
                    'focus-visible:outline-odl focus-visible:outline-2 focus-visible:outline-offset-2',
                  )}
                >
                  <ArrowLeft className="size-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => move(1)}
                  aria-label="Next testimonial"
                  className={cn(
                    'hover:border-odl hover:text-odl inline-flex size-11 items-center justify-center border border-zinc-700 text-zinc-200 transition-colors',
                    'focus-visible:outline-odl focus-visible:outline-2 focus-visible:outline-offset-2',
                  )}
                >
                  <ArrowRight className="size-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
