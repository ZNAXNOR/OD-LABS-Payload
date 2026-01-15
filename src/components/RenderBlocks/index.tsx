import React from 'react'
import type { Page } from '@/payload-types'
import { HeroBlock } from '@/components/blocks/Hero'
import { ServicesGridBlock } from '@/components/blocks/ServicesGrid'
import { TechStackBlock } from '@/components/blocks/TechStack'
import { ProcessStepsBlock } from '@/components/blocks/ProcessSteps'
import { PricingTableBlock } from '@/components/blocks/PricingTable'
import { ProjectShowcaseBlock } from '@/components/blocks/ProjectShowcase'
import { CaseStudyBlock } from '@/components/blocks/CaseStudy'
import { BeforeAfterBlock } from '@/components/blocks/BeforeAfter'
import { TestimonialBlock } from '@/components/blocks/Testimonial'
import { FeatureGridBlock } from '@/components/blocks/FeatureGrid'
import { StatsCounterBlock } from '@/components/blocks/StatsCounter'
import { FAQAccordionBlock } from '@/components/blocks/FAQAccordion'
import { TimelineBlock } from '@/components/blocks/Timeline'

interface RenderBlocksProps {
  blocks: Page['layout']
}

export function RenderBlocks({ blocks }: RenderBlocksProps) {
  if (!blocks || blocks.length === 0) {
    return null
  }

  return (
    <>
      {blocks.map((block, index) => {
        switch (block.blockType) {
          case 'hero':
            return <HeroBlock key={index} block={block} />

          case 'content':
            return (
              <section key={index} className="py-16">
                <div className="container mx-auto px-4">
                  <div className="max-w-4xl mx-auto">
                    {/* Content block would go here */}
                    <p className="text-sm text-muted-foreground mb-4">Content Block</p>
                  </div>
                </div>
              </section>
            )

          case 'cta':
            return (
              <section key={index} className="py-16 bg-primary text-primary-foreground">
                <div className="container mx-auto px-4">
                  <div className="max-w-4xl mx-auto text-center">
                    {/* CTA content would go here */}
                    <p className="text-sm opacity-80 mb-4">Call to Action Block</p>
                  </div>
                </div>
              </section>
            )

          case 'mediaBlock':
            return (
              <section key={index} className="py-16">
                <div className="container mx-auto px-4">
                  <div className="max-w-6xl mx-auto">
                    {/* Media block would go here */}
                    <p className="text-sm text-muted-foreground mb-4">Media Block</p>
                  </div>
                </div>
              </section>
            )

          case 'archive':
            return (
              <section key={index} className="py-16 bg-muted">
                <div className="container mx-auto px-4">
                  <div className="max-w-6xl mx-auto">
                    {/* Archive block would go here */}
                    <p className="text-sm text-muted-foreground mb-4">Archive Block</p>
                  </div>
                </div>
              </section>
            )

          case 'banner':
            return (
              <section key={index} className="py-8 bg-accent">
                <div className="container mx-auto px-4">
                  <div className="max-w-6xl mx-auto">
                    {/* Banner block would go here */}
                    <p className="text-sm text-muted-foreground mb-4">Banner Block</p>
                  </div>
                </div>
              </section>
            )

          case 'code':
            return (
              <section key={index} className="py-16">
                <div className="container mx-auto px-4">
                  <div className="max-w-4xl mx-auto">
                    {/* Code block would go here */}
                    <p className="text-sm text-muted-foreground mb-4">Code Block</p>
                  </div>
                </div>
              </section>
            )

          case 'servicesGrid':
            return <ServicesGridBlock key={index} block={block} />

          case 'techStack':
            return <TechStackBlock key={index} block={block} />

          case 'processSteps':
            return <ProcessStepsBlock key={index} block={block} />

          case 'pricingTable':
            return <PricingTableBlock key={index} block={block} />

          case 'projectShowcase':
            return <ProjectShowcaseBlock key={index} block={block} />

          case 'caseStudy':
            return <CaseStudyBlock key={index} block={block} />

          case 'beforeAfter':
            return <BeforeAfterBlock key={index} block={block} />

          case 'testimonial':
            return <TestimonialBlock key={index} block={block} />

          case 'featureGrid':
            return <FeatureGridBlock key={index} block={block} />

          case 'statsCounter':
            return <StatsCounterBlock key={index} block={block} />

          case 'faqAccordion':
            return <FAQAccordionBlock key={index} block={block} />

          case 'timeline':
            return <TimelineBlock key={index} block={block} />

          default:
            return null
        }
      })}
    </>
  )
}
