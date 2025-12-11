import type { Page } from '@/payload-types'
import type { Payload } from 'payload'

export const contact = async (payload: Payload) => {
  try {
    // Find the contact page if it exists based on the seed
    const pages = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: 'contact',
        },
      },
    })

    const contactPage = pages.docs[0] as Page | undefined

    await payload.updateGlobal({
      slug: 'contact',
      data: {
        offices: [
          {
            label: 'Headquarters',
            street: '123 Innovation Drive',
            city: 'Tech City',
            state: 'CA',
            postalCode: '94000',
            country: 'USA',
            email: 'hello@example.com',
            phone: '+1 (555) 0123-4567',
          },
          {
            label: 'London Office',
            street: '456 Creative Lane',
            city: 'London',
            state: '',
            postalCode: 'SW1A 1AA',
            country: 'UK',
            email: 'london@example.com',
            phone: '+44 20 7123 4567',
          },
        ],
        email: 'info@example.com',
        phone: '+1 (555) 987-6543',
        contactPageLink: contactPage
          ? {
              type: 'reference',
              label: 'Contact Us',
              reference: {
                relationTo: 'pages',
                value: contactPage.id,
              },
            }
          : undefined,
        workingHours: [
          {
            day: 'monday',
            openTime: '2000-01-01T09:00:00.000Z', // Time part matters
            closeTime: '2000-01-01T17:00:00.000Z',
          },
          {
            day: 'tuesday',
            openTime: '2000-01-01T09:00:00.000Z',
            closeTime: '2000-01-01T17:00:00.000Z',
          },
          {
            day: 'wednesday',
            openTime: '2000-01-01T09:00:00.000Z',
            closeTime: '2000-01-01T17:00:00.000Z',
          },
          {
            day: 'thursday',
            openTime: '2000-01-01T09:00:00.000Z',
            closeTime: '2000-01-01T17:00:00.000Z',
          },
          {
            day: 'friday',
            openTime: '2000-01-01T09:00:00.000Z',
            closeTime: '2000-01-01T16:00:00.000Z',
          },
        ],
        socialLinks: [
          {
            platform: 'twitter',
            url: 'https://twitter.com/payloadcms',
          },
          {
            platform: 'github',
            url: 'https://github.com/payloadcms/payload',
          },
          {
            platform: 'linkedin',
            url: 'https://linkedin.com/company/payloadcms',
          },
        ],
      } as any,
    })
    console.log('Seed: Contact Global seeded')
  } catch (error) {
    console.error('Seed: Error seeding Contact Global', error)
  }
}
