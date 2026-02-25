import React from 'react'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import type { Page } from '@/payload-types'

type RelatedServicesProps = NonNullable<Page['relatedServices']>

export const SideRelatedServices: React.FC<RelatedServicesProps> = ({ title, services }) => {
  if (!services || services.length === 0) return null

  return (
    <div className="rounded-lg bg-muted/50 p-6">
      {title && <h3 className="mb-6 text-lg font-semibold">{title}</h3>}
      <div className="space-y-4">
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
                className="block space-y-1 rounded-md p-3 transition-colors hover:bg-background no-underline"
              >
                <div className="flex items-center gap-2">
                  {icon && typeof icon !== 'string' && (
                    <Media
                      resource={icon}
                      className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors dark:invert"
                    />
                  )}
                  <div className="text-sm font-medium group-hover:text-primary transition-colors">
                    {itemTitle}
                  </div>
                </div>
                {shortDescription && (
                  <div className="text-xs text-muted-foreground">{shortDescription}</div>
                )}
              </CMSLink>
            </div>
          )
        })}
      </div>
    </div>
  )
}
