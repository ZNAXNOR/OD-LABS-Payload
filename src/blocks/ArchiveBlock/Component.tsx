import type { Post, Document, Service, ArchiveBlock as ArchiveBlockProps } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import RichText from '@/components/RichText'

import { CollectionArchive } from '@/components/CollectionArchive'

export const ArchiveBlock: React.FC<
  ArchiveBlockProps & {
    id?: string
  }
> = async (props) => {
  const {
    id,
    categories,
    introContent,
    limit: limitFromProps,
    populateBy,
    relationTo,
    selectedDocs,
  } = props

  const limit = limitFromProps || 3

  let posts: (Post | Document | Service)[] = []

  if (populateBy === 'collection') {
    const payload = await getPayload({ config: configPromise })

    const flattenedCategories = categories?.map((category) => {
      if (typeof category === 'object') return category.id
      else return category
    })

    // This is an optimization to only fetch the fields that are needed for the card
    // 1. Fetch posts with depth 0 to avoid populating any relations
    // 2. Collect all category and media IDs from the posts
    // 3. Fetch all categories and media in parallel
    // 4. Stitch the data back together
    const fetchedPosts = await payload.find({
      collection: relationTo || 'posts',
      depth: 0,
      limit,
      ...(flattenedCategories && flattenedCategories.length > 0
        ? {
            where: {
              categories: {
                in: flattenedCategories,
              },
            },
          }
        : {}),
    })

    const docs = fetchedPosts.docs

    const categoryIDs = new Set<string>()
    const mediaIDs = new Set<string>()

    docs.forEach((doc) => {
      const { categories, meta } = doc
      if (categories) {
        categories.forEach((category) => {
          const id = typeof category === 'string' ? category : category.id
          if (id) categoryIDs.add(id)
        })
      }
      if (meta?.image) {
        const id = typeof meta.image === 'string' ? meta.image : meta.image.id
        if (id) mediaIDs.add(id)
      }
    })

    const [categoriesData, mediaData] = await Promise.all([
      payload.find({
        collection: 'categories',
        where: { id: { in: Array.from(categoryIDs) } },
        pagination: false,
        depth: 0,
      }),
      payload.find({
        collection: 'media',
        where: { id: { in: Array.from(mediaIDs) } },
        pagination: false,
        depth: 0,
      }),
    ])

    const categoriesMap = new Map(categoriesData.docs.map((c) => [c.id, c]))
    const mediaMap = new Map(mediaData.docs.map((m) => [m.id, m]))

    posts = docs.map((doc) => {
      const { categories, meta } = doc

      const populatedCategories =
        categories
          ?.map((cat) => {
            const id = typeof cat === 'string' ? cat : cat.id
            return categoriesMap.get(id)
          })
          .filter(Boolean) || []

      const imageID = meta?.image ? (typeof meta.image === 'string' ? meta.image : meta.image.id) : null
      const populatedImage = imageID ? mediaMap.get(imageID) : null

      return {
        ...doc,
        categories: populatedCategories,
        meta: {
          ...(meta || {}),
          image: populatedImage,
        },
      }
    }) as (Post | Document | Service)[]
  } else {
    if (selectedDocs?.length) {
      const filteredSelectedPosts = selectedDocs.map((post) => {
        if (typeof post.value === 'object') return post.value
      }) as (Post | Document | Service)[]

      posts = filteredSelectedPosts
    }
  }

  return (
    <div className="my-16" id={`block-${id}`}>
      {introContent && (
        <div className="container mb-16">
          <RichText className="ms-0 max-w-[48rem]" data={introContent} enableGutter={false} />
        </div>
      )}
      <CollectionArchive posts={posts} relationTo={relationTo || 'posts'} />
    </div>
  )
}
