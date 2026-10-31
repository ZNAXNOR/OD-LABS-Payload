'use client'

import { StickToBottom, useStickToBottomContext } from 'use-stick-to-bottom'
import type { ComponentProps, ReactNode } from 'react'
import type { UIMessage } from 'ai'
import { ArrowDownIcon, DownloadIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/ui'

type ScrollBehavior = 'smooth' | 'instant'

export type ConversationProps = Omit<ComponentProps<'div'>, 'onScroll'> & {
  initial?: ScrollBehavior
  resize?: ScrollBehavior
}

/**
 * Thin styled wrapper around the public use-stick-to-bottom component.
 * Scroll anchoring and streaming follow behavior are delegated to the library.
 */
export const Conversation = ({
  className,
  children,
  initial = 'smooth',
  resize = 'instant',
  ...props
}: ConversationProps) => (
  <StickToBottom
    initial={initial}
    resize={resize}
    className={cn(
      'relative flex min-h-0 w-full flex-1 flex-col overflow-hidden',
      className,
    )}
    {...props}
  >
    {children}
  </StickToBottom>
)

export const useConversation = useStickToBottomContext

export type ConversationContentProps = ComponentProps<'div'> & {
  scrollClassName?: string
}

export const ConversationContent = ({
  className,
  scrollClassName,
  children = null,
  ...props
}: ConversationContentProps) => (
  <StickToBottom.Content
    scrollClassName={cn('ai-chat-scroll min-h-0 flex-1 overflow-y-auto overscroll-y-auto', scrollClassName)}
    className={cn('flex min-h-full w-full flex-col gap-8 p-4 pb-8', className)}
    {...props}
  >
    {children}
  </StickToBottom.Content>
)

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
      'flex min-h-[320px] flex-1 flex-col items-center justify-center gap-3 p-8 text-center text-zinc-400',
      className,
    )}
    {...props}
  >
    {icon ? <div className="text-zinc-500">{icon}</div> : null}
    <div className="space-y-1">
      <h3 className="font-mono text-sm font-medium text-white">{title}</h3>
      <p className="max-w-md font-mono text-xs leading-relaxed text-zinc-400">{description}</p>
    </div>
    {children}
  </div>
)

export type ConversationScrollToBottomProps = ComponentProps<typeof Button>

export const ConversationScrollToBottom = ({
  className,
  children,
  onClick,
  ...props
}: ConversationScrollToBottomProps) => {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext()

  if (isAtBottom) return null

  return (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        'absolute bottom-4 left-1/2 -translate-x-1/2 shadow-lg backdrop-blur-md',
        className,
      )}
      onClick={(e) => {
        scrollToBottom('smooth')
        onClick?.(e)
      }}
      {...props}
    >
      <ArrowDownIcon className="mr-1.5 size-3.5" />
      {children ?? 'Scroll to bottom'}
    </Button>
  )
}

export const ConversationScrollButton = ConversationScrollToBottom
export type ConversationScrollButtonProps = ConversationScrollToBottomProps

export interface ConversationDownloadProps
  extends Omit<ComponentProps<typeof Button>, 'children'> {
  messages: UIMessage[]
  filename?: string
  formatMessage?: (message: UIMessage) => string
  children?: ReactNode
}

export const ConversationDownload = ({
  messages,
  filename = 'conversation.txt',
  formatMessage,
  className,
  children,
  onClick,
  ...props
}: ConversationDownloadProps) => {
  const handleDownload = (e: React.MouseEvent<HTMLButtonElement>) => {
    const defaultFormat = (m: UIMessage) =>
      `[${m.role.toUpperCase()}]\n${m.parts.map((p) => (p.type === 'text' ? p.text : '')).join('')}\n`

    const formatter = formatMessage ?? defaultFormat
    const content = messages.map(formatter).join('\n---\n\n')
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)

    onClick?.(e)
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className={cn('text-zinc-400 hover:text-white', className)}
      onClick={handleDownload}
      {...props}
    >
      {children ?? <DownloadIcon className="size-4" />}
    </Button>
  )
}
