import React from 'react'

import type { ArtifactBlockProps } from './types'

import { ArtifactCard } from './components/ArtifactCard'

const widthMap = {
  oneThird: 'md:col-span-4',
  half: 'md:col-span-6',
  twoThirds: 'md:col-span-8',
  full: 'md:col-span-12',
}

export const ArtifactBlock: React.FC<
  ArtifactBlockProps
> = (props) => {
  const {
    theme = 'dark',
    eyebrow,
    heading,
    items,
  } = props

  const isDark = theme === 'dark'

  return (
    <section
      className={[
        'py-40 w-full',
        isDark
          ? 'bg-inverse-surface text-inverse-on-surface'
          : 'bg-background text-foreground',
      ].join(' ')}
    >
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-24">
          {eyebrow && (
            <h2
              className={[
                'text-xl font-bold mb-4 uppercase tracking-wide font-mono',
                isDark
                  ? 'text-outline'
                  : 'text-muted-foreground',
              ].join(' ')}
            >
              {eyebrow}
            </h2>
          )}

          <p
            className={[
              'text-4xl md:text-5xl font-bold max-w-3xl leading-tight',
              isDark
                ? 'text-surface-container-lowest'
                : 'text-foreground',
            ].join(' ')}
          >
            {heading}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {items?.map((item, index) => (
            <div
              key={item.id || index}
              className={
                widthMap[item.width]
              }
            >
              <ArtifactCard
                item={item}
                dark={isDark}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
