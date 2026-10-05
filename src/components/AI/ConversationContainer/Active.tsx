'use client'

import { CheckIcon, CopyIcon, CircleXIcon } from 'lucide-react'
import { useState } from 'react'
import type { ChatStatus, UIMessage } from 'ai'

import {
  Conversation,
  ConversationContent,
} from '@/components/ai-elements/conversation'
import {
  Message,
  MessageContent,
  MessageResponse,
} from '@/components/ai-elements/message'

const LoadingState = () => (
  <span
    className="text-odl inline-flex items-center gap-1.5"
    aria-label="Generating response"
  >
    <span className="size-1.5 animate-pulse rounded-full bg-current" />
    <span className="size-1.5 animate-pulse rounded-full bg-current [animation-delay:200ms]" />
    <span className="size-1.5 animate-pulse rounded-full bg-current [animation-delay:400ms]" />
  </span>
)

const ErrorState = () => (
  <div
    className="flex items-center gap-2 rounded-md border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-400"
    role="alert"
    aria-live="polite"
  >
    <CircleXIcon className="size-4 font-bold" />
    <strong>AI Error:</strong> Something went wrong while generating the
    response. Please try again.
  </div>
)

export const Active = ({
  messages,
  status,
}: {
  messages: UIMessage[]
  status: ChatStatus
}) => {
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)

  const isStreaming = status === 'streaming'

  const copyMessage = async (message: UIMessage) => {
    const text = message.parts
      .filter((part) => part.type === 'text')
      .map((part) => part.text)
      .join('')

    try {
      await navigator.clipboard.writeText(text)
      setCopiedMessageId(message.id)

      window.setTimeout(() => {
        setCopiedMessageId((current) =>
          current === message.id ? null : current,
        )
      }, 1500)
    } catch (error) {
      console.error('Failed to copy message:', error)
    }
  }

  return (
    <Conversation className="h-full w-full">
      <ConversationContent className="mx-auto w-full max-w-5xl gap-5 px-6 py-20 sm:px-8 lg:px-12">
        {messages.map((message, index) => {
          const isUser = message.role === 'user'
          const isFirstMessage = index === 0
          const isLastMessage = index === messages.length - 1
          const isCopied = copiedMessageId === message.id

          const text = message.parts
            ?.filter((part) => part.type === 'text')
            .map((part) => part.text)
            .join('')

          return (
            <Message
              key={message.id}
              from={message.role}
              className={[
                'max-w-none gap-2',
                isUser && !isFirstMessage ? 'pt-6' : '',
                isUser ? 'group/user' : 'group/assistant',
              ].join(' ')}
            >
              <MessageContent
                className={
                  isUser
                    ? [
                        'ml-auto max-w-2xl rounded-none',
                        'border-odl border',
                        'bg-odl/70',
                        'px-5 py-3',
                        'text-base leading-7 text-zinc-200',
                      ].join(' ')
                    : [
                        '-pt-2 max-w-4xl bg-transparent p-0',
                        'text-lg leading-8 text-white',
                      ].join(' ')
                }
              >
                {text &&
                  (isUser ? (
                    <span>{text}</span>
                  ) : (
                    <MessageResponse isAnimating={isStreaming && isLastMessage}>
                      {text}
                    </MessageResponse>
                  ))}
              </MessageContent>

              {!isUser && isStreaming && isLastMessage ? null : (
                <div
                  className={
                    isUser
                      ? [
                          'flex w-full items-center justify-end',
                          'invisible opacity-0',
                          'transition-opacity',
                          'group-hover/user:visible',
                          'group-hover/user:opacity-100',
                          'group-focus-within/user:visible',
                          'group-focus-within/user:opacity-100',
                        ].join(' ')
                      : 'flex w-full items-center justify-start'
                  }
                >
                  <button
                    type="button"
                    onClick={() => void copyMessage(message)}
                    aria-label={isCopied ? 'Copied' : 'Copy message'}
                    className="pt-1 font-mono text-xs text-zinc-500 transition-colors select-none hover:cursor-pointer hover:text-zinc-200"
                  >
                    {isCopied ? (
                      <CheckIcon className="size-5" />
                    ) : (
                      <CopyIcon className="size-5" />
                    )}
                  </button>
                </div>
              )}
            </Message>
          )
        })}

        {status === 'submitted' && <LoadingState />}

        {status === 'error' && <ErrorState />}
      </ConversationContent>
    </Conversation>
  )
}
