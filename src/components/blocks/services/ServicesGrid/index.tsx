import React from 'react'
import type { ServicesGridBlock as ServicesGridBlockType } from '@/payload-types'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import * as LucideIcons from 'lucide-react'

interface ServicesGridBlockProps {
  block: ServicesGridBlockType
  className?: string
}

export const ServicesGridBlock: React.FC<ServicesGridBlockProps> = ({ block, className }) => {
  const {
    heading,
    description,
    columns = '3',
    services,
    style = 'cards',
    showIcons = true,
    ctaText,
    ctaLink,
  } = block

  const columnClasses = {
    '2': 'md:grid-cols-2',
    '3': 'md:grid-cols-2 lg:grid-cols-3',
    '4': 'md:grid-cols-2 lg:grid-cols-4',
  }

  const styleClasses = {
    cards: 'bg-white dark:bg-zinc-900 shadow-lg hover:shadow-xl transition-shadow',
    minimal: 'bg-transparent',
    bordered:
      'bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 hover:border-brand-primary dark:hover:border-brand-primary transition-colors',
  }

  const getIcon = (iconName?: string) => {
    if (!iconName || !showIcons) return null
    const Icon = (LucideIcons as any)[iconName]
    return Icon ? <Icon className="w-12 h-12 text-brand-primary" /> : null
  }

  const getLinkHref = (linkData: any) => {
    if (!linkData) return '#'
    if (linkData.type === 'custom') return linkData.url || '#'
    if (linkData.type === 'reference' && linkData.reference) {
      const ref = linkData.reference
      if (typeof ref === 'object' && ref.slug) {
        return `/${ref.slug}`
      }
    }
    return '#'
  }

  return (
    <section className={cn('py-16 px-4', className)}>
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        {(heading || description) && (
          <div className="text-center mb-12">
            {heading && (
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
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

        {/* Services Grid */}
        <div
          className={cn(
            'grid grid-cols-1 gap-8',
            columnClasses[columns as keyof typeof columnClasses],
          )}
        >
          {services?.map((service, index) => {
            const icon = getIcon(service.icon || undefined)
            const linkData = service.link?.link
            const hasLink = linkData && (linkData.url || linkData.reference)

            const cardContent = (
              <>
                {/* Icon */}
                {icon && <div className="mb-6">{icon}</div>}

                {/* Title */}
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-zinc-600 dark:text-zinc-400 mb-4">{service.description}</p>

                {/* Features */}
                {service.features && service.features.length > 0 && (
                  <ul className="space-y-2 mb-4">
                    {service.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-start text-sm text-zinc-700 dark:text-zinc-300"
                      >
                        <svg
                          className="w-5 h-5 text-brand-primary mr-2 flex-shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {feature.feature}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Link */}
                {hasLink && linkData?.label && (
                  <div className="mt-auto pt-4">
                    <span className="text-brand-primary hover:text-brand-primary/80 font-medium inline-flex items-center">
                      {linkData.label}
                      <svg
                        className="w-4 h-4 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </div>
                )}
              </>
            )

            const cardClasses = cn(
              'p-6 rounded-lg flex flex-col',
              styleClasses[style as keyof typeof styleClasses],
              service.highlighted && 'ring-2 ring-brand-primary',
            )

            return hasLink ? (
              <Link
                key={index}
                href={getLinkHref(service.link)}
                target={linkData?.newTab ? '_blank' : undefined}
                rel={linkData?.newTab ? 'noopener noreferrer' : undefined}
                className={cardClasses}
              >
                {cardContent}
              </Link>
            ) : (
              <div key={index} className={cardClasses}>
                {cardContent}
              </div>
            )
          })}
        </div>

        {/* CTA Button */}
        {ctaText && ctaLink && (
          <div className="text-center mt-12">
            <Link
              href={getLinkHref(ctaLink)}
              target={ctaLink.link?.newTab ? '_blank' : undefined}
              rel={ctaLink.link?.newTab ? 'noopener noreferrer' : undefined}
              className="inline-flex items-center px-6 py-3 bg-brand-primary text-white font-medium rounded-lg hover:bg-brand-primary/90 transition-colors"
            >
              {ctaText}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

export default ServicesGridBlock
