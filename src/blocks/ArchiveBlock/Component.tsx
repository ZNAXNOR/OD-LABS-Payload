import type { Post, Page, ArchiveBlock as ArchiveBlockProps } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { IconCardArchive } from './IconCard_Archive/Component'
import { ImageCardArchive } from './ImageCard_Archive/Component'
import { ArchiveBlock as DefaultArchive } from './Default_Archive/Component'

export const ArchiveBlock: React.FC<
  ArchiveBlockProps & {
    id?: string
  }
> = async (props) => {
  const {
    categories,
    limit: limitFromProps,
    populateBy,
    selectedDocs,
    variant,
    relationTo,
    pageTypes,
  } = props

  const limit = limitFromProps || 3

  let posts: (Post | Page)[] = []

  if (populateBy === 'collection') {
    const payload = await getPayload({ config: configPromise })

    const flattenedCategories = categories?.map((category) => {
      if (typeof category === 'object') return category.id
      else return category
    })

    const flattenedPageTypes = pageTypes?.map((pageType) => {
      if (typeof pageType === 'object') return pageType.id
      else return pageType
    })

    const fetchedPosts = await payload.find({
      collection: (relationTo as 'posts' | 'pages') || 'posts',
      depth: 1,
      limit,
      where: {
        ...(relationTo === 'posts' || !relationTo
          ? flattenedCategories && flattenedCategories.length > 0
            ? {
                categories: {
                  in: flattenedCategories,
                },
              }
            : {}
          : {}),
        ...(relationTo === 'pages'
          ? flattenedPageTypes && flattenedPageTypes.length > 0
            ? {
                pageType: {
                  in: flattenedPageTypes,
                },
              }
            : {}
          : {}),
      },
    })

    posts = fetchedPosts.docs as (Post | Page)[]
  } else {
    if (selectedDocs?.length) {
      const filteredSelectedPosts = selectedDocs.map((post) => {
        if (typeof post.value === 'object') return post.value
      }) as (Post | Page)[]

      posts = filteredSelectedPosts
    }
  }

  switch (variant) {
    case 'iconCard':
      return <IconCardArchive {...props} posts={posts} relationTo={relationTo || 'posts'} />
    case 'imageCard':
      return <ImageCardArchive {...props} posts={posts} relationTo={relationTo || 'posts'} />
    default:
      return <DefaultArchive {...props} posts={posts} relationTo={relationTo || 'posts'} />
  }
}
