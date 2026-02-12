import type { Post, Page, ArchiveBlock as ArchiveBlockProps } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import RichText from '@/components/RichText'

import { CollectionArchive } from '@/components/CollectionArchive'

export const ArchiveBlock: React.FC<
  ArchiveBlockProps & {
    id?: string
    posts?: (Post | Page)[]
    relationTo?: 'posts' | 'pages'
  }
> = async (props) => {
  const {
    id,
    categories,
    introContent,
    limit: limitFromProps,
    populateBy,
    selectedDocs,
    posts: postsFromProps,
    relationTo = 'posts',
  } = props

  const limit = limitFromProps || 3

  let posts: (Post | Page)[] = postsFromProps || []

  if (!postsFromProps) {
    if (populateBy === 'collection') {
      const payload = await getPayload({ config: configPromise })

      const flattenedCategories = categories?.map((category) => {
        if (typeof category === 'object') return category.id
        else return category
      })

      const fetchedPosts = await payload.find({
        collection: (relationTo as 'posts' | 'pages') || 'posts',
        depth: 1,
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

      posts = fetchedPosts.docs as (Post | Page)[]
    } else {
      if (selectedDocs?.length) {
        const filteredSelectedPosts = selectedDocs.map((post) => {
          if (typeof post.value === 'object') return post.value
        }) as (Post | Page)[]

        posts = filteredSelectedPosts
      }
    }
  }

  return (
    <div className="my-16" id={`block-${id}`}>
      {introContent && (
        <div className="container mb-16">
          <RichText className="ms-0 max-w-[48rem]" data={introContent} enableGutter={false} />
        </div>
      )}
      <CollectionArchive posts={posts as any} relationTo={relationTo} />
    </div>
  )
}
