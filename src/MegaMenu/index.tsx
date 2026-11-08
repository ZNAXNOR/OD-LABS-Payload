'use client'

import { MegaMenuHeader } from './Nav/header'
import { MegaMenuFooter } from './Nav/footer'
import { useEffect, useState } from 'react'
import { MegaMenuMain } from './main'
import { usePathname } from 'next/navigation'

import { resolveCurrentPage } from './utils/resolveCurrentPage'

import type { PagesData } from '../getPagesData'
import type { LegalPagesData } from '../getLegalPagesData'
import type { PostsData } from '../getPostsData'
import type { ContactSocial } from '@/payload-types'

interface MegaMenuProps {
  open: boolean
  onClose: () => void
  pages: PagesData[]
  legalPages: LegalPagesData[]
  posts?: PostsData[]
  contactSocials?: ContactSocial | null
}

export const MegaMenu = ({
  open,
  onClose,
  pages,
  legalPages,
  posts = [],
  contactSocials,
}: MegaMenuProps) => {
  const pathname = usePathname()
  const [activePost, setActivePost] = useState<PostsData | null>(null)

  useEffect(() => {
    if (!pathname) return
    const path = pathname.replace(/\/$/, '') || '/'
    const isPostArticle =
      path.startsWith('/posts/') &&
      path !== '/posts' &&
      !path.startsWith('/posts/page/')

    if (!isPostArticle) {
      if (activePost) setActivePost(null)
      return
    }

    const postSlug = decodeURIComponent(
      path.replace(/^\/posts\//, '').split('/')[0] || '',
    )
    if (!postSlug) return

    const preloaded = posts.find((p) => p.slug === postSlug || p.href === path)
    if (preloaded) {
      if (activePost?.slug !== preloaded.slug) {
        setActivePost(preloaded)
      }
      return
    }

    let cancelled = false
    fetch(`/api/posts?where[slug][equals]=${encodeURIComponent(postSlug)}&depth=0`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data?.docs?.[0]) return
        const doc = data.docs[0]
        setActivePost({
          title: doc.title,
          slug: doc.slug,
          href: `/posts/${doc.slug}`,
          description: doc.meta?.description || '',
          metaTitle: doc.meta?.title || null,
          metaDescription: doc.meta?.description || null,
        })
      })
      .catch(() => undefined)

    return () => {
      cancelled = true
    }
  }, [pathname, posts, activePost])

  const currentPage = resolveCurrentPage({
    pathname,
    pages,
    legalPages,
    posts,
    activePost,
  })

  useEffect(() => {
    if (!open) return

    const handleESC = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleESC)

    return () => document.removeEventListener('keydown', handleESC)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return

    // Disable scroll on body when the mega menu opens.
    const originalStyle = document.body.style.overflow

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalStyle
    }
  }, [open])

  return (
    <div
      className={[
        'fixed inset-0 z-50 bg-[#0A0A0A]',
        'flex flex-col',
        'transition-opacity duration-300',
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
      ].join(' ')}
      aria-hidden={!open}
      aria-modal="true"
    >
      <MegaMenuHeader onClose={onClose} />

      <MegaMenuMain
        pages={pages}
        currentPage={currentPage}
        contactSocials={contactSocials}
      />

      <MegaMenuFooter legalPages={legalPages} />
    </div>
  )
}
