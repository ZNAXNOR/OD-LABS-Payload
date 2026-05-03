import React from 'react'
import type { Page } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'
import { RightPanel } from './RightPanel'

export const SidePanelHero: React.FC<Page['hero']> = ({ links, media, richText, activeWork, availability }) => {
  return (
    <section className="max-w-7xl mx-auto px-8 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
      {/* LEFT */}
      <div className="lg:col-span-7">
        {richText && (
          <RichText
            className="payload-richtext-hero prose-h1:text-5xl md:prose-h1:text-7xl prose-h1:font-extrabold prose-h1:tracking-tight prose-h1:leading-[1.1] prose-h1:mb-8 prose-p:text-xl prose-p:text-gray-600 prose-p:max-w-2xl prose-p:mb-10"
            data={richText}
            enableGutter={false}
            enableProse={true}
          />
        )}

        {/* CTA */}
        {Array.isArray(links) && links.length > 0 && (
          <div className="flex flex-wrap gap-4 mb-6">
            {links.map(({ link }, i) => (
              <CMSLink key={i} size="lg" {...link} />
            ))}
          </div>
        )}

        {/* Availability Indicator (Text) */}
        {(availability?.projectLimit || availability?.status) && (
          <div className="flex flex-col gap-1">
            {availability.projectLimit && (
              <div className="flex items-center gap-2">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 bg-red-500"></span>
                  <span className="relative inline-flex size-2 rounded-full bg-red-500"></span>
                </span>
                <span className="text-sm font-bold text-red-600 uppercase">
                  Limited to {availability.projectLimit} active projects
                </span>
              </div>
            )}
            {availability.status && (
              <div className="flex items-center gap-2">
                <div className="size-2" aria-hidden="true" />
                <p className="text-xs text-gray-400 uppercase tracking-wider">
                  Next availability:{' '}
                  {availability.status === 'now'
                    ? 'Now'
                    : availability.availableDate
                      ? new Date(availability.availableDate).toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric',
                        })
                      : 'Later'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* RIGHT PANEL */}
      {activeWork && availability && (
        <RightPanel activeWork={activeWork} availability={availability} media={media} />
      )}
    </section>
  )
}
