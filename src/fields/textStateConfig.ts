/**
 * Inline text styles available in Payload rich-text editors.
 * Shared with the RichText renderer so TextStateFeature styles render on the frontend.
 */
export const textStateConfig = {
  color: {
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
