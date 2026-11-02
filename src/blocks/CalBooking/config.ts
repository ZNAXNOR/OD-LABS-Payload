import type { Block } from 'payload'
import {
  InlineToolbarFeature,
  ParagraphFeature,
  TextStateFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { textStateConfig } from '@/fields/textStateConfig'

const bookingCopyEditor = lexicalEditor({
  features: [ParagraphFeature(), TextStateFeature({ state: textStateConfig }), InlineToolbarFeature()],
})

const paragraph = (text: string) => ({
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        textFormat: 0,
        textStyle: '',
        version: 1,
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  },
})

export const CalBooking: Block = {
  slug: 'calBooking',
  interfaceName: 'CalBookingBlock',
  labels: {
    singular: 'Cal.com Booking',
    plural: 'Cal.com Booking',
  },
  fields: [
    {
      name: 'options',
      type: 'array',
      label: 'Booking options',
      minRows: 1,
      maxRows: 3,
      defaultValue: [
        {
          heading: paragraph('15-minute introduction'),
          description: paragraph('15 minutes'),
          calLink: 'od-omkar-dalvi/15min',
          directLink: 'https://cal.com/od-omkar-dalvi/15min',
        },
        {
          heading: paragraph('30-minute consultation'),
          description: paragraph('30 minutes'),
          calLink: 'od-omkar-dalvi/30min',
          directLink: 'https://cal.com/od-omkar-dalvi/30min',
        },
      ],
      labels: {
        singular: 'Booking option',
        plural: 'Booking options',
      },
      admin: {
        description:
          'Add up to three event types. Header and description sizes are fixed on the frontend; use Text State colors to adjust their colors.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'heading',
          type: 'richText',
          label: 'Header',
          required: true,
          editor: bookingCopyEditor,
          defaultValue: paragraph('New booking option'),
        },
        {
          name: 'description',
          type: 'richText',
          label: 'Description',
          required: true,
          editor: bookingCopyEditor,
          defaultValue: paragraph('Choose a time that works for you.'),
        },
        {
          name: 'calLink',
          type: 'text',
          label: 'Cal.com event path',
          required: true,
          admin: {
            description: 'Example: od-omkar-dalvi/30min',
          },
        },
        {
          name: 'directLink',
          type: 'text',
          label: 'Direct booking URL (optional)',
          admin: {
            description:
              'When provided, a fixed “Open Cal.com directly” link appears below the calendar. Leave empty to hide it.',
          },
        },
      ],
    },
  ],
}
