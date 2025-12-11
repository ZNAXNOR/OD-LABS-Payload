import type { Page } from '@/payload-types'
import type { Payload } from 'payload'

export const footer = async (payload: Payload) => {
  try {
    const pages = await payload.find({
      collection: 'pages',
      depth: 0,
      limit: 100,
    })

    const contactPage = pages.docs.find((p: any) => p.slug === 'contact') as Page

    await payload.updateGlobal({
      slug: 'footer',
      data: {
        ctaHeading: 'Get started',
        ctaTitle: 'Ready to dive in? Start your free trial today.',
        ctaDescription: "Get the cheat codes for selling and unlock your team's revenue potential.",
        ctaButton: {
          link: {
            type: 'reference',
            reference: {
              relationTo: 'pages',
              value: contactPage?.id,
            },
            label: 'Contact Us!',
          },
        },
        linkColumns: [
          {
            columnHeading: 'Product',
            links: [
              {
                link: {
                  type: 'custom',
                  url: '#',
                  label: 'Features',
                },
              },
              {
                link: {
                  type: 'custom',
                  url: '#',
                  label: 'Integrations',
                },
              },
              {
                link: {
                  type: 'custom',
                  url: '#',
                  label: 'Pricing',
                },
              },
            ],
          },
          {
            columnHeading: 'Company',
            links: [
              {
                link: {
                  type: 'custom',
                  url: '#',
                  label: 'About',
                },
              },
              {
                link: {
                  type: 'custom',
                  url: '#',
                  label: 'Careers',
                },
              },
              {
                link: {
                  type: 'custom',
                  url: '#',
                  label: 'Blog',
                },
              },
            ],
          },
        ],
        copyrightText: '© 2025 Radiant Inc.',
      },
    })
    console.log('Seed: Footer Global seeded')
  } catch (error) {
    console.error('Seed: Error seeding Footer Global', error)
  }
}
