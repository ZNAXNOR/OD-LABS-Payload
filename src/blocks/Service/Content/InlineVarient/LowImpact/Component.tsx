import type { ExpertiseContentBlock as ExpertiseContentBlockProps } from '@/payload-types'
import React from 'react'
import { Media } from '@/components/Media'

export const LowImpactExpertise: React.FC<ExpertiseContentBlockProps> = ({ title, items }) => {
  return (
    <div className="mb-16">
      {title && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">{title}</h2>
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {items?.map((item, index) => (
          <div key={index} className="flex items-center gap-3 rounded-lg border p-4">
            {item.icon && (
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center">
                <Media
                  resource={item.icon}
                  className="h-6 w-6 object-contain"
                  imgClassName="h-6 w-6 object-contain"
                />
              </div>
            )}
            <div>
              <div className="text-sm font-medium">{item.title}</div>
              <div className="text-xs text-muted-foreground">{item.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
