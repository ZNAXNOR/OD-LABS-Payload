'use client'

import React from 'react'
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import type { Post, Page, ArchiveBlock as ArchiveBlockProps } from '@/payload-types'
import { cn } from '@/utilities/ui'
import RichText from '@/components/RichText'
import { Button } from '@/components/ui/button'
import { ArchiveImageCard } from './card'

export const ImageCardArchive: React.FC<
  ArchiveBlockProps & {
    posts?: (Post | Page)[]
    relationTo?: 'posts' | 'pages'
  }
> = ({ posts, introContent, relationTo = 'posts' }) => {
  const getGridClasses = (index: number) => {
    const pattern = index % 5
    switch (pattern) {
      case 0:
        return 'md:col-span-2 md:row-span-2 aspect-[1/1] md:aspect-auto'
      case 1:
        return 'md:col-span-1 md:row-span-1 aspect-[1/1]'
      case 2:
        return 'md:col-span-1 md:row-span-1 aspect-[1/1]'
      case 3:
        return 'md:col-span-1 md:row-span-2 aspect-[1/1] md:aspect-auto'
      case 4:
        return 'md:col-span-2 md:row-span-1 aspect-[2/1]'
      default:
        return 'md:col-span-1 md:row-span-1 aspect-[1/1]'
    }
  }

  return (
    <section className={cn('py-32')}>
      <div className="container grid grid-cols-1 gap-10 lg:gap-40 lg:grid-cols-3">
        {/* Intro Section - Sidebar style on large screens */}
        <div className="flex flex-col justify-between lg:col-span-1 lg:sticky lg:top-32 h-fit">
          <div>
            {introContent && <RichText className="mb-4" data={introContent} enableGutter={false} />}
          </div>
          <Button variant="outline" className="mt-8 w-fit" asChild>
            <Link href={`/${relationTo}`}>
              View all <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Bento Grid Section */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[200px] md:auto-rows-[250px]">
          {posts?.map((post, idx) => (
            <ArchiveImageCard
              key={idx}
              post={post}
              className={getGridClasses(idx)}
              relationTo={relationTo}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
