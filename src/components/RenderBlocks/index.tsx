import React from 'react'
import dynamic from 'next/dynamic'
import type { Page } from '@/payload-types'

// Lazy load all block components with loading states
const HeroBlock = dynamic(
  () => import('@/components/blocks/hero/Hero').then((mod) => ({ default: mod.HeroBlock })),
  {
    loading: () => <div className="min-h-[400px] animate-pulse bg-zinc-100 dark:bg-zinc-900" />,
  },
)

const ServicesGridBlock = dynamic(
  () =>
    import('@/components/blocks/services/ServicesGrid').then((mod) => ({
      default: mod.ServicesGridBlock,
    })),
  {
    loading: () => <div className="min-h-[300px] animate-pulse bg-zinc-50 dark:bg-zinc-900" />,
  },
)

const TechStackBlock = dynamic(
  () =>
    import('@/components/blocks/services/TechStack').then((mod) => ({
      default: mod.TechStackBlock,
    })),
  {
    loading: () => <div className="min-h-[300px] animate-pulse bg-zinc-50 dark:bg-zinc-900" />,
  },
)

const ProcessStepsBlock = dynamic(
  () =>
    import('@/components/blocks/services/ProcessSteps').then((mod) => ({
      default: mod.ProcessStepsBlock,
    })),
  {
    loading: () => <div className="min-h-[300px] animate-pulse bg-zinc-50 dark:bg-zinc-900" />,
  },
)

const PricingTableBlock = dynamic(
  () =>
    import('@/components/blocks/services/PricingTable').then((mod) => ({
      default: mod.PricingTableBlock,
    })),
  {
    loading: () => <div className="min-h-[400px] animate-pulse bg-zinc-50 dark:bg-zinc-900" />,
  },
)

const ProjectShowcaseBlock = dynamic(
  () =>
    import('@/components/blocks/portfolio/ProjectShowcase').then((mod) => ({
      default: mod.ProjectShowcaseBlock,
    })),
  {
    loading: () => <div className="min-h-[400px] animate-pulse bg-zinc-50 dark:bg-zinc-900" />,
  },
)

const CaseStudyBlock = dynamic(
  () =>
    import('@/components/blocks/portfolio/CaseStudy').then((mod) => ({
      default: mod.CaseStudyBlock,
    })),
  {
    loading: () => <div className="min-h-[400px] animate-pulse bg-zinc-50 dark:bg-zinc-900" />,
  },
)

const BeforeAfterBlock = dynamic(
  () =>
    import('@/components/blocks/portfolio/BeforeAfter').then((mod) => ({
      default: mod.BeforeAfterBlock,
    })),
  {
    loading: () => <div className="min-h-[400px] animate-pulse bg-zinc-50 dark:bg-zinc-900" />,
  },
)

const TestimonialBlock = dynamic(
  () =>
    import('@/components/blocks/portfolio/Testimonial').then((mod) => ({
      default: mod.TestimonialBlock,
    })),
  {
    loading: () => <div className="min-h-[300px] animate-pulse bg-zinc-50 dark:bg-zinc-900" />,
  },
)

const FeatureGridBlock = dynamic(
  () =>
    import('@/components/blocks/technical/FeatureGrid').then((mod) => ({
      default: mod.FeatureGridBlock,
    })),
  {
    loading: () => <div className="min-h-[300px] animate-pulse bg-zinc-50 dark:bg-zinc-900" />,
  },
)

const StatsCounterBlock = dynamic(
  () =>
    import('@/components/blocks/technical/StatsCounter').then((mod) => ({
      default: mod.StatsCounterBlock,
    })),
  {
    loading: () => <div className="min-h-[200px] animate-pulse bg-zinc-50 dark:bg-zinc-900" />,
  },
)

const FAQAccordionBlock = dynamic(
  () =>
    import('@/components/blocks/technical/FAQAccordion').then((mod) => ({
      default: mod.FAQAccordionBlock,
    })),
  {
    loading: () => <div className="min-h-[300px] animate-pulse bg-zinc-50 dark:bg-zinc-900" />,
  },
)

const TimelineBlock = dynamic(
  () =>
    import('@/components/blocks/technical/Timeline').then((mod) => ({
      default: mod.TimelineBlock,
    })),
  {
    loading: () => <div className="min-h-[400px] animate-pulse bg-zinc-50 dark:bg-zinc-900" />,
  },
)

