import React from 'react'
import { cn } from '@/utilities/ui'
import RichText from '@/components/RichText'

interface ContainerBlockType {
  blockType: 'container'
  content?: any // RichText content
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | null
  padding?: 'none' | 'sm' | 'md' | 'lg' | null
  backgroundColor?: 'none' | 'white' | 'zinc-50' | 'zinc-100' | 'zinc-900' | 'brand-primary' | null
  backgroundImage?: any
  paddingTop?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | null
  paddingBottom?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | null
  marginTop?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | null
  marginBottom?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | null
}

interface ContainerBlockProps {
  block: ContainerBlockType
  className?: string
}

export const ContainerBlock: React.FC<ContainerBlockProps> = ({ block, className }) => {
  const {
    content,
    maxWidth = 'xl',
    backgroundColor = 'none',
    backgroundImage,
    paddingTop = 'md',
    paddingBottom = 'md',
    marginTop = 'none',
    marginBottom = 'none',
  } = block

  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full',
  }

  const backgroundClasses = {
    none: '',
    white: 'bg-white dark:bg-zinc-900',
    'zinc-50': 'bg-zinc-50 dark:bg-zinc-800',
    'zinc-100': 'bg-zinc-100 dark:bg-zinc-800',
    'zinc-900': 'bg-zinc-900 dark:bg-zinc-950',
    'brand-primary': 'bg-brand-primary text-white',
  }

  const paddingTopClasses = {
    none: 'pt-0',
    sm: 'pt-8',
    md: 'pt-16',
    lg: 'pt-24',
    xl: 'pt-32',
  }

  const paddingBottomClasses = {
    none: 'pb-0',
    sm: 'pb-8',
    md: 'pb-16',
    lg: 'pb-24',
    xl: 'pb-32',
  }

  const marginTopClasses = {
    none: 'mt-0',
    sm: 'mt-8',
    md: 'mt-16',
    lg: 'mt-24',
    xl: 'mt-32',
  }

  const marginBottomClasses = {
    none: 'mb-0',
    sm: 'mb-8',
    md: 'mb-16',
    lg: 'mb-24',
    xl: 'mb-32',
  }

  const getBackgroundImageUrl = () => {
    if (!backgroundImage) return null
    if (typeof backgroundImage === 'string') return backgroundImage
    return backgroundImage.url || null
  }

  const bgImageUrl = getBackgroundImageUrl()

  return (
    <section
      className={cn(
        'relative',
        backgroundClasses[backgroundColor as keyof typeof backgroundClasses],
        paddingTopClasses[paddingTop as keyof typeof paddingTopClasses],
        paddingBottomClasses[paddingBottom as keyof typeof paddingBottomClasses],
        marginTopClasses[marginTop as keyof typeof marginTopClasses],
        marginBottomClasses[marginBottom as keyof typeof marginBottomClasses],
        className,
      )}
      style={
        bgImageUrl
          ? {
              backgroundImage: `url(${bgImageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }
          : undefined
      }
    >
      {/* Overlay for background image */}
      {bgImageUrl && backgroundColor !== 'none' && (
        <div
          className={cn(
            'absolute inset-0',
            backgroundClasses[backgroundColor as keyof typeof backgroundClasses],
            'opacity-90',
          )}
        />
      )}

      {/* Content */}
      <div
        className={cn(
          'relative mx-auto px-4',
          maxWidthClasses[maxWidth as keyof typeof maxWidthClasses],
        )}
      >
        {content && <RichText content={content} />}
      </div>
    </section>
  )
}

export default ContainerBlock
