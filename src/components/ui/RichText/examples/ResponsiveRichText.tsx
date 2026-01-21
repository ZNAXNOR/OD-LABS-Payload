import React from 'react'
import { RichText } from '../index'
import type { EnhancedRichTextProps } from '../types'

// Example: Responsive RichText with different settings per breakpoint
export const ResponsiveRichTextExample: React.FC<EnhancedRichTextProps> = (props) => {
  const responsiveConfig = {
    mobile: {
      enableGutter: false,
      enableProse: true,
      className: 'px-4 text-sm',
    },
    tablet: {
      enableGutter: true,
      enableProse: true,
      className: 'px-6 text-base',
    },
    desktop: {
      enableGutter: true,
      enableProse: true,
      className: 'px-8 text-lg',
    },
  }

  return <RichText {...props} responsive={responsiveConfig} className="responsive-richtext" />
}

// Example: Mobile-first RichText
export const MobileFirstRichText: React.FC<EnhancedRichTextProps> = (props) => {
  return (
    <RichText
      {...props}
      enableGutter={false}
      enableProse={true}
      responsive={{
        mobile: {
          enableGutter: false,
          enableProse: true,
          className: 'px-4',
        },
        tablet: {
          enableGutter: true,
          enableProse: true,
          className: 'px-0',
        },
        desktop: {
          enableGutter: true,
          enableProse: true,
          className: 'px-0',
        },
      }}
    />
  )
}

// Example: Block-specific responsive behavior
export const BlockResponsiveRichText: React.FC<EnhancedRichTextProps> = (props) => {
  return (
    <RichText
      {...props}
      blockWhitelist={['hero', 'content', 'mediaBlock', 'cta']}
      responsive={{
        mobile: {
          enableGutter: false,
          className: 'space-y-4',
        },
        tablet: {
          enableGutter: true,
          className: 'space-y-6',
        },
        desktop: {
          enableGutter: true,
          className: 'space-y-8',
        },
      }}
    />
  )
}
