import React from 'react'
import type { HeroBlock as HeroBlockType } from '@/payload-types'
import { DefaultHero } from './variants/Default'
import { CenteredHero } from './variants/Centered'
import { MinimalHero } from './variants/Minimal'
import { SplitHero } from './variants/Split'
import { GradientHero } from './variants/Gradient'
import { CodeTerminalHero } from './variants/CodeTerminal'

interface HeroBlockProps {
  block: HeroBlockType
  className?: string
}

export const HeroBlock: React.FC<HeroBlockProps> = ({ block, className }) => {
  const variant = block.variant || 'default'

  switch (variant) {
    case 'centered':
      return <CenteredHero block={block} className={className} />
    case 'minimal':
      return <MinimalHero block={block} className={className} />
    case 'split':
      return <SplitHero block={block} className={className} />
    case 'gradient':
      return <GradientHero block={block} className={className} />
    case 'codeTerminal':
      return <CodeTerminalHero block={block} className={className} />
    case 'default':
    default:
      return <DefaultHero block={block} className={className} />
  }
}

export default HeroBlock
