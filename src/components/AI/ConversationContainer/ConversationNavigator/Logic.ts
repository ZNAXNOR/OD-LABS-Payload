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

const playNavigationTick = () => {
  try {
    const AudioContextClass = window.AudioContext
    if (!AudioContextClass) return

    const context = new AudioContextClass()
    const oscillator = context.createOscillator()
    const gain = context.createGain()

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(920, context.currentTime)
    gain.gain.setValueAtTime(0.0001, context.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.035, context.currentTime + 0.004)
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.035)

    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.start()
    oscillator.stop(context.currentTime + 0.04)
    oscillator.onended = () => void context.close()
  } catch {
    // Audio is optional; navigation must work when audio is unavailable.
  }
}

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

  useEffect(() => {
    const scrollRoot = document.getElementById('conversation-transcript')?.parentElement

    if (!scrollRoot || sections.length === 0) {
      setActiveIndex(0)
      return
    }

    const elements = sections
      .map((section) => {
        const element = document.getElementById(`message-${section.messageId}`)
        return element ? { index: section.index, element } : null
      })
      .filter(
        (item): item is { index: number; element: HTMLElement } => item !== null,
      )

    if (elements.length === 0) return

    const updateActiveSection = () => {
      const rootTop = scrollRoot.getBoundingClientRect().top
      const readingLine = rootTop + 36
      let active = elements[0]

      for (const item of elements) {
        if (item.element.getBoundingClientRect().top <= readingLine) {
          active = item
        } else {
          break
        }
      }

      setActiveIndex(active.index)
    }

    let frame = 0
    const scheduleUpdate = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(updateActiveSection)
    }

    scrollRoot.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)

    const resizeObserver = new ResizeObserver(scheduleUpdate)
    resizeObserver.observe(scrollRoot)

    const transcript = document.getElementById('conversation-transcript')
    if (transcript) resizeObserver.observe(transcript)
    elements.forEach(({ element }) => resizeObserver.observe(element))

    scheduleUpdate()

    return () => {
      cancelAnimationFrame(frame)
      scrollRoot.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      resizeObserver.disconnect()
    }
  }, [sections])

  useEffect(() => {
    setActiveIndex((current) =>
      Math.min(current, Math.max(sections.length - 1, 0)),
    )
  }, [sections.length])

  const scrollToSection = useCallback(
    (section: ConversationSection) => {
      const scrollRoot = document.getElementById('conversation-transcript')?.parentElement
      const element = document.getElementById(`message-${section.messageId}`)

      if (!scrollRoot || !element) return

      if (section.index !== activeIndex) playNavigationTick()

      const rootRect = scrollRoot.getBoundingClientRect()
      const elementRect = element.getBoundingClientRect()
      const top = scrollRoot.scrollTop + elementRect.top - rootRect.top - 32

      scrollRoot.scrollTo({
        top: Math.max(0, top),
        behavior: 'smooth',
      })
    },
    [activeIndex],
  )

  useEffect(() => {
    if (!keyboardNavigation || sections.length < 2) return

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
        if (next !== activeIndex) scrollToSection(sections[next])
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault()
        const previous = Math.max(activeIndex - 1, 0)
        if (previous !== activeIndex) scrollToSection(sections[previous])
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeIndex, keyboardNavigation, sections, scrollToSection])

  const visibleSections = useMemo(() => {
    if (sections.length <= MAX_VISIBLE_SECTIONS) return sections

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
