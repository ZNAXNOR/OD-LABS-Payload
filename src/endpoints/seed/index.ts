import type { CollectionSlug, GlobalSlug, Payload, PayloadRequest, File } from 'payload'

import { contactForm as contactFormData } from './contact-form'
import { contact as contactPageData } from './contact-page'
import { home } from './home'
import { image1 } from './image-1'
import { image2 } from './image-2'
import { imageHero1 } from './image-hero-1'
import { post1 } from './post-1'
import { post2 } from './post-2'
import { post3 } from './post-3'

const collections: CollectionSlug[] = [
  'categories',
  'media',
  'pages',
  'posts',
  'forms',
  'form-submissions',
  'search',
]

const globals: GlobalSlug[] = ['header', 'footer']

const categories = ['Technology', 'News', 'Finance', 'Design', 'Software', 'Engineering']

// Next.js revalidation errors are normal when seeding the database without a server running
// i.e. running `yarn seed` locally instead of using the admin UI within an active app
// The app is not running to revalidate the pages and so the API routes are not available
// These error messages can be ignored: `Error hitting revalidate route for...`
export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding database...')

  // we need to clear the media directory before seeding
  // as well as the collections and globals
  // this is because while `yarn seed` drops the database
  // the custom `/api/seed` endpoint does not
  payload.logger.info(`— Clearing collections and globals...`)

  // clear the database
  await Promise.all(
    globals.map((global) =>
      payload.updateGlobal({
        slug: global,
        data: {
          navItems: [],
        } as any,
        depth: 0,
        context: {
          disableRevalidate: true,
        },
      }),
    ),
  )

  await Promise.all(
    collections.map((collection) => payload.db.deleteMany({ collection, req, where: {} })),
  )

  await Promise.all(
    collections
      .filter((collection) => Boolean(payload.collections[collection].config.versions))
      .map((collection) => payload.db.deleteVersions({ collection, req, where: {} })),
  )

  payload.logger.info(`— Seeding demo author and user...`)

  await payload.delete({
    collection: 'users',
    depth: 0,
    where: {
      email: {
        equals: 'demo-author@example.com',
      },
    },
  })

  payload.logger.info(`— Seeding media...`)

  const [image1Buffer, image2Buffer, image3Buffer, hero1Buffer] = await Promise.all([
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/3.x/templates/website/src/endpoints/seed/image-post1.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/3.x/templates/website/src/endpoints/seed/image-post2.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/3.x/templates/website/src/endpoints/seed/image-post3.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/3.x/templates/website/src/endpoints/seed/image-hero1.webp',
    ),
  ])

  const [demoAuthor, image1Doc, image2Doc, image3Doc, imageHomeDoc] = await Promise.all([
    payload.create({
      collection: 'users',
      data: {
        name: 'Demo Author',
        email: 'demo-author@example.com',
        password: 'password',
      },
    }),
    payload.create({
      collection: 'media',
      data: image1,
      file: image1Buffer,
    }),
    payload.create({
      collection: 'media',
      data: image2,
      file: image2Buffer,
    }),
    payload.create({
      collection: 'media',
      data: image2,
      file: image3Buffer,
    }),
    payload.create({
      collection: 'media',
      data: imageHero1,
      file: hero1Buffer,
    }),
    categories.map((category) =>
      payload.create({
        collection: 'categories',
        data: {
          title: category,
          slug: category,
        },
      }),
    ),
  ])

  payload.logger.info(`— Seeding posts...`)

  // Do not create posts with `Promise.all` because we want the posts to be created in order
  // This way we can sort them by `createdAt` or `publishedAt` and they will be in the expected order
  const post1Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: post1({ heroImage: image1Doc, blockImage: image2Doc, author: demoAuthor }),
  })

  const post2Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: post2({ heroImage: image2Doc, blockImage: image3Doc, author: demoAuthor }),
  })

  const post3Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: post3({ heroImage: image3Doc, blockImage: image1Doc, author: demoAuthor }),
  })

  // update each post with related posts
  await payload.update({
    id: post1Doc.id,
    collection: 'posts',
    data: {
      relatedPosts: [post2Doc.id, post3Doc.id],
    },
  })
  await payload.update({
    id: post2Doc.id,
    collection: 'posts',
    data: {
      relatedPosts: [post1Doc.id, post3Doc.id],
    },
  })
  await payload.update({
    id: post3Doc.id,
    collection: 'posts',
    data: {
      relatedPosts: [post1Doc.id, post2Doc.id],
    },
  })

  payload.logger.info(`— Seeding contact form...`)

  const contactForm = await payload.create({
    collection: 'forms',
    depth: 0,
    data: {
      ...contactFormData,
      title: 'General Contact',
      formLayout: 'standard',
      fields: [
        {
          name: 'fullName',
          blockName: 'fullName',
          blockType: 'text',
          label: 'Full Name',
          required: true,
          width: 100,
        },
        {
          name: 'email',
          blockName: 'email',
          blockType: 'email',
          label: 'Email',
          required: true,
          width: 100,
        },
        {
          name: 'subject',
          blockName: 'subject',
          blockType: 'text',
          label: 'Subject',
          required: false,
          width: 100,
        },
        {
          name: 'message',
          blockName: 'message',
          blockType: 'textarea',
          label: 'Message',
          required: true,
          width: 100,
        },
      ],
      steps: [],
    },
  })

  const projectInquiryForm = await payload.create({
    collection: 'forms',
    depth: 0,
    data: {
      title: 'Project Inquiry',
      formLayout: 'multiStep',
      confirmationType: 'message',
      confirmationMessage: contactFormData.confirmationMessage,
      submitButtonLabel: 'Submit inquiry',
      previewStep: {
        title: 'Review & submit',
      },
      fields: [],
      steps: [
        {
          title: 'About You',
          description: {"root":{"type":"root","children":[{"type":"paragraph","children":[{"type":"text","detail":0,"format":0,"mode":"normal","style":"","text":"Tell us how to reach you.","version":1}],"direction":"ltr","format":"","indent":0,"textFormat":0,"textStyle":"","version":1}],"direction":"ltr","format":"","indent":0,"version":1}},
          fields: [
            { blockType: 'text', name: 'fullName', label: 'Full Name', required: true, width: 100 },
            { blockType: 'email', name: 'workEmail', label: 'Work Email', required: true, width: 100 },
            { blockType: 'text', name: 'company', label: 'Company / Organization', required: false, width: 100 },
          ],
        },
        {
          title: 'Project',
          description: {"root":{"type":"root","children":[{"type":"paragraph","children":[{"type":"text","detail":0,"format":0,"mode":"normal","style":"","text":"What are you looking to build or improve?","version":1}],"direction":"ltr","format":"","indent":0,"textFormat":0,"textStyle":"","version":1}],"direction":"ltr","format":"","indent":0,"version":1}},
          fields: [
            {
              blockType: 'select',
              name: 'projectType',
              label: 'Project Type',
              required: true,
              options: [
                { label: 'Website', value: 'website' },
                { label: 'Web application', value: 'web-application' },
                { label: 'Automation', value: 'automation' },
                { label: 'Data / reporting', value: 'data-reporting' },
                { label: 'Technical assistance', value: 'technical-assistance' },
                { label: 'Something else', value: 'other' },
              ],
            },
            {
              blockType: 'radio',
              name: 'projectStage',
              label: 'Project Stage',
              required: true,
              options: [
                { label: 'Early idea', value: 'early-idea' },
                { label: 'Planning / scoped', value: 'planning' },
                { label: 'Existing product', value: 'existing-product' },
                { label: 'Rebuild / improvement', value: 'rebuild' },
              ],
            },
          ],
        },
        {
          title: 'Scope',
          description: {"root":{"type":"root","children":[{"type":"paragraph","children":[{"type":"text","detail":0,"format":0,"mode":"normal","style":"","text":"Share your expected budget and timeline, if known.","version":1}],"direction":"ltr","format":"","indent":0,"textFormat":0,"textStyle":"","version":1}],"direction":"ltr","format":"","indent":0,"version":1}},
          fields: [
            { blockType: 'select', name: 'budget', label: 'Budget', required: false, options: [
              { label: 'Not decided', value: 'undecided' },
              { label: 'Under $1,000', value: 'under-1000' },
              { label: '$1,000–$5,000', value: '1000-5000' },
              { label: '$5,000–$15,000', value: '5000-15000' },
              { label: '$15,000+', value: '15000-plus' },
            ] },
            { blockType: 'select', name: 'timeline', label: 'Timeline', required: false, options: [
              { label: 'Flexible', value: 'flexible' },
              { label: 'Within 1 month', value: '1-month' },
              { label: '1–3 months', value: '1-3-months' },
              { label: '3+ months', value: '3-plus-months' },
              { label: 'ASAP', value: 'asap' },
            ] },
            { blockType: 'date', name: 'launchDate', label: 'Target Launch Date', required: false },
          ],
        },
        {
          title: 'Goals',
          description: {"root":{"type":"root","children":[{"type":"paragraph","children":[{"type":"text","detail":0,"format":0,"mode":"normal","style":"","text":"Describe the project and what success would look like.","version":1}],"direction":"ltr","format":"","indent":0,"textFormat":0,"textStyle":"","version":1}],"direction":"ltr","format":"","indent":0,"version":1}},
          fields: [
            { blockType: 'textarea', name: 'summary', label: 'Project Summary', required: true, width: 100 },
            { blockType: 'textarea', name: 'successCriteria', label: 'Success Criteria', required: false, width: 100 },
          ],
        },
      ],
      emails: [
        {
          emailFrom: '"OD LABS" <omkar@notifications.odtechlab.com>',
          emailTo: '{{workEmail}}',
          subject: 'We received your project inquiry',
          message: contactFormData.confirmationMessage,
        },
        {
          emailFrom: '"OD LABS" <omkar@notifications.odtechlab.com>',
          emailTo: 'omkar@odtechlab.com',
          subject: 'New OD LABS project inquiry',
          message: contactFormData.confirmationMessage,
        },
      ],
    },
  })

  payload.logger.info(`— Seeding pages...`)

  const [_, contactPage] = await Promise.all([
    payload.create({
      collection: 'pages',
      depth: 0,
      data: home({ heroImage: imageHomeDoc, metaImage: image2Doc }),
    }),
    payload.create({
      collection: 'pages',
      depth: 0,
      data: contactPageData({ generalForm: contactForm, projectInquiryForm }),
    }),
  ])

  payload.logger.info(`— Seeding globals...`)

  await Promise.all([
    payload.updateGlobal({
      slug: 'header',
      data: {
        navItems: [
          {
            link: {
              type: 'custom',
              label: 'Posts',
              url: '/posts',
            },
          },
          {
            link: {
              type: 'reference',
              label: 'Contact',
              reference: {
                relationTo: 'pages',
                value: contactPage.id,
              },
            },
          },
        ],
      },
    }),
    payload.updateGlobal({
      slug: 'footer',
      data: {
        navItems: [
          {
            link: {
              type: 'custom',
              label: 'Admin',
              url: '/admin',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Source Code',
              newTab: true,
              url: 'https://github.com/payloadcms/payload/tree/3.x/templates/website',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Payload',
              newTab: true,
              url: 'https://payloadcms.com/',
            },
          },
        ],
      },
    }),
    payload.updateGlobal({
      slug: 'contact-socials',
      data: {
        contactActions: [
          {
            link: {
              type: 'custom',
              url: 'mailto:omkar@notifications.odtechlab.com',
              label: 'Email us',
            },
            enabled: true,
          },
          {
            link: {
              type: 'custom',
              url: 'https://cal.com/od-omkar-dalvi/30min',
              newTab: true,
              label: 'Schedule a meeting',
            },
            enabled: true,
          },
        ],
        socialLinks: [
          {
            profile: 'omkar-dalvi',
            platform: 'linkedin',
            url: 'https://linkedin.com/in/omkar-dalvi',
            enabled: true,
          },
          {
            profile: 'od-labs',
            platform: 'github',
            url: 'https://github.com/od-labs',
            enabled: true,
          },
          {
            profile: 'omkar-dalvi',
            platform: 'x',
            url: 'https://x.com/omkardalvi',
            enabled: true,
          },
        ],
      },
    }),
  ])

  payload.logger.info('Seeded database successfully!')
}

async function fetchFileByURL(url: string): Promise<File> {
  const res = await fetch(url, {
    credentials: 'include',
    method: 'GET',
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch file from ${url}, status: ${res.status}`)
  }

  const data = await res.arrayBuffer()

  return {
    name: url.split('/').pop() || `file-${Date.now()}`,
    data: Buffer.from(data),
    mimetype: `image/${url.split('.').pop()}`,
    size: data.byteLength,
  }
}
