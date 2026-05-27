import React from 'react'

import type { ServiceShowcaseBlockProps } from './types'

import { StickyRail } from './components/StickyRail'
import { EditorialFlow } from './components/EditorialFlow'

export const ServiceShowcaseBlock: React.FC<
  ServiceShowcaseBlockProps
> = ({ items }) => {
  if (!items?.length) return null

  return (
    <section className="py-40 border-b border-surface-container">
      <div className="max-w-7xl mx-auto px-8">
        <div className="space-y-40">
          {items.map((item, index) => (
            <div
              key={item.id || index}
              className="grid md:grid-cols-12 gap-16"
            >
              {/* LEFT */}
              <div className="md:col-span-5">
                <StickyRail item={item} />
              </div>

              {/* RIGHT */}
              <div className="md:col-span-7">
                <EditorialFlow item={item} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
