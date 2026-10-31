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
  <span className="text-odl inline-flex items-center gap-1.5" role="status" aria-label="Generating response">
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
    <CircleXIcon className="size-4" aria-hidden="true" />
    <strong>AI error:</strong>
    <span>Something went wrong while generating the response. Please try again.</span>
  </div>
)

const getMessageText = (message: UIMessage) =>
  message.parts
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join('')

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
    const text = getMessageText(message).trim()
    if (!text) return

    try {
      await navigator.clipboard.writeText(text)
      setCopiedMessageId(message.id)
      window.setTimeout(() => {
        setCopiedMessageId((current) => current === message.id ? null : current)
      }, 1500)
    } catch (error) {
      console.error('Failed to copy message:', error)
    }
  }

  return (
    <Conversation className="relative w-full flex-1" initial="smooth" resize="smooth">
      <ConversationContent
        id="conversation-transcript"
        className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-5 pb-10 pt-8 sm:px-8 lg:px-10"
        role="log"
        aria-live="polite"
        aria-busy={isGenerating}
      >
        {messages.map((message, index) => {
          const isUser = message.role === 'user'
          const isLastMessage = index === messages.length - 1
          const isCopied = copiedMessageId === message.id
          const isStreamingMessage = isStreaming && isLastMessage && !isUser
          const text = getMessageText(message)
          const hasText = Boolean(text.trim())
          const sources = message.parts.filter((part) => part.type === 'source-url')

          if (!hasText && !isStreamingMessage) return null

          return (
            <Message
              id={`message-${message.id}`}
              key={message.id}
              from={message.role}
              className={['max-w-none gap-3', isUser ? 'pt-3' : '', isUser ? 'group/user' : 'group/assistant'].join(' ')}
            >
              <MessageContent
                className={
                  isUser
                    ? 'ml-auto max-w-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-base leading-7 text-zinc-100'
                    : 'max-w-4xl bg-transparent p-0 text-base leading-8 text-zinc-100 sm:text-[17px]'
                }
              >
                {isUser ? (
                  <span className="whitespace-pre-wrap">{text}</span>
                ) : hasText ? (
                  <MessageResponse isAnimating={isStreamingMessage} caret="circle">
                    {text}
                  </MessageResponse>
                ) : (
                  <LoadingState />
                )}
              </MessageContent>

              {!isGenerating && !isUser && sources.length > 0 && (
                <Sources className="mt-1 border-t border-zinc-800 pt-3 text-zinc-400">
                  <SourcesTrigger
                    count={sources.length}
                    className="text-xs text-zinc-400 transition-colors hover:text-white"
                  >
                    <span className="inline-flex items-center gap-2">
                      <span className="font-mono uppercase tracking-wider">Sources</span>
                      <span className="text-zinc-600">({sources.length})</span>
                    </span>
                  </SourcesTrigger>
                  <SourcesContent className="max-w-full">
                    {sources.map((source) => (
                      <Source
                        key={source.sourceId}
                        href={source.url}
                        title={source.title ?? source.url}
                        className="max-w-full break-words text-xs text-zinc-400 underline decoration-zinc-700 underline-offset-4 hover:text-white"
                      />
                    ))}
                  </SourcesContent>
                </Sources>
              )}

              {!isStreamingMessage && (
                <MessageActions
                  className={
                    isUser
                      ? 'justify-end opacity-0 transition-opacity group-hover/user:opacity-100 group-focus-within/user:opacity-100'
                      : 'justify-start'
                  }
                >
                  <MessageAction
                    label={isCopied ? 'Copied' : 'Copy message'}
                    tooltip={isCopied ? 'Copied' : 'Copy message'}
                    onClick={() => void copyMessage(message)}
                  >
                    {isCopied ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
                  </MessageAction>

                  {!isUser && isLastMessage && (
                    <MessageAction
                      label="Regenerate response"
                      tooltip="Regenerate response"
                      onClick={() => void regenerate()}
                    >
                      <RefreshCcwIcon className="size-4" />
                    </MessageAction>
                  )}
                </MessageActions>
              )}

              {!isStreamingMessage && !isUser && isLastMessage && (
                <Suggestions className="pt-1">
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
          <Message from="assistant" className="max-w-none gap-3">
            <MessageContent className="max-w-4xl bg-transparent p-0 text-base leading-8 text-zinc-100 sm:text-[17px]">
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
