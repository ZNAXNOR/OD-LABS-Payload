'use client'

import { useCallback, useEffect, useRef, useState, createContext, useContext } from 'react'
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
  scrollToBottom: (behavior?: ScrollBehavior) => void
}

const ConversationContext = createContext<ConversationContextValue | null>(null)

const useConversationContext = () => {
  const context = useContext(ConversationContext)
  if (!context) throw new Error('Conversation components must be used inside Conversation.')
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
  resize = 'instant',
  ...props
}: ConversationProps) => {
  const rootRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const followingRef = useRef(true)
  const touchStartY = useRef<number | null>(null)
  const [isAtBottom, setIsAtBottom] = useState(true)

  const checkAtBottom = useCallback(() => {
    const root = rootRef.current
    return !root || root.scrollHeight - root.scrollTop - root.clientHeight < 56
  }, [])

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    const root = rootRef.current
    if (!root) return
    followingRef.current = true
    root.scrollTo({ top: root.scrollHeight, behavior })
    setIsAtBottom(true)
  }, [])

  useEffect(() => {
    const root = rootRef.current
    const content = contentRef.current
    if (!root || !content) return

    const syncScroll = () => {
      if (followingRef.current) {
        root.scrollTo({ top: root.scrollHeight, behavior: resize })
      }
      setIsAtBottom(checkAtBottom())
    }

    const handleWheel = (event: WheelEvent) => {
      if (event.deltaY < 0) {
        followingRef.current = false
      } else if (checkAtBottom()) {
        followingRef.current = true
      }
    }

    const handleTouchStart = (event: TouchEvent) => {
      touchStartY.current = event.touches[0]?.clientY ?? null
    }

    const handleTouchMove = (event: TouchEvent) => {
      const y = event.touches[0]?.clientY
      const previousY = touchStartY.current
      if (y == null || previousY == null) return
      if (y > previousY) followingRef.current = false
      else if (checkAtBottom()) followingRef.current = true
      touchStartY.current = y
    }

    const handleScroll = () => {
      const atBottom = checkAtBottom()
      setIsAtBottom(atBottom)
      followingRef.current = atBottom
    }
    const resizeObserver = new ResizeObserver(syncScroll)
    const mutationObserver = new MutationObserver(syncScroll)

    resizeObserver.observe(root)
    resizeObserver.observe(content)
    mutationObserver.observe(content, { childList: true, subtree: true, characterData: true })
    root.addEventListener('scroll', handleScroll, { passive: true })
    root.addEventListener('wheel', handleWheel, { passive: true })
    root.addEventListener('touchstart', handleTouchStart, { passive: true })
    root.addEventListener('touchmove', handleTouchMove, { passive: true })

    const frame = requestAnimationFrame(() => scrollToBottom(initial))

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      mutationObserver.disconnect()
      root.removeEventListener('scroll', handleScroll)
      root.removeEventListener('wheel', handleWheel)
      root.removeEventListener('touchstart', handleTouchStart)
      root.removeEventListener('touchmove', handleTouchMove)
    }
  }, [checkAtBottom, initial, resize, scrollToBottom])

  return (
    <ConversationContext.Provider value={{ rootRef, contentRef, isAtBottom, scrollToBottom }}>
      <div
        ref={rootRef}
        className={cn('relative flex min-h-0 w-full flex-1 flex-col overflow-y-auto overscroll-y-contain', className)}
        {...props}
      >
        {children}
      </div>
    </ConversationContext.Provider>
  )
}

export type ConversationContentProps = ComponentProps<'div'>

export const ConversationContent = ({ className, ...props }: ConversationContentProps) => {
  const { contentRef } = useConversationContext()
  return <div ref={contentRef} className={cn('flex w-full flex-col gap-8 p-4 pb-8', className)} {...props} />
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
  <div className={cn('flex size-full flex-col items-center justify-center gap-3 p-8 text-center', className)} {...props}>
    {children ?? (
      <>
        {icon && <div className="text-muted-foreground">{icon}</div>}
        <div className="space-y-1">
          <h3 className="text-sm font-medium">{title}</h3>
          {description && <p className="text-muted-foreground text-sm">{description}</p>}
        </div>
      </>
    )}
  </div>
)

export type ConversationScrollButtonProps = ComponentProps<typeof Button>

export const ConversationScrollButton = ({ className, ...props }: ConversationScrollButtonProps) => {
  const { isAtBottom, scrollToBottom } = useConversationContext()
  if (isAtBottom) return null
  return (
    <Button
      className={cn('absolute bottom-4 right-5 z-20 size-9 rounded-full border-zinc-700 bg-zinc-900 shadow-lg hover:bg-zinc-800', className)}
      onClick={() => scrollToBottom('smooth')}
      size="icon"
      type="button"
      variant="outline"
      aria-label="Scroll to latest message"
      {...props}
    >
      <ArrowDownIcon className="size-4" />
    </Button>
  )
}

const getMessageText = (message: UIMessage): string =>
  message.parts.filter((part) => part.type === 'text').map((part) => part.text).join('')

export type ConversationDownloadProps = Omit<ComponentProps<typeof Button>, 'onClick'> & {
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
  formatMessage: (message: UIMessage, index: number) => string = defaultFormatMessage,
): string => messages.map((message, index) => formatMessage(message, index)).join('\n\n')

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
    <Button className={cn('absolute right-4 top-4', className)} onClick={handleDownload} size="icon" type="button" variant="outline" {...props}>
      {children ?? <DownloadIcon className="size-4" />}
    </Button>
  )
}
