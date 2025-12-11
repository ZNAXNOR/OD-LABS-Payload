import type { Page } from '@/payload-types'
import type { Payload } from 'payload'

export const header = async (payload: Payload) => {
  try {
    const pages = await payload.find({
      collection: 'pages',
      depth: 0,
      limit: 100,
    })

    const homePage = pages.docs.find((p: any) => p.slug === 'home') as Page
    const postsPage = pages.docs.find((p: any) => p.slug === 'posts') as Page

    await payload.updateGlobal({
      slug: 'header',
      data: {
        navItems: [
          {
            link: {
              type: 'reference',
              reference: {
                relationTo: 'pages',
                value: homePage?.id,
              },
              label: 'Home',
            },
          },
          {
            link: {
              type: 'reference',
              reference: {
                relationTo: 'pages',
                value: postsPage?.id,
              },
              label: 'Posts',
            },
          },
        ],
      },
    })
    console.log('Seed: Header Global seeded')
  } catch (error) {
    console.error('Seed: Error seeding Header Global', error)
  }
}
