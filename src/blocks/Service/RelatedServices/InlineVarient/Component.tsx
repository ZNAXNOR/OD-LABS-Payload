import React from 'react'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import type { Page } from '@/payload-types'

type RelatedServicesProps = NonNullable<Page['relatedServices']>

export const InlineRelatedServices: React.FC<RelatedServicesProps> = ({
  title,
  subTitle,
  services,
}) => {
  if (!services || services.length === 0) return null

  return (
    <div className="my-16">
      <div className="mb-8">
        {title && <h2 className="text-xl font-semibold tracking-tight md:text-2xl">{title}</h2>}
        {subTitle && <p className="mt-2 text-muted-foreground">{subTitle}</p>}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {services.map((service, index) => {
          if (typeof service === 'number' || typeof service === 'string') return null
          const { icon, title: itemTitle, shortDescription } = service

          return (
            <div key={index} className="group">
              <CMSLink
                type="reference"
                reference={{
                  relationTo: 'pages',
                  value: service,
                }}
                className="block space-y-3 rounded-lg border p-6 transition-colors hover:bg-muted/50 no-underline"
              >
                <div className="flex items-center gap-2">
                  {icon && typeof icon !== 'string' && (
                    <Media
                      resource={icon}
                      className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors dark:invert"
                    />
                  )}
                  <div className="font-medium group-hover:text-primary transition-colors">
                    {itemTitle}
                  </div>
                </div>
                {shortDescription && (
                  <div className="text-sm leading-relaxed text-muted-foreground">
                    {shortDescription}
                  </div>
                )}
              </CMSLink>
            </div>
          )
        })}
      </div>
    </div>
  )
}
