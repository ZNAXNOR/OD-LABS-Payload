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
      'relative flex min-h-0 w-full flex-1 flex-col overflow-y-auto overscroll-y-auto',
      className,
    )}
    {...props}
  >
    {children}
  </StickToBottom>
)

export const useConversation = useStickToBottomContext

export type ConversationContentProps = ComponentProps<'div'>

export const ConversationContent = ({ className, ...props }: ConversationContentProps) => (
  <StickToBottom.Content
    className={cn('flex min-h-max w-full flex-col gap-8 p-4 pb-8', className)}
    {...props}
  />
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
  const { isAtBottom, scrollToBottom } = useConversation()
  if (isAtBottom) return null

  return (
    <Button
      className={cn(
        'absolute bottom-4 right-5 z-20 size-9 rounded-full border-zinc-700 bg-zinc-900 p-0 shadow-lg hover:bg-zinc-800',
        className,
      )}
      onClick={() => void scrollToBottom()}
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
  const handleDownload = () => {
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
  }

  return (
    <Button className={cn('absolute right-4 top-4', className)} onClick={handleDownload} size="icon" type="button" variant="outline" {...props}>
      {children ?? <DownloadIcon className="size-4" />}
    </Button>
  )
}
