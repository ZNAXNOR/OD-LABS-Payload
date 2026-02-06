import React from 'react'

import type { Page, Media as MediaType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import RatingWithScore from '@/components/RatingWithScore'

export const LowImpactHeroRating: React.FC<Page['hero']> = ({ links, Rating, richText }) => {
  const { avatars } = Rating || {}

  return (
    <section className="py-32">
      <div className="container text-center">
        <div className="mx-auto flex max-w-5xl flex-col gap-6">
          {richText && <RichText data={richText} enableGutter={false} className="mx-auto" />}
        </div>

        {Array.isArray(links) && links.length > 0 && (
          <div className="mt-10 flex justify-center gap-4">
            {links.map(({ link }, i) => (
              <CMSLink key={i} size="lg" {...link} />
            ))}
          </div>
        )}
        
        <div className="mx-auto mt-10 flex w-fit flex-col items-center gap-4 sm:flex-row">
          <span className="mx-4 inline-flex items-center -space-x-4">
            {avatars?.map((avatar, index) => {
              const image = avatar.image as MediaType
              if (typeof image === 'object' && image?.url) {
                return (
                  <Avatar key={index} className="size-14 border">
                    <AvatarImage src={image.url} alt={image.alt || ''} />
                  </Avatar>
                )
              }
              return null
            })}
          </span>
          <div>
            <div className="flex items-center gap-1">
              <RatingWithScore score={Rating?.score} label={Rating?.label} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
