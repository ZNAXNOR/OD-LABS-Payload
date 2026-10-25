import React from 'react'
import Link from 'next/link'
import type { CallToActionBlock as CTABlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/utilities/ui'

export const CallToActionBlock: React.FC<CTABlockProps> = ({
  eyebrow,
  heading,
  description,
  primaryLink,
  secondaryLinks,
}) => {
  const primaryHref = primaryLink?.url?.trim()
  const primaryLabel = primaryLink?.label?.trim() || 'START A PROJECT →'
  const safeHeading = heading
  const safeDescription = description

  return (
    <section
      id="contact"
      data-purpose="conversational-cta"
      className="relative w-full border-b border-[#262D3D] px-6 py-20 lg:px-12 lg:py-28"
    >
      <div className="mb-8 font-mono text-xs tracking-wider text-[#687182] uppercase">
        <span className="text-[#FF3B30]">04 — </span>
        {eyebrow || 'START A PROJECT'}
      </div>

      <div className="relative border border-[#232a3b] p-8 sm:p-14 lg:p-16">
        <span aria-hidden="true" className="pointer-events-none absolute left-0 top-0 h-3 w-3 border-l border-t border-[#687182]" />
        <span aria-hidden="true" className="pointer-events-none absolute right-0 top-0 h-3 w-3 border-r border-t border-[#687182]" />
        <span aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 h-3 w-3 border-b border-l border-[#687182]" />
        <span aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 h-3 w-3 border-b border-r border-[#687182]" />

        <div className="max-w-3xl space-y-4">
          {safeHeading && (
            <RichText
              data={safeHeading}
              enableGutter={false}
              enableProse={false}
              className={cn(
                'text-[#F4F4F0] [&_h2]:m-0 [&_h2]:text-3xl [&_h2]:font-normal [&_h2]:leading-[1.1] [&_h2]:tracking-tight',
                'sm:[&_h2]:text-5xl lg:[&_h2]:text-6xl [&_h3]:m-0 [&_h3]:text-3xl [&_h3]:font-normal [&_h3]:leading-[1.1] [&_h3]:tracking-tight sm:[&_h3]:text-5xl lg:[&_h3]:text-6xl',
                '[&_p]:m-0 [&_p]:text-3xl [&_p]:font-normal [&_p]:leading-[1.1] [&_p]:tracking-tight sm:[&_p]:text-5xl lg:[&_p]:text-6xl',
              )}
            />
          )}

          {safeDescription && (
            <RichText
              data={safeDescription}
              enableGutter={false}
              enableProse={false}
              className="pt-1 font-sans text-base leading-relaxed text-[#A6ABB8] sm:text-lg [&_p]:m-0 [&_p]:leading-relaxed"
            />
          )}
        </div>

        <div className="flex flex-col gap-8 pt-8 sm:flex-row sm:items-center">
          {primaryHref && (
            <Link
              href={primaryHref}
              target={primaryLink?.newTab ? '_blank' : undefined}
              rel={primaryLink?.newTab ? 'noopener noreferrer' : undefined}
              className="inline-flex shrink-0 items-center gap-3 bg-[#FF3B30] px-8 py-4 font-mono text-xs font-semibold tracking-wider text-white uppercase transition-colors hover:bg-[#E62E24] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF3B30]"
            >
              <span>[ {primaryLabel.replace(/^\[\s*|\s*\]$/g, '')} ]</span>
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          )}

          {secondaryLinks?.length ? (
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4 text-xs font-mono text-[#687182]">
              {secondaryLinks.map((entry, index) => (
                <CMSLink
                  key={entry.id ?? index}
                  {...entry.link}
                  appearance="underline"
                  className="text-[#A6ABB8] decoration-[#232a3b] hover:text-[#F4F4F0] hover:decoration-[#A6ABB8]"
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