const CallToActionBlock = dynamic(
  () =>
    import('@/blocks/CallToAction/Component').then((mod) => ({ default: mod.CallToActionBlock })),
  {
    loading: () => <div className="min-h-[300px] animate-pulse bg-zinc-50 dark:bg-zinc-900" />,
  },
)

const ContactFormBlock = dynamic(
  () =>
    import('@/components/blocks/cta/ContactForm').then((mod) => ({
      default: mod.ContactFormBlock,
    })),
  {
    loading: () => <div className="min-h-[400px] animate-pulse bg-zinc-50 dark:bg-zinc-900" />,
  },
)

const NewsletterBlock = dynamic(
  () =>
    import('@/components/blocks/cta/Newsletter').then((mod) => ({ default: mod.NewsletterBlock })),
  {
    loading: () => <div className="min-h-[200px] animate-pulse bg-zinc-50 dark:bg-zinc-900" />,
  },
)

const SocialProofBlock = dynamic(
  () =>
    import('@/components/blocks/cta/SocialProof').then((mod) => ({
      default: mod.SocialProofBlock,
    })),
  {
    loading: () => <div className="min-h-[200px] animate-pulse bg-zinc-50 dark:bg-zinc-900" />,
  },
)

const ContentBlock = dynamic(
  () =>
    import('@/components/blocks/content/Content').then((mod) => ({ default: mod.ContentBlock })),
  {
    loading: () => <div className="min-h-[200px] animate-pulse bg-zinc-50 dark:bg-zinc-900" />,
  },
)

const ContainerBlock = dynamic(
  () =>
    import('@/components/blocks/layout/Container').then((mod) => ({ default: mod.ContainerBlock })),
  {
    loading: () => <div className="min-h-[200px] animate-pulse bg-zinc-50 dark:bg-zinc-900" />,
  },
)

const DividerBlock = dynamic(
  () => import('@/components/blocks/layout/Divider').then((mod) => ({ default: mod.DividerBlock })),
  {
    loading: () => <div className="h-px animate-pulse bg-zinc-200 dark:bg-zinc-800" />,
  },
)

const SpacerBlock = dynamic(
  () => import('@/components/blocks/layout/Spacer').then((mod) => ({ default: mod.SpacerBlock })),
  {
    loading: () => <div className="h-16" />,
  },
)

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
        const blockType = (block as any).blockType

        switch (blockType) {
          case 'hero':
            return <HeroBlock key={index} block={block as any} />

          case 'content':
            return <ContentBlock key={index} block={block as any} />

          case 'container':
            return <ContainerBlock key={index} block={block as any} />

          case 'divider':
            return <DividerBlock key={index} block={block as any} />

          case 'spacer':
            return <SpacerBlock key={index} block={block as any} />

          case 'cta':
            return <CallToActionBlock key={index} {...(block as any)} />

          case 'contactForm':
            return <ContactFormBlock key={index} {...(block as any)} />

          case 'newsletter':
            return <NewsletterBlock key={index} {...(block as any)} />

          case 'socialProof':
            return <SocialProofBlock key={index} {...(block as any)} />

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
            return <ServicesGridBlock key={index} block={block as any} />

          case 'techStack':
            return <TechStackBlock key={index} block={block as any} />

          case 'processSteps':
            return <ProcessStepsBlock key={index} block={block as any} />

          case 'pricingTable':
            return <PricingTableBlock key={index} block={block as any} />

          case 'projectShowcase':
            return <ProjectShowcaseBlock key={index} block={block as any} />

          case 'caseStudy':
            return <CaseStudyBlock key={index} block={block as any} />

          case 'beforeAfter':
            return <BeforeAfterBlock key={index} block={block as any} />

          case 'testimonial':
            return <TestimonialBlock key={index} block={block as any} />

          case 'featureGrid':
            return <FeatureGridBlock key={index} block={block as any} />

          case 'statsCounter':
            return <StatsCounterBlock key={index} block={block as any} />

          case 'faqAccordion':
            return <FAQAccordionBlock key={index} block={block as any} />

          case 'timeline':
            return <TimelineBlock key={index} block={block as any} />

          default:
            return null
        }
      })}
    </>
  )
}
