import React from 'react'
import {
  Rocket,
  Settings,
  Check,
  Users,
  Zap,
  Shield,
} from 'lucide-react'

import type { FeatureBlock as FeatureBlockProps } from '@/payload-types'
import RichText from '@/components/RichText'

const iconMap = {
  Rocket,
  Settings,
  Check,
  Users,
  Zap,
  Shield,
}

const columnMap = {
  '2': 'lg:grid-cols-2',
  '3': 'lg:grid-cols-3',
  '4': 'lg:grid-cols-4',
}

export const StackedListFeatureBlock: React.FC<FeatureBlockProps> = ({
  eyebrow,
  heading,
  subheading,
  items,
  columns = '3',
}) => {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-20">
          {eyebrow && (
            <h2 className="text-xl font-bold mb-4 uppercase tracking-wide text-on-surface-variant font-mono">
              {eyebrow}
            </h2>
          )}

          {heading && (
            <p className="text-4xl md:text-5xl font-bold max-w-2xl text-on-surface leading-tight">
              {heading}
            </p>
          )}

          {subheading && (
            <p className="mt-6 text-xl text-on-surface-variant max-w-3xl leading-relaxed">
              {subheading}
            </p>
          )}
        </div>

        <div
          className={`grid grid-cols-1 md:grid-cols-2 ${columnMap[columns as keyof typeof columnMap]} gap-6`}
        >
          {items?.map((item, index) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap]

            return (
              <div
                key={index}
                className="p-8 border border-outline-variant bg-surface rounded hover:border-primary transition-colors"
              >
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-on-surface font-mono">
                  {Icon && (
                    <Icon className="text-primary w-5 h-5" />
                  )}

                  {item.title}
                </h3>

                {item.description && (
                  <RichText
                    data={item.description}
                    enableGutter={false}
                    enableProse={false}
                    className="prose prose-sm max-w-none text-on-surface-variant prose-ul:space-y-2"
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
