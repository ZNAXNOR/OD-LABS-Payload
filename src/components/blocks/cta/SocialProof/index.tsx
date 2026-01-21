import React from 'react'
import { Media } from '@/components/ui/Media'
import type { Media as MediaType } from '@/payload-types'

interface SocialProofBlockProps {
  blockType: 'socialProof'
  heading?: string | null
  type?: 'logos' | 'stats' | 'badges' | 'combined' | null
  layout?: 'row' | 'grid' | null
  logos?: Array<{
    logo: number | MediaType
    image?: number | MediaType
    name?: string | null
    link?: string | null
    id?: string | null
  }> | null
  stats?: Array<{
    value: string
    label: string
    id?: string | null
  }> | null
  badges?: Array<{
    badge: number | MediaType
    image?: number | MediaType
    name?: string | null
    title?: string | null
    id?: string | null
  }> | null
  grayscale?: boolean | null
}

export const SocialProofBlock: React.FC<SocialProofBlockProps> = ({
  heading,
  type = 'logos',
  logos,
  stats,
  badges,
  layout = 'row',
  grayscale = true,
}) => {
  const renderLogos = () => {
    if (!logos || logos.length === 0) return null

    const gridClasses =
      layout === 'grid'
        ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'
        : 'flex flex-wrap items-center justify-center gap-8 md:gap-12'

    return (
      <div className={gridClasses}>
        {logos.map((logo, index) => {
          const logoContent = (
            <div
              className={`relative h-12 md:h-16 w-32 md:w-40 flex items-center justify-center ${
                grayscale
                  ? 'grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300'
                  : ''
              }`}
            >
              {typeof logo.image !== 'string' && (
                <Media
                  resource={logo.image}
                  className="object-contain w-full h-full"
                  imgClassName="object-contain"
                />
              )}
            </div>
          )

          if (logo.link) {
            return (
              <a
                key={index}
                href={logo.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
                aria-label={logo.name || undefined}
              >
                {logoContent}
              </a>
            )
          }

          return (
            <div key={index} aria-label={logo.name || undefined}>
              {logoContent}
            </div>
          )
        })}
      </div>
    )
  }

  const renderStats = () => {
    if (!stats || stats.length === 0) return null

    const gridClasses =
      layout === 'grid'
        ? 'grid grid-cols-2 md:grid-cols-3 gap-8'
        : 'flex flex-wrap items-center justify-center gap-12 md:gap-16'

    return (
      <div className={gridClasses}>
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-brand-primary mb-2">
              {stat.value}
            </div>
            <div className="text-sm md:text-base text-zinc-600 dark:text-zinc-400">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderBadges = () => {
    if (!badges || badges.length === 0) return null

    const gridClasses =
      layout === 'grid'
        ? 'grid grid-cols-2 md:grid-cols-4 gap-6'
        : 'flex flex-wrap items-center justify-center gap-6 md:gap-8'

    return (
      <div className={gridClasses}>
        {badges.map((badge, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <div className="relative h-20 w-20 md:h-24 md:w-24 mb-2">
              {typeof badge.image !== 'string' && (
                <Media
                  resource={badge.image}
                  className="object-contain w-full h-full"
                  imgClassName="object-contain"
                />
              )}
            </div>
            <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400">{badge.title}</p>
          </div>
        ))}
      </div>
    )
  }

  const renderContent = () => {
    if (type === 'logos') return renderLogos()
    if (type === 'stats') return renderStats()
    if (type === 'badges') return renderBadges()

    // Combined type
    return (
      <div className="space-y-16">
        {logos && logos.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-center mb-8 text-zinc-600 dark:text-zinc-400">
              Trusted by leading companies
            </h3>
            {renderLogos()}
          </div>
        )}

        {stats && stats.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-center mb-8 text-zinc-600 dark:text-zinc-400">
              By the numbers
            </h3>
            {renderStats()}
          </div>
        )}

        {badges && badges.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-center mb-8 text-zinc-600 dark:text-zinc-400">
              Certifications & Awards
            </h3>
            {renderBadges()}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="container py-12 md:py-16">
      <div className="max-w-6xl mx-auto">
        {heading && (
          <h2 className="text-2xl md:text-3xl font-bold text-center text-zinc-900 dark:text-white mb-12">
            {heading}
          </h2>
        )}

        {renderContent()}
      </div>
    </div>
  )
}
