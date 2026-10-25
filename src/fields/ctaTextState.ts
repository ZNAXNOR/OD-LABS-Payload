/**
 * TextStateFeature styles for the project CTA's heading and description.
 * Kept in a package-independent module so the Payload editor config and
 * the frontend rich-text converter share exactly the same style definitions.
 */
export const ctaTextState = {
  emphasis: {
    accent: {
      label: 'Accent red',
      css: { color: '#FF3B30' },
    },
    muted: {
      label: 'Muted',
      css: { color: '#A6ABB8' },
    },
    light: {
      label: 'Light',
      css: { color: '#F4F4F0' },
    },
  },
} as const
