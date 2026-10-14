'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'

import type { ComponentProps, ReactNode } from 'react'
import type { UIMessage } from 'ai'

import { ArrowDownIcon, DownloadIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/ui'

type ScrollBehavior = 'smooth' | 'instant'

type ConversationContextValue = {
  rootRef: React.RefObject<HTMLDivElement | null>
  contentRef: React.RefObject<HTMLDivElement | null>
  isAtBottom: boolean
  canShowScrollButton: boolean
  scrollButtonBottom: number
  scrollToBottom: (behavior?: ScrollBehavior) => void
}

const ConversationContext = createContext<ConversationContextValue | null>(null)

const useConversationContext = () => {
  const context = useContext(ConversationContext)

  if (!context) {
    throw new Error('Conversation components must be used inside Conversation.')
  }

  return context
}

export type ConversationProps = Omit<ComponentProps<'div'>, 'onScroll'> & {
  initial?: ScrollBehavior
  resize?: ScrollBehavior
}

export const Conversation = ({
  className,
  children,
  initial = 'smooth',
  resize = 'smooth',
  ...props
}: ConversationProps) => {
  const rootRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const [isAtBottom, setIsAtBottom] = useState(true)
  const [canShowScrollButton, setCanShowScrollButton] = useState(false)
  const [scrollButtonBottom, setScrollButtonBottom] = useState(120)

  const isFollowingRef = useRef(true)
  const isProgrammaticScrollRef = useRef(false)
  const animationFrameRef = useRef<number | null>(null)
  const smoothScrollFrameRef = useRef<number | null>(null)

  const lastScrollYRef = useRef(0)

  const getScrollTarget = useCallback(() => {
    const content = contentRef.current
    const workspace = document.getElementById('ai-chat-workspace')
    const composer = document.getElementById('ai-chat-composer')

    if (!content || !workspace) {
      return window.scrollY
    }

    const contentBottom =
      content.getBoundingClientRect().bottom + window.scrollY

    const workspaceBottom =
      workspace.getBoundingClientRect().bottom + window.scrollY

    const composerTop = composer?.getBoundingClientRect().top

    const gap = 12

    const visibleBottom =
      composerTop == null
        ? window.innerHeight - gap
        : Math.min(composerTop, window.innerHeight) - gap

    const desiredTarget = contentBottom - visibleBottom

    // Never scroll past the end of the AI workspace.
    const workspaceLimit = Math.max(0, workspaceBottom - window.innerHeight)

    return Math.min(Math.max(0, desiredTarget), workspaceLimit)
  }, [])

  const checkIsAtBottom = useCallback(() => {
    const difference = getScrollTarget() - window.scrollY

    return difference >= -24 && difference <= 48
  }, [getScrollTarget])

  const syncScrollButton = useCallback(() => {
    const workspace = document.getElementById('ai-chat-workspace')

    if (!workspace) {
      setCanShowScrollButton(false)
      return
    }

    const workspaceRect = workspace.getBoundingClientRect()

    // Activate once the workspace header has moved out of view.
    const workspaceHasScrolled = workspaceRect.top < 0

    // Hide the button when the workspace bottom reaches
    // the viewport's bottom boundary.
    const workspaceBottomStillVisible =
      workspaceRect.bottom > window.innerHeight

    setCanShowScrollButton(workspaceHasScrolled && workspaceBottomStillVisible)
  }, [])

  const cancelSmoothScroll = useCallback(() => {
    if (smoothScrollFrameRef.current !== null) {
      cancelAnimationFrame(smoothScrollFrameRef.current)
      smoothScrollFrameRef.current = null
    }
  }, [])

  const animateScrollToBottom = useCallback(() => {
    // Do not start a second animation if one is already running.
    if (smoothScrollFrameRef.current !== null) {
      return
    }

    let previousTime = 0

    const animate = (time: number) => {
      const target = getScrollTarget()
      const current = window.scrollY
      const difference = target - current

      if (Math.abs(difference) < 1.5) {
        window.scrollTo(0, target)

        lastScrollYRef.current = target
        smoothScrollFrameRef.current = null

        const atBottom = checkIsAtBottom()

        isFollowingRef.current = atBottom
        setIsAtBottom(atBottom)
        isProgrammaticScrollRef.current = false

        syncScrollButton()

        return
      }

      const elapsed = previousTime ? Math.min(time - previousTime, 32) : 16

      previousTime = time

      // Frame-rate-independent easing.
      const progress = 1 - Math.exp(-elapsed / 110)
      const nextPosition = current + difference * progress

      window.scrollTo(0, nextPosition)
      lastScrollYRef.current = nextPosition

      smoothScrollFrameRef.current = requestAnimationFrame(animate)
    }

    smoothScrollFrameRef.current = requestAnimationFrame(animate)
  }, [checkIsAtBottom, getScrollTarget, syncScrollButton])

  const scrollToBottom = useCallback(
    (behavior: ScrollBehavior = 'smooth') => {
      isFollowingRef.current = true
      isProgrammaticScrollRef.current = true

      cancelSmoothScroll()

      if (behavior === 'instant') {
        window.scrollTo({ top: getScrollTarget(), behavior: 'instant' })
        setIsAtBottom(true)
        isProgrammaticScrollRef.current = false
        syncScrollButton()
        return
      }

      animateScrollToBottom()

      setIsAtBottom(true)

      // if (animationFrameRef.current !== null) {
      //   cancelAnimationFrame(animationFrameRef.current)
      // }

      // animationFrameRef.current = requestAnimationFrame(() => {
      //   animationFrameRef.current = requestAnimationFrame(() => {
      //     isProgrammaticScrollRef.current = false
      //     setIsAtBottom(checkIsAtBottom())
      //     syncScrollButton()
      //   })
      // })
    },
    [
      animateScrollToBottom,
      cancelSmoothScroll,
      checkIsAtBottom,
      getScrollTarget,
      syncScrollButton,
    ],
  )

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      const previousY = lastScrollYRef.current

      lastScrollYRef.current = currentY

      // Keep button visibility synchronized during both manual
      // and programmatic scrolling.
      syncScrollButton()

      // Do not overwrite the follow state during our own animation.
      if (smoothScrollFrameRef.current !== null) {
        return
      }

      const atBottom = checkIsAtBottom()

      setIsAtBottom(atBottom)
      isFollowingRef.current = atBottom
    }

    const handleResize = () => {
      syncScrollButton()

      if (isFollowingRef.current) {
        scrollToBottom(resize)
      }
    }

    const handleUserScrollIntent = () => {
      if (!isFollowingRef.current && smoothScrollFrameRef.current === null) {
        return
      }

      cancelSmoothScroll()

      isProgrammaticScrollRef.current = false
      isFollowingRef.current = false
      lastScrollYRef.current = window.scrollY

      setIsAtBottom(checkIsAtBottom())
      syncScrollButton()
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('wheel', handleUserScrollIntent, {
      passive: true,
    })
    window.addEventListener('touchmove', handleUserScrollIntent, {
      passive: true,
    })

    const observer = new ResizeObserver(() => {
      if (isFollowingRef.current) {
        if (resize === 'instant') {
          cancelSmoothScroll()

          const target = getScrollTarget()

          window.scrollTo({
            top: target,
            behavior: 'instant',
          })

          lastScrollYRef.current = target
        } else {
          // Continue the existing animation, or start one if needed.
          animateScrollToBottom()
        }
      }

      syncScrollButton()
    })

    if (rootRef.current) observer.observe(rootRef.current)
    if (contentRef.current) observer.observe(contentRef.current)

    const composer = document.getElementById('ai-chat-composer')
    if (composer) observer.observe(composer)

    syncScrollButton()

    const initialFrame = requestAnimationFrame(() => {
      scrollToBottom(initial)
    })

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('wheel', handleUserScrollIntent)
      window.removeEventListener('touchmove', handleUserScrollIntent)
      observer.disconnect()
      cancelAnimationFrame(initialFrame)
      cancelSmoothScroll()

      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [
    cancelSmoothScroll,
    checkIsAtBottom,
    initial,
    resize,
    scrollToBottom,
    syncScrollButton,
  ])

  const contextValue: ConversationContextValue = {
    rootRef,
    contentRef,
    isAtBottom,
    canShowScrollButton,
    scrollButtonBottom,
    scrollToBottom,
  }

  return (
    <ConversationContext.Provider value={contextValue}>
      <div
        ref={rootRef}
        className={cn('relative w-full', className)}
        {...props}
      >
        {children}
      </div>
    </ConversationContext.Provider>
  )
}

