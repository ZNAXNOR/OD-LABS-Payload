import React from 'react'
import type { Page } from '@/payload-types'
import RichText from '@/components/RichText'

type HeroData = NonNullable<Page['hero']>

type LowImpactHeroDefaultProps = {
  children?: React.ReactNode
  richText?: HeroData['richText']
}

export const LowImpactHeroDefault: React.FC<LowImpactHeroDefaultProps> = ({
  children,
  richText,
}) => {
  return (
    <div className="container mt-16">
      <div className="max-w-3xl">
        {children || (richText && <RichText data={richText} enableGutter={false} />)}
      </div>
    </div>
  )
}
