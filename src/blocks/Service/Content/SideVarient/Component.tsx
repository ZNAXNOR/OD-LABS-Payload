import type { ExpertiseContentBlock as ExpertiseContentBlockProps } from '@/payload-types'
import React from 'react'
import { Media } from '@/components/Media'

export const SideVarientExpertise: React.FC<ExpertiseContentBlockProps> = ({ title, items }) => {
  return (
    <div className="rounded-lg bg-muted/50 p-6">
      {title && <h3 className="mb-6 text-lg font-semibold">{title}</h3>}
      <div className="space-y-6">
        {items?.map((item, index: number) => (
          <div key={index} className="flex items-center gap-4">
            {item.icon && (
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center">
                <Media
                  resource={item.icon}
                  className="h-6 w-6 object-contain"
                  imgClassName="h-6 w-6 object-contain"
                />
              </div>
            )}
            <div className="flex-1">
              <div className="text-sm font-medium">{item.title}</div>
              <div className="text-xs text-muted-foreground">{item.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
