'use client'

import { CheckIcon, CopyIcon, RefreshCcwIcon, CircleXIcon } from 'lucide-react'

import { useState } from 'react'

import type { ChatStatus, UIMessage } from 'ai'

import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageResponse,
} from '@/components/ai-elements/message'

import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from '@/components/ai-elements/sources'

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation'

import { Suggestion, Suggestions } from '@/components/ai-elements/suggestion'
import { postSuggestions } from '../suggestions'

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
    className="flex items-center gap-2 border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-400"
    role="alert"
    aria-live="polite"
  >
    <CircleXIcon className="size-4 font-bold" />

    <strong>AI Error:</strong>
    <span>
      Something went wrong while generating the response. Please try again.
    </span>
  </div>
)

export const Active = ({
  messages,
  status,
  regenerate,
  submitSuggestion,
}: {
  messages: UIMessage[]
  status: ChatStatus
  regenerate: () => Promise<void>
  submitSuggestion: (text: string) => void
}) => {
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)

  const isStreaming = status === 'streaming'
  const isGenerating = status === 'submitted' || isStreaming

  const lastMessage = messages.at(-1)

  const awaitingAssistant = isGenerating && lastMessage?.role === 'user'

  const copyMessage = async (message: UIMessage) => {
    const text = message.parts
      .filter((part) => part.type === 'text')
      .map((part) => part.text)
      .join('')

    if (!text) return

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
    <Conversation className="relative w-full" initial="smooth" resize="smooth">
      <ConversationContent
        id="conversation-transcript"
        className="mx-auto w-full max-w-5xl gap-5 px-6 pt-4 pb-12 sm:px-8 lg:px-12"
        role="log"
        aria-live="polite"
        aria-busy={isStreaming}
      >
        {messages.map((message, index) => {
          const isUser = message.role === 'user'

          const isLastMessage = index === messages.length - 1

          const isCopied = copiedMessageId === message.id

          const isStreamingMessage = isStreaming && isLastMessage && !isUser

          const showActions = !isStreamingMessage

          const text = message.parts
            .filter((part) => part.type === 'text')
            .map((part) => part.text)
            .join('')

          const hasText = Boolean(text)

          const sources = message.parts.filter(
            (part) => part.type === 'source-url',
          )

          if (!hasText && !isStreamingMessage) {
            return null
          }

          return (
            <Message
              id={`message-${message.id}`}
              key={message.id}
              from={message.role}
              className={[
                'max-w-none gap-2',
                isUser ? 'pt-6' : '',
                isUser ? 'group/user' : 'group/assistant',
              ].join(' ')}
            >
              <MessageContent
                className={
                  isUser
                    ? [
                        'ml-auto max-w-2xl rounded-none',
                        'border-odl border',
                        'bg-odl',
                        'px-5 py-3',
                        'text-base leading-7 text-zinc-200',
                      ].join(' ')
                    : [
                        'max-w-4xl',
                        'bg-transparent p-0',
                        'text-lg leading-8 text-white',
                      ].join(' ')
                }
              >
                {isUser ? (
                  <span>{text}</span>
                ) : hasText ? (
                  <MessageResponse
                    isAnimating={isStreamingMessage}
                    caret="circle"
                  >
                    {text}
                  </MessageResponse>
                ) : isStreamingMessage ? (
                  <LoadingState />
                ) : (
                  <ErrorState />
                )}
              </MessageContent>

              {!isGenerating && !isUser && sources.length > 0 && (
                <Sources>
                  <SourcesTrigger count={sources.length} />

                  <SourcesContent>
                    {sources.map((source) => (
                      <Source
                        key={source.sourceId}
                        href={source.url}
                        title={source.title ?? source.url}
                      />
                    ))}
                  </SourcesContent>
                </Sources>
              )}

              {showActions && (
                <MessageActions
                  className={
                    isUser
                      ? [
                          'justify-end',
                          'opacity-0 transition-opacity',
                          'group-hover/user:opacity-100',
                          'group-focus-within/user:opacity-100',
                        ].join(' ')
                      : 'justify-start'
                  }
                >
                  <MessageAction
                    label={isCopied ? 'Copied' : 'Copy message'}
                    tooltip={isCopied ? 'Copied' : 'Copy message'}
                    onClick={() => void copyMessage(message)}
                  >
                    {isCopied ? (
                      <CheckIcon className="size-5" />
                    ) : (
                      <CopyIcon className="size-5" />
                    )}
                  </MessageAction>

                  {!isUser && isLastMessage && (
                    <MessageAction
                      label="Regenerate response"
                      tooltip="Regenerate response"
                      onClick={() => void regenerate()}
                    >
                      <RefreshCcwIcon className="size-5" />
                    </MessageAction>
                  )}
                </MessageActions>
              )}

              {!isStreamingMessage && !isUser && isLastMessage && (
                <Suggestions className="pt-2">
                  {postSuggestions.map((suggestion) => (
                    <Suggestion
                      key={suggestion}
                      suggestion={suggestion}
                      onClick={submitSuggestion}
                    />
                  ))}
                </Suggestions>
              )}
            </Message>
          )
        })}

        {awaitingAssistant && (
          <Message from="assistant" className="max-w-none gap-2">
            <MessageContent
              className={[
                'max-w-4xl',
                'bg-transparent p-0',
                'text-lg leading-8 text-white',
              ].join(' ')}
            >
              <LoadingState />
            </MessageContent>
          </Message>
        )}

        {status === 'error' && <ErrorState />}
      </ConversationContent>

      <ConversationScrollButton />
    </Conversation>
  )
}
