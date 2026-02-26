import React from 'react'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import RichText from '@/components/RichText'
import { ExpertiseContentBlock as ExpertiseContentComponent } from '@/blocks/Service/Content'
import { RelatedServices } from '@/blocks/Service/RelatedServices'
import type { Page, ExpertiseContentBlock } from '@/payload-types'

export type ServicesPageProps = {
  page: Page
  blocks: any[]
}

/**
 * ServicesPage Component
 *
 * Handles the specialized layout for service pages, including conditional hero
 * positioning and expertise variant rendering.
 */
export const ServicesPage: React.FC<ServicesPageProps> = ({ page, blocks }) => {
  const { servicesHero, expertise, serviceContent, relatedServices } = page

  // Layout flags
  const isLowImpactHero = servicesHero?.type === 'lowImpact'
  const isHighImpactHero = servicesHero?.type === 'highImpact'
  const isSideVariant = expertise?.variant === 'sideVarient'

  // Helper to prepare expertise data for a specific variant context
  const getExpertiseProps = (forcedVariant?: string): ExpertiseContentBlock | null => {
    if (!expertise) return null
    return {
      ...expertise,
      variant:
        forcedVariant || (isHighImpactHero && !isSideVariant ? 'highImpact' : expertise.variant),
      blockType: 'expertiseContent',
    } as any
  }

  const expertiseData = getExpertiseProps()
  const sidebarExpertiseData = getExpertiseProps('sideVarient')

  return (
    <>
      {/* 1. Global Hero (Standard / High Impact) */}
      {!isLowImpactHero && <RenderHero {...page} />}

      {/* 2. Full-width High Impact Expertise (Auto-activated) */}
      {isHighImpactHero && !isSideVariant && expertiseData && (
        <ExpertiseContentComponent {...expertiseData} />
      )}

      {/* 3. Main Content Area */}
      <div className="container">
        <div className="mx-auto text-left mt-16">
          <div
            className={
              isSideVariant
                ? 'grid grid-cols-1 gap-12 lg:grid-cols-[1fr_300px] lg:max-w-[calc(48rem+300px+3rem)] mx-auto'
                : 'mt-12 max-w-3xl mx-auto'
            }
          >
            {/* Primary Column */}
            <div className="w-full">
              <div className="w-full max-w-3xl">
                {/* 3a. Inline Hero (Low Impact only) */}
                {isLowImpactHero && (
                  <div className="[&>.container]:px-0">
                    <RenderHero {...page} />
                  </div>
                )}

                {/* 3b. Mobile Expertise (Side Variant only - shown below hero on mobile) */}
                {isSideVariant && expertiseData && (
                  <div className="mb-12 lg:hidden max-w-3xl mx-auto">
                    <ExpertiseContentComponent {...expertiseData} />
                  </div>
                )}

                {/* 3c. Standard Inline Expertise (Inline variants only) */}
                {!isSideVariant && !isHighImpactHero && expertiseData && (
                  <div className="mb-12 mt-12 w-full max-w-3xl mx-auto">
                    <ExpertiseContentComponent {...expertiseData} />
                  </div>
                )}

                {/* 3d. Actual Page Content & Blocks */}
                <div className={isLowImpactHero ? 'mt-8' : ''}>
                  {serviceContent && (
                    <RichText
                      className="mb-8"
                      data={serviceContent}
                      enableGutter={false}
                      payloadData={page}
                    />
                  )}
                  <RenderBlocks blocks={blocks} />
                </div>

                {/* 3e. Related Services (Inline variant or Side variant on Mobile) */}
                {relatedServices && (
                  <div className={relatedServices.variant === 'side' ? 'lg:hidden' : ''}>
                    <RelatedServices {...relatedServices} variant="inline" />
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Column (Expertise Side Variant or Related Services Side Variant) */}
            {(isSideVariant || relatedServices?.variant === 'side') && (
              <aside className="hidden lg:block w-full">
                <div
                  className={`${isLowImpactHero ? 'mt-0 lg:-mt-6' : 'mt-12 lg:mt-0'} lg:sticky lg:top-12 space-y-8`}
                >
                  {isSideVariant && sidebarExpertiseData && (
                    <ExpertiseContentComponent {...sidebarExpertiseData} />
                  )}
                  {relatedServices?.variant === 'side' && (
                    <RelatedServices {...relatedServices} variant="side" />
                  )}
                </div>
              </aside>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
