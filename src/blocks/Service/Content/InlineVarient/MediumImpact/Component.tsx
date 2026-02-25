import type { ExpertiseContentBlock as ExpertiseContentBlockProps } from '@/payload-types'
import React from 'react'
import { Media } from '@/components/Media'

export const MediumImpactExpertise: React.FC<ExpertiseContentBlockProps> = ({ title, items }) => {
  return (
    <div className="mb-16">
      {title && (
        <h2 className="mb-8 text-center text-2xl font-semibold tracking-tight md:text-3xl">
          {title}
        </h2>
      )}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {items?.map((item, index) => (
          <div key={index} className="rounded-lg bg-muted/50 p-6 text-center">
            {item.icon && (
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center">
                <Media
                  resource={item.icon}
                  className="h-8 w-8 object-contain"
                  imgClassName="h-8 w-8 object-contain"
                />
              </div>
            )}
            <div className="space-y-2">
              <div className="text-sm font-medium">{item.title}</div>
              <div className="text-xs text-muted-foreground">{item.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
