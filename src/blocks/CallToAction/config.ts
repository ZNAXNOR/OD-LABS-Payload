import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  TextStateFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '../../fields/linkGroup'
import { ctaTextState } from '../../fields/ctaTextState'

const richTextEditor = lexicalEditor({
  features: ({ rootFeatures }) => [
    ...rootFeatures,
    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
    TextStateFeature({ state: ctaTextState }),
    FixedToolbarFeature(),
    InlineToolbarFeature(),
  ],
})

export const CallToAction: Block = {
  slug: 'cta',
  interfaceName: 'CallToActionBlock',
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Section label',
      defaultValue: 'START A PROJECT',
      admin: {
        description: 'A short section label. The section number is generated automatically.',
      },
    },
    {
      name: 'heading',
      type: 'richText',
      label: 'Heading',
      required: true,
      editor: richTextEditor,
      admin: {
        description: 'Use a heading block. Inline text styles are available in the toolbar.',
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Description',
      required: true,
      editor: richTextEditor,
      admin: {
        description: 'Supporting copy below the main heading.',
      },
    },
    {
      name: 'primaryLink',
      type: 'group',
      label: 'Primary action',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          defaultValue: 'START A PROJECT →',
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          defaultValue: 'mailto:hello@odlabs.dev?subject=Project%20Inquiry',
          admin: {
            description: 'Destination URL. Use a mailto link if the action should open an email draft; the email address is not displayed in the CTA.',
          },
        },
        {
          name: 'newTab',
          type: 'checkbox',
          label: 'Open in new tab',
          defaultValue: false,
        },
      ],
    },
    linkGroup({
      appearances: ['underline'],
      overrides: {
        name: 'secondaryLinks',
        label: 'Secondary links',
        maxRows: 2,
        admin: {
          initCollapsed: true,
          description: 'Optional secondary text links shown beside the primary action.',
        },
      },
    }),
  ],
  labels: {
    plural: 'Calls to Action',
    singular: 'Call to Action',
  },
}