export type ConversationContentProps = ComponentProps<'div'>

export const ConversationContent = ({
  className,
  ...props
}: ConversationContentProps) => {
  const { contentRef } = useConversationContext()

  return (
    <div
      ref={contentRef}
      className={cn('flex flex-col gap-8 p-4 pb-24', className)}
      {...props}
    />
  )
}

export type ConversationEmptyStateProps = ComponentProps<'div'> & {
  title?: string
  description?: string
  icon?: ReactNode
}

export const ConversationEmptyState = ({
  className,
  title = 'No messages yet',
  description = 'Start a conversation to see messages here',
  icon,
  children,
  ...props
}: ConversationEmptyStateProps) => (
  <div
    className={cn(
      'flex size-full flex-col items-center justify-center gap-3 p-8 text-center',
      className,
    )}
    {...props}
  >
    {children ?? (
      <>
        {icon && <div className="text-muted-foreground">{icon}</div>}
        <div className="space-y-1">
          <h3 className="text-sm font-medium">{title}</h3>
          {description && (
            <p className="text-muted-foreground text-sm">{description}</p>
          )}
        </div>
      </>
    )}
  </div>
)

export type ConversationScrollButtonProps = ComponentProps<typeof Button>

export const ConversationScrollButton = ({
  className,
  ...props
}: ConversationScrollButtonProps) => {
  const {
    isAtBottom,
    canShowScrollButton,
    scrollButtonBottom,
    scrollToBottom,
  } = useConversationContext()

  if (isAtBottom || !canShowScrollButton || typeof document === 'undefined') {
    return null
  }

  return createPortal(
    <Button
      className={cn(
        'dark:bg-background dark:hover:bg-muted fixed z-40 rounded-full',
        className,
      )}
      style={{
        left: '50vw',
        bottom: `12rem`,
        transform: 'translateX(-50%)',
      }}
      onClick={() => scrollToBottom('smooth')}
      size="icon"
      type="button"
      variant="outline"
      {...props}
    >
      <ArrowDownIcon className="size-4" />
    </Button>,
    document.body,
  )
}

