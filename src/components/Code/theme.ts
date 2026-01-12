import type { PrismTheme } from 'prism-react-renderer'

export const theme: PrismTheme = {
  plain: {
    color: '#d1d5da',
  },
  styles: [
    {
      style: {
        color: '#8b949e',
      },
      types: ['comment'],
    },
    {
      style: {
        color: '#ff7b72',
      },
      types: ['keyword', 'atrule.rule'],
    },
    {
      style: {
        color: '#d2a8ff',
      },
      types: ['function'],
    },
    {
      style: {
        color: '#79d8a9',
      },
      types: [
        'property',
        'key',
        'tag:not(.punctuation):not(.attr-name):not(.attr-value):not(.script)',
        'selector',
      ],
    },
    {
      style: {
        color: '#8cc4ff',
      },
      types: ['string', 'template-string', 'attr-value', 'hexcode.color'],
    },
    {
      style: {
        color: '#61afef',
      },
      types: [
        'number',
        'boolean',
        'keyword.nil',
        'null',
        'doctype',
        'attr-name',
        'selector.class',
        'selector.pseudo-class',
        'selector.combinator',
        'property',
        'atrule.keyword',
        'operator',
        'property-access',
      ],
    },
    {
      style: {
        color: '#e5c07b',
      },
      types: ['variable', 'class-name', 'maybe-class-name'],
    },
  ],
}
