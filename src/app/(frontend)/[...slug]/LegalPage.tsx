import React from 'react'
import { RenderHero } from '@/heros/RenderHero'
import RichText from '@/components/RichText'
import type { Page } from '@/payload-types'

export type LegalPageProps = {
  page: Page
}

/**
 * LegalPage Component
 *
 * Renders legal pages with a combined hero + rich text content layout,
 * similar to how posts are rendered. The page title is used as the hero title.
 */
export const LegalPage: React.FC<LegalPageProps> = ({ page }) => {
  const { legalContent } = page

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero section — uses page title as the heading */}
      <RenderHero {...page} />

      {/* Rich text legal content */}
      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="container">
          {legalContent && <RichText data={legalContent} enableGutter={false} payloadData={page} />}
        </div>
      </div>
    </div>
  )
}
