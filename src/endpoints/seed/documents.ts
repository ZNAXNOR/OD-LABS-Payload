import type { Payload } from 'payload'

export const documents = async (payload: Payload) => {
  try {
    await payload.create({
      collection: 'documents',
      data: {
        title: 'Privacy Policy',
        slug: 'privacy-policy',
        content: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1,
            children: [
              {
                type: 'heading',
                tag: 'h1',
                format: '',
                indent: 0,
                version: 1,
                children: [
                  {
                    mode: 'normal',
                    text: 'Privacy Policy',
                    type: 'text',
                    style: '',
                    detail: 0,
                    format: 0,
                    version: 1,
                  },
                ],
              },
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1,
                children: [
                  {
                    mode: 'normal',
                    text: 'Effective Date: January 1, 2024',
                    type: 'text',
                    style: '',
                    detail: 0,
                    format: 0,
                    version: 1,
                  },
                ],
              },
              {
                type: 'heading',
                tag: 'h2',
                format: '',
                indent: 0,
                version: 1,
                children: [
                  {
                    mode: 'normal',
                    text: '1. Introduction',
                    type: 'text',
                    style: '',
                    detail: 0,
                    format: 0,
                    version: 1,
                  },
                ],
              },
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1,
                children: [
                  {
                    mode: 'normal',
                    text: 'Welcome to ',
                    type: 'text',
                    style: '',
                    detail: 0,
                    format: 0,
                    version: 1,
                  },
                  {
                    mode: 'normal',
                    text: '{{websiteName}}',
                    type: 'text',
                    style: 'bold',
                    detail: 0,
                    format: 1,
                    version: 1,
                  },
                  {
                    mode: 'normal',
                    text: '. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website ',
                    type: 'text',
                    style: '',
                    detail: 0,
                    format: 0,
                    version: 1,
                  },
                  {
                    mode: 'normal',
                    text: '{{websiteUrl}}',
                    type: 'text',
                    style: 'bold',
                    detail: 0,
                    format: 1,
                    version: 1,
                  },
                  {
                    mode: 'normal',
                    text: ' and tell you about your privacy rights and how the law protects you.',
                    type: 'text',
                    style: '',
                    detail: 0,
                    format: 0,
                    version: 1,
                  },
                ],
              },
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1,
                children: [
                  {
                    mode: 'normal',
                    text: 'Our offices are located at: ',
                    type: 'text',
                    style: '',
                    detail: 0,
                    format: 0,
                    version: 1,
                  },
                  {
                    mode: 'normal',
                    text: '{{companyAddress}}',
                    type: 'text',
                    style: 'italic',
                    detail: 0,
                    format: 2,
                    version: 1,
                  },
                ],
              },
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1,
                children: [
                  {
                    mode: 'normal',
                    text: 'You can contact us at: ',
                    type: 'text',
                    style: '',
                    detail: 0,
                    format: 0,
                    version: 1,
                  },
                  {
                    mode: 'normal',
                    text: '{{companyContact}}',
                    type: 'text',
                    style: 'italic',
                    detail: 0,
                    format: 2,
                    version: 1,
                  },
                ],
              },
            ],
            direction: 'ltr',
          },
        } as any,
        _status: 'published',
      },
    })

    await payload.create({
      collection: 'documents',
      data: {
        title: 'Terms of Service',
        slug: 'terms-of-service',
        content: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1,
            children: [
              {
                type: 'heading',
                tag: 'h1',
                format: '',
                indent: 0,
                version: 1,
                children: [
                  {
                    mode: 'normal',
                    text: 'Terms of Service',
                    type: 'text',
                    style: '',
                    detail: 0,
                    format: 0,
                    version: 1,
                  },
                ],
              },
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1,
                children: [
                  {
                    mode: 'normal',
                    text: 'By accessing this website, you agree to be bound by these Terms and Conditions of Use, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.',
                    type: 'text',
                    style: '',
                    detail: 0,
                    format: 0,
                    version: 1,
                  },
                ],
              },
            ],
            direction: 'ltr',
          },
        } as any,
        _status: 'published',
      },
    })

    console.log('Seed: Documents seeded')
  } catch (error) {
    console.error('Seed: Error seeding Documents', error)
  }
}
