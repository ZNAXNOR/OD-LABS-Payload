import React from 'react'
import * as LucideIcons from 'lucide-react'
import Link from 'next/link'
import { ArrowRightIcon } from '@/icons/ArrowRightIcon'

type Feature = {
  icon: string
  title: string
  description: string
  link?: {
    url?: string
    label?: string
  }
}

type FeatureGridBlockProps = {
  block: {
    blockType: 'featureGrid'
    heading?: string
    description?: string
    columns: 2 | 3 | 4 | 6
    style: 'cards' | 'minimal' | 'icons'
    features: Feature[]
  }
}

export function FeatureGridBlock({ block }: FeatureGridBlockProps) {
  const { heading, description, columns, style, features } = block

  const columnClass = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
    6: 'md:grid-cols-3 lg:grid-cols-6',
  }[columns]

  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName]
    return Icon ? <Icon className="h-6 w-6" /> : null
  }

  return (
    <section className="py-16 bg-white dark:bg-zinc-950">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {(heading || description) && (
            <div className="text-center mb-12">
              {heading && (
                <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                  {heading}
                </h2>
              )}
              {description && (
                <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                  {description}
                </p>
              )}
            </div>
          )}

          <div className={`grid grid-cols-1 ${columnClass} gap-6`}>
            {features.map((feature, index) => {
              const FeatureContent = (
                <>
                  <div
                    className={`${
                      style === 'icons'
                        ? 'mb-2'
                        : 'mb-4 p-3 rounded-lg bg-brand-primary/10 text-brand-primary w-fit'
                    }`}
                  >
                    {getIcon(feature.icon)}
                  </div>
                  <h3
                    className={`${
                      style === 'icons' ? 'text-base' : 'text-xl'
                    } font-semibold text-zinc-900 dark:text-zinc-100 mb-2`}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                  {feature.link?.url && feature.link?.label && (
                    <div className="mt-4 flex items-center text-brand-primary hover:text-brand-primary/80 transition-colors">
                      <span className="text-sm font-medium">{feature.link.label}</span>
                      <ArrowRightIcon className="ml-1 h-4 w-4" />
                    </div>
                  )}
                </>
              )

              if (style === 'cards') {
                return (
                  <div
                    key={index}
                    className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-brand-primary dark:hover:border-brand-primary transition-colors"
                  >
                    {feature.link?.url ? (
                      <Link href={feature.link.url} className="block">
                        {FeatureContent}
                      </Link>
                    ) : (
                      FeatureContent
                    )}
                  </div>
                )
              }

              if (style === 'minimal') {
                return (
                  <div key={index} className="p-4">
                    {feature.link?.url ? (
                      <Link href={feature.link.url} className="block">
                        {FeatureContent}
                      </Link>
                    ) : (
                      FeatureContent
                    )}
                  </div>
                )
              }

              // icons style
              return (
                <div key={index} className="text-center p-4">
                  {feature.link?.url ? (
                    <Link href={feature.link.url} className="block">
                      {FeatureContent}
                    </Link>
                  ) : (
                    FeatureContent
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
