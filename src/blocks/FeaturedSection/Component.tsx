import React from 'react'
import type { FeaturedSectionBlock as FeaturedSectionBlockProps } from '@/payload-types'
import { Media } from '@/components/Media'

export const FeaturedSectionBlock: React.FC<FeaturedSectionBlockProps> = ({
  header,
  subheader,
  logos,
}) => {
  return (
    <div className="py-16 bg-white dark:bg-black/20 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          {header && (
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-black dark:text-white transition-colors">
              {header}
            </h2>
          )}
          {subheader && (
            <p className="text-gray-500 dark:text-gray-400 font-medium text-lg transition-colors">
              {subheader}
            </p>
          )}
        </div>

        {logos && logos.length > 0 && (
          <div className="flex flex-wrap justify-center items-center">
            {logos.map((item, index) => {
              const { logo, link } = item

              if (!logo || typeof logo === 'string') return null

              const Wrapper = link ? 'a' : 'div'
              const wrapperProps = link
                ? { href: link, target: '_blank', rel: 'noopener noreferrer' }
                : {}

              return (
                <Wrapper
                  key={index}
                  {...wrapperProps}
                  className="group block p-8 cursor-pointer transition-all duration-300 hover:bg-gray-50 dark:hover:bg-white/5 border border-transparent hover:border-gray-100 dark:hover:border-white/10"
                >
                  <div className="relative w-32 h-16 flex items-center justify-center grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">
                    <Media resource={logo} className="object-contain max-h-full max-w-full" />
                  </div>
                </Wrapper>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
