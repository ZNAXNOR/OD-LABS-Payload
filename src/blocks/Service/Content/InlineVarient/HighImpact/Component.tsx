import type { ExpertiseContentBlock as ExpertiseContentBlockProps } from '@/payload-types'
import React from 'react'
import { Media } from '@/components/Media'

export const HighImpactExpertise: React.FC<ExpertiseContentBlockProps> = ({ title, items }) => {
  return (
    <div className="bg-muted py-16 ">
      <div className="container">
        <div className="mx-auto max-w-3xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {items?.map((item, index) => (
              <div key={index} className="rounded-lg border bg-background p-6 text-center">
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
                  {item.stat && <div className="text-2xl font-bold">{item.stat}</div>}
                  <div className="text-sm font-medium">{item.title}</div>
                  <div className="text-xs text-muted-foreground">{item.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
