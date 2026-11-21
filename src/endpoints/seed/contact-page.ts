import { buildEditorState } from '@payloadcms/richtext-lexical'
import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Form, FormBlock } from '@/payload-types'

type ContactDescription = NonNullable<NonNullable<FormBlock['multiForms']>[number]['description']>

const headingAndTextToLexical = (heading: string, text: string): ContactDescription =>
  buildEditorState<ContactDescription>({
    nodes: [
      {
        type: 'heading',
        children: [
          {
            type: 'text',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: heading,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        tag: 'h3',
        version: 1,
      },
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
  })

type ContactArgs = {
  generalForm: Form
  projectInquiryForm: Form
}

export const contact: (args: ContactArgs) => RequiredDataFromCollectionSlug<'pages'> = ({
  generalForm,
  projectInquiryForm,
}) => ({
  slug: 'contact',
  _status: 'published',
  hero: {
    type: 'none',
  },
  layout: [
    {
      blockType: 'formBlock',
      enableIntro: true,
      variant: 'multi',
      singleForm: null,
      multiForms: [
        {
          form: generalForm,
          description: headingAndTextToLexical('General Enquiry', 'For general questions, support, and other enquiries.'),
        },
        {
          form: projectInquiryForm,
          description: headingAndTextToLexical('Project Inquiry', 'Tell us about the project you are planning.'),
        },
      ],
      introContent: {
        root: {
          type: 'root',
          children: [
            {
              type: 'heading',
              children: [
                {
                  type: 'text',
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'Tell us what you are working on.',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              tag: 'h2',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
    },
  ],
  title: 'Contact',
})
