'use client'

import { Post } from '@/payload-types'
import { cn } from '@/utilities/ui'
import { ArrowRight, HashIcon } from 'lucide-react'

import { ComponentProps, useEffect, useRef, useState } from 'react'

type Props = ComponentProps<'div'> & {
  post: Post
}

export const TableOfContents = ({ className, post, ...props }: Props) => {
  const [activeId, setActiveId] = useState<string>('')
  const [isAtBottom, setIsAtBottom] = useState(false)

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
    }
  }

  useEffect(() => {
    // 1. Assign IDs
    const headingElements = Array.from(
      (document.querySelector('article') ?? document).querySelectorAll('h2, h3'),
    )
    headingElements.forEach((element) => {
      const slug = slugify(element.textContent || '')
      element.id = slug
    })

    // 2. Observer
    const callback: IntersectionObserverCallback = (headings) => {
      const visibleHeading = headings.find((h) => h.isIntersecting)
      if (visibleHeading) {
        setActiveId(visibleHeading.target.id)
      }
    }

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
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight
      const totalHeight = document.documentElement.scrollHeight
      // Use a small threshold (e.g., 50px) to account for minor rounding errors or padding
      setIsAtBottom(totalHeight - scrollPosition < 50)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
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
        // Calculate center of the active link relative to the UL
        const top = activeLink.offsetTop + activeLink.offsetHeight / 2
        setIndicatorTop(top)
      }
    } else if (!activeId) {
      setIndicatorTop(0)
    }
  }, [activeId, isAtBottom])

  return (
    <div className={cn('flex flex-col gap-4', className)} {...props}>
      <h3 className="font-semibold text-xl">Table Of Content</h3>
      <div className="flex flex-row gap-2 relative">
        {/* Left Column: Progress Bar Track Only */}
        <div className="flex flex-col items-center pt-2 w-[10px]">
          {' '}
          {/* Fixed width to align with list icons if needed */}
          <div className="w-[2px] bg-border relative flex-1 rounded-full overflow-hidden">
            {/* Fill */}
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
            {headings.map((child: any, i: number) => {
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
            })}
          </ul>

          {/* Completion Card */}
          <div
            className={cn(
              'relative flex items-center gap-3 rounded-xl p-4 transition-all duration-500 -ml-11',
              isAtBottom
                ? 'bg-card shadow-[0_0_20px_-5px_rgba(233,66,53,0.3)] translate-y-0 opacity-100'
                : 'bg-card translate-y-2',
            )}
          >
            {/* Snake Border Animation (Active Only, Full Border) */}
            {isAtBottom && (
              <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                <div className="absolute top-[50%] left-[50%] h-[200%] w-[200%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,_#E94235_90deg,_transparent_180deg)] -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute inset-[1px] bg-card rounded-xl" />
              </div>
            )}

            {/* Tick Circle */}
            <div
              className={cn(
                'relative z-10 size-6 shrink-0 rounded-full flex items-center justify-center border transition-colors duration-500',
                isAtBottom
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'bg-muted border-border text-muted-foreground',
              )}
            >
              <div className="size-4 flex items-center justify-center">
                <svg
                  width="10"
                  height="8"
                  viewBox="0 0 10 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 4L3.5 6.5L9 1"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Text Content */}
            <div className="relative z-10 flex flex-col gap-0.5">
              <span
                className={cn(
                  'font-bold text-sm tracking-tight transition-colors',
                  isAtBottom ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                Congratulations!
              </span>
              <span className="text-xs text-muted-foreground">
                You’ve thoroughly explored this topic!
              </span>
            </div>

            {/* Extra Glow/Shimmer overlay */}
            {isAtBottom && (
              <div className="absolute inset-0 rounded-xl pointer-events-none bg-gradient-to-tr from-white/10 to-transparent mix-blend-overlay" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