const getMessageText = (message: UIMessage): string =>
  message.parts
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join('')

export type ConversationDownloadProps = Omit<
  ComponentProps<typeof Button>,
  'onClick'
> & {
  messages: UIMessage[]
  filename?: string
  formatMessage?: (message: UIMessage, index: number) => string
}

const defaultFormatMessage = (message: UIMessage): string => {
  const roleLabel = message.role.charAt(0).toUpperCase() + message.role.slice(1)
  return `**${roleLabel}:** ${getMessageText(message)}`
}

export const messagesToMarkdown = (
  messages: UIMessage[],
  formatMessage: (
    message: UIMessage,
    index: number,
  ) => string = defaultFormatMessage,
): string => messages.map((msg, i) => formatMessage(msg, i)).join('\n\n')

export const ConversationDownload = ({
  messages,
  filename = 'conversation.md',
  formatMessage = defaultFormatMessage,
  className,
  children,
  ...props
}: ConversationDownloadProps) => {
  const handleDownload = useCallback(() => {
    const markdown = messagesToMarkdown(messages, formatMessage)
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = filename
    document.body.append(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }, [messages, filename, formatMessage])

  return (
    <Button
      className={cn(
        'dark:bg-background dark:hover:bg-muted absolute top-4 right-4 rounded-full',
        className,
      )}
      onClick={handleDownload}
      size="icon"
      type="button"
      variant="outline"
      {...props}
    >
      {children ?? <DownloadIcon className="size-4" />}
    </Button>
  )
}
