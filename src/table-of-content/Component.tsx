'use client'

import type { RequiredDataFromCollectionSlug } from 'payload'
import { getClientSideURL } from '@/utilities/getURL'
import { cn } from '@/utilities/ui'
import { useLivePreview } from '@payloadcms/live-preview-react'
import { ArrowRight, HashIcon, List, X } from 'lucide-react'
import { ComponentProps, useEffect, useRef, useState } from 'react'
import { CompletionCard } from './CompletionCard'

type Props = ComponentProps<'div'> & {
  post: RequiredDataFromCollectionSlug<'posts'> | RequiredDataFromCollectionSlug<'documents'>
}

export const TableOfContents = ({ className, post: initialPost, ...props }: Props) => {
  const { data: post } = useLivePreview({
    initialData: initialPost,
    serverURL: getClientSideURL(),
  })

  const [activeId, setActiveId] = useState<string>('')
  const [isAtBottom, setIsAtBottom] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [showMobileTrigger, setShowMobileTrigger] = useState(false)
  const tocRef = useRef<HTMLDivElement>(null)

  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
  }

  const headings = post.content.root.children.filter((child: any) => {
    return (
      child.type === 'heading' &&
      (child.tag === 'h2' || child.tag === 'h3') &&
      child.children &&
      child.children[0]
    )
  })

  const onHeadingClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const headerOffset = 100
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
      setIsDrawerOpen(false)
    }
  }

  // 1. Assign IDs
  useEffect(() => {
    const headingElements = Array.from(
      (document.querySelector('article') ?? document).querySelectorAll('h2, h3'),
    )
    headingElements.forEach((element) => {
      const slug = slugify(element.textContent || '')
      element.id = slug
    })
  }, [post.content])

  // 2. Observer for Active ID
  useEffect(() => {
    const headingElements = Array.from(
      (document.querySelector('article') ?? document).querySelectorAll('h2, h3'),
    )

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-100px 0px -60% 0px',
        threshold: 0,
      },
    )

    headingElements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [post.content])

  // 3. Scroll Handler for Bottom Detection
  useEffect(() => {
    const handleScroll = () => {
      const marker = document.getElementById('article-end-marker')
      if (marker) {
        const rect = marker.getBoundingClientRect()
        // Trigger when the marker is visible in the viewport or scrolled past it.
        // rect.top is the distance from the viewport top to the element.
        // If rect.top < window.innerHeight, the element is somewhere in the viewport (or above it).
        // Check if we are past the TOC as well? No, just end of article.
        setIsAtBottom(rect.top <= window.innerHeight)
      } else {
        // Fallback for pages without the marker
        const scrollPosition = window.scrollY + window.innerHeight
        const totalHeight = document.documentElement.scrollHeight
        setIsAtBottom(totalHeight - scrollPosition < 50)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 4. Observer for Mobile Trigger Visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show trigger if Scrolled Past (top < 0) AND Not Intersecting
        setShowMobileTrigger(entry.boundingClientRect.top < 0 && !entry.isIntersecting)
      },
      { threshold: 0 },
    )

    if (tocRef.current) observer.observe(tocRef.current)
    return () => observer.disconnect()
  }, [])

  /* Ref for list container to calculate item positions */
  const listRef = useRef<HTMLUListElement>(null)
  const [indicatorTop, setIndicatorTop] = useState<number>(0)

  useEffect(() => {
    if (isAtBottom && listRef.current) {
      return
    }

    if (activeId && listRef.current) {
      const activeLink = Array.from(listRef.current.children).find((child) => {
        return (child as HTMLElement).getAttribute('href') === `#${activeId}`
      }) as HTMLElement

      if (activeLink) {
        const top = activeLink.offsetTop + activeLink.offsetHeight / 2
        setIndicatorTop(top)
      }
    } else if (!activeId) {
      setIndicatorTop(0)
    }
  }, [activeId, isAtBottom])

  const renderListItems = () => {
    return headings.map((child: any, i: number) => {
      const text = child.children[0].text
      const id = slugify(text)
      const isActive = activeId === id && !isAtBottom

      return (
        <a
          key={i}
          onClick={(e) => {
            e.preventDefault()
            onHeadingClick(id)
            setActiveId(id)
          }}
          href={`#${id}`}
          className={cn(
            'group duration-xs flex border-none border-transparent px-2 transition-colors ease-in-out relative',
            isActive ? 'bg-surface-soft border-border' : '',
            'hover:bg-surface-soft hover:border-border',
          )}
        >
          <li
            data-active={isActive}
            className={cn(
              'duration-xs inline-flex gap-1 py-0.5 hover:text-od-brand-primary text-sm leading-none font-[350] tracking-tight decoration-transparent transition-colors ease-in-out',
              'group-hover:decoration-foreground',
              isActive
                ? 'decoration-foreground hover:text-od-brand-primary text-foreground font-bold'
                : '',
            )}
          >
            {isActive ? (
              <ArrowRight className="mt-[0.1lh] size-[0.8lh]" />
            ) : (
              <HashIcon className="mt-[0.1lh] size-[0.8lh]" />
            )}
            <span>{text}</span>
          </li>
        </a>
      )
    })
  }

  return (
    <div className={cn('flex flex-col gap-4', className)} {...props} ref={tocRef}>
      <h3 className="font-semibold text-xl">Table Of Content</h3>
      <div className="flex flex-row gap-2 relative">
        {/* Left Column: Progress Bar (Hidden in sticky drawer usually, but visible in main component) */}
        <div className="flex flex-col items-center pt-2 w-[10px]">
          <div className="w-[2px] bg-border relative flex-1 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 w-full bg-od-brand-primary transition-all duration-300 ease-in-out rounded-full"
              style={{
                height: isAtBottom ? '100%' : `${indicatorTop}px`,
                maxHeight: '100%',
              }}
            />
          </div>
        </div>

        {/* Right Column: List + Card */}
        <div className="flex flex-col flex-1 gap-4">
          <ul
            ref={listRef}
            className="divide-border-soft list-none divide-y *:py-1.5 flex-1 relative"
          >
            {renderListItems()}
          </ul>

          {/* Completion Card (Desktop: Sidebar / Mobile: Hidden here, shows fixed at bottom) */}
          <div className="hidden lg:block">
            <CompletionCard isAtBottom={isAtBottom} className="-ml-11" />
          </div>
        </div>
      </div>

      {/* --- Mobile Fixed Elements --- */}

      {/* 1. Mobile Sticky Trigger */}
      <div
        className={cn(
          'fixed bottom-6 min-w-80 left-1/2 -translate-x-1/2 z-30 lg:hidden transition-all duration-300',
          showMobileTrigger && !isAtBottom && !isDrawerOpen
            ? 'translate-y-0 opacity-100'
            : 'translate-y-[200%] opacity-0 pointer-events-none',
        )}
      >
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="bg-foreground text-background px-6 py-3 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] font-medium text-sm flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <List className="size-4" />
          <span>Table of Contents</span>
        </button>
      </div>

      {/* 2. Mobile Drawer Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 lg:hidden transition-all duration-300 bg-black/40 backdrop-blur-[2px]',
          isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
        onClick={() => setIsDrawerOpen(false)}
      >
        <div
          className={cn(
            'absolute bottom-0 left-0 right-0 bg-background border-t border-border rounded-t-2xl p-6 shadow-2xl transition-transform duration-300 max-h-[70vh] overflow-y-auto',
            isDrawerOpen ? 'translate-y-0' : 'translate-y-full',
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6 sticky top-0 bg-background z-10 pb-2 border-b border-border/50">
            <h3 className="font-semibold text-lg">Table of Contents</h3>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 -mr-2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-5" />
            </button>
          </div>
          <ul className="divide-border-soft list-none divide-y *:py-2 flex-1 pb-8">
            {renderListItems()}
          </ul>
        </div>
      </div>

      {/* 3. Mobile Completion Card (Fixed Toast) */}
      <div
        className={cn(
          'fixed bottom-6 left-4 right-4 z-30 lg:hidden transition-all duration-500 ease-out',
          isAtBottom ? 'translate-y-0 opacity-100' : 'translate-y-[150%] opacity-0',
        )}
      >
        <CompletionCard isAtBottom={true} className="w-full shadow-2xl ring-1 ring-border" />
      </div>
    </div>
  )
}
