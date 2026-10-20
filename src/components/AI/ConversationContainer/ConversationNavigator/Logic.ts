'use client'

import type { UIMessage } from 'ai'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export type ConversationSection = {
  id: string
  index: number
  messageId: string
  text: string
}

const MAX_VISIBLE_SECTIONS = 10

const getMessageText = (message: UIMessage) =>
  message.parts
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join('')
    .trim()

export const useConversationNavigator = (messages: UIMessage[]) => {
  const railRef = useRef<HTMLDivElement>(null)

  const [activeIndex, setActiveIndex] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)
  const [keyboardNavigation, setKeyboardNavigation] = useState(false)

  const sections = useMemo<ConversationSection[]>(
    () =>
      messages
        .filter((message) => message.role === 'user')
        .map((message, index) => ({
          id: `section-${message.id}`,
          index,
          messageId: message.id,
          text: getMessageText(message) || `Section ${index + 1}`,
        })),
    [messages],
  )

  const currentSection =
    sections[activeIndex] ?? sections[sections.length - 1] ?? null

  /*
   * Browser viewport scroll-spy.
   *
   * The conversation is now part of normal document flow.
   * There is deliberately no custom scroll root here.
   */
  useEffect(() => {
    if (sections.length === 0) {
      setActiveIndex(0)
      return
    }

    const elements = sections
      .map((section) => {
        const element = document.getElementById(`message-${section.messageId}`)

        return element
          ? {
              index: section.index,
              element,
            }
          : null
      })
      .filter(
        (
          item,
        ): item is {
          index: number
          element: HTMLElement
        } => item !== null,
      )

    if (elements.length === 0) {
      return
    }

    const updateActiveSection = () => {
      const header = document.getElementById('ai-chat-header')
      const headerHeight = header?.getBoundingClientRect().height ?? 0

      const readingLine = headerHeight + 36

      let active = elements[0]

      for (const item of elements) {
        const rect = item.element.getBoundingClientRect()

        if (rect.top <= readingLine) {
          active = item
        } else {
          break
        }
      }

      setActiveIndex(active.index)
    }

    let frame = 0

    const handleScroll = () => {
      cancelAnimationFrame(frame)

      frame = requestAnimationFrame(updateActiveSection)
    }

    const handleResize = () => {
      cancelAnimationFrame(frame)

      frame = requestAnimationFrame(updateActiveSection)
    }

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    })

    window.addEventListener('resize', handleResize)

    /*
     * Messages change height while streaming. ResizeObserver
     * keeps the active section accurate without owning scrolling.
     */
    const resizeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(frame)

      frame = requestAnimationFrame(updateActiveSection)
    })

    elements.forEach(({ element }) => {
      resizeObserver.observe(element)
    })

    updateActiveSection()

    return () => {
      cancelAnimationFrame(frame)

      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)

      resizeObserver.disconnect()
    }
  }, [sections])

  useEffect(() => {
    setActiveIndex((current) =>
      Math.min(current, Math.max(sections.length - 1, 0)),
    )
  }, [sections.length])

  const scrollToSection = (section: ConversationSection) => {
    const element = document.getElementById(`message-${section.messageId}`)

    if (!element) {
      return
    }

    const header = document.getElementById('ai-chat-header')
    const headerHeight = header?.getBoundingClientRect().height ?? 0

    const top =
      element.getBoundingClientRect().top + window.scrollY - headerHeight - 32

    window.scrollTo({
      top: Math.max(0, top),
      behavior: 'smooth',
    })
  }

  /*
   * Optional keyboard navigation.
   */
  useEffect(() => {
    if (!keyboardNavigation || sections.length < 2) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null

      if (
        target?.matches(
          'input, textarea, select, button, a, [contenteditable="true"]',
        )
      ) {
        return
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault()

        const next = Math.min(activeIndex + 1, sections.length - 1)

        if (next !== activeIndex) {
          scrollToSection(sections[next])
        }
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault()

        const previous = Math.max(activeIndex - 1, 0)

        if (previous !== activeIndex) {
          scrollToSection(sections[previous])
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeIndex, keyboardNavigation, sections, scrollToSection])

  const visibleSections = useMemo(() => {
    if (sections.length <= MAX_VISIBLE_SECTIONS) {
      return sections
    }

    const half = Math.floor(MAX_VISIBLE_SECTIONS / 2)

    let start = Math.max(0, activeIndex - half)

    if (start + MAX_VISIBLE_SECTIONS > sections.length) {
      start = sections.length - MAX_VISIBLE_SECTIONS
    }

    return sections.slice(start, start + MAX_VISIBLE_SECTIONS)
  }, [sections, activeIndex])

  const hasMoreBefore = visibleSections[0]?.index !== 0

  const hasMoreAfter = visibleSections.at(-1)?.index !== sections.length - 1

  return {
    railRef,
    sections,
    visibleSections,
    activeIndex,
    currentSection,
    hasMoreBefore,
    hasMoreAfter,
    isExpanded,
    setIsExpanded,
    keyboardNavigation,
    setKeyboardNavigation,
    scrollToSection,
  }
}
