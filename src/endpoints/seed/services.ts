import type { Payload } from 'payload'

export const services = async (payload: Payload) => {
  try {
    await payload.create({
      collection: 'services',
      data: {
        title: 'Digital Transformation',
        slug: 'digital-transformation',
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
                    text: 'Digital Transformation',
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
                    text: 'We help businesses evolve by integrating digital technologies into all areas of their business, fundamentally changing how they operate and deliver value to customers.',
                    type: 'text',
                    style: '',
                    detail: 0,
                    format: 0,
                    version: 1,
                  },
                ],
              },
              {
                type: 'block',
                format: '',
                version: 2,
                fields: {
                  link: {
                    type: 'custom',
                    url: '/contact',
                    label: 'Get Started',
                    appearance: 'default',
                  },
                  blockName: 'CTA',
                  blockType: 'cta',
                },
              },
            ],
            direction: 'ltr',
          },
        } as any,
        _status: 'published',
      },
    })

    await payload.create({
      collection: 'services',
      data: {
        title: 'Custom Software Development',
        slug: 'software-development',
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
                    text: 'Custom Software Development',
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
                    text: 'Tailored solutions to meet your specific business needs. From initial concept to deployment and maintenance, we cover the full software development lifecycle.',
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

    console.log('Seed: Services seeded')
  } catch (error) {
    console.error('Seed: Error seeding Services', error)
  }
}
