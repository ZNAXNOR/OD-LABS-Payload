import React from 'react'
import type { Page } from '@/payload-types'
import { HeroBlock } from '@/components/blocks/Hero'

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

          default:
            return null
        }
      })}
    </>
  )
}
