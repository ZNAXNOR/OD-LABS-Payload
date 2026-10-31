'use client'

import { CheckIcon, CopyIcon, RefreshCcwIcon, CircleXIcon, FileTextIcon } from 'lucide-react'
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
  useConversation,
} from '@/components/ai-elements/conversation'
import { Suggestion, Suggestions } from '@/components/ai-elements/suggestion'
import { postSuggestions } from '../suggestions'
import { ConversationNavigator } from './ConversationNavigator/Component'

const LoadingState = () => {
  const { scrollToBottom } = useConversation()

  return (
    <button
      type="button"
      onClick={() => void scrollToBottom()}
      className="inline-flex min-h-8 items-center gap-1.5 rounded-md px-1 text-zinc-500 transition-colors hover:text-zinc-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-odl"
      aria-label="Generating response. Scroll to latest message."
      title="Scroll to latest message"
    >
      <span role="status" aria-label="Generating response" className="inline-flex items-center gap-1.5">
        <span className="size-1.5 animate-pulse rounded-full bg-zinc-500" />
        <span className="size-1.5 animate-pulse rounded-full bg-zinc-500 [animation-delay:200ms]" />
        <span className="size-1.5 animate-pulse rounded-full bg-zinc-500 [animation-delay:400ms]" />
      </span>
    </button>
  )
}

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
    <Conversation id="conversation-scroll-root" className="relative min-h-0 w-full flex-1" initial="smooth" resize="instant">
      <ConversationContent
        id="conversation-transcript"
        className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-5 pb-8 pt-7 sm:px-8 lg:px-10"
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
          const sourceParts = message.parts.filter((part) => part.type === 'source-url')
          const sources = [...new Map(sourceParts.map((source) => [source.url, source])).values()]

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
                  <SourcesContent className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                    {sources.map((source) => (
                      <Source
                        key={source.url}
                        href={source.url}
                        title={source.title ?? source.url}
                        className="flex min-w-0 max-w-full items-center gap-3 border border-zinc-800 bg-zinc-950/60 px-3 py-2.5 no-underline transition-colors hover:border-zinc-600 hover:bg-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-odl"
                      >
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-zinc-800 bg-black text-zinc-400 transition-colors group-hover:text-zinc-200">
                          <FileTextIcon className="size-4" aria-hidden="true" />
                        </span>
                        <span className="line-clamp-2 min-w-0 text-xs font-medium leading-5 text-zinc-300 transition-colors hover:text-white">
                          {source.title ?? source.url}
                        </span>
                      </Source>
                    ))}
                  </SourcesContent>
                </Sources>
              )}

              {!isStreamingMessage && (
                <MessageActions
                  className={
                    isUser
                      ? 'justify-end opacity-0 transition-opacity group-hover/user:opacity-100 group-focus-within/user:opacity-100'
                      : 'justify-start gap-0.5'
                  }
                >
                  <MessageAction
                    label={isCopied ? 'Copied' : 'Copy message'}
                    tooltip={isCopied ? 'Copied' : 'Copy message'}
                    onClick={() => void copyMessage(message)}
                    className="size-7 rounded-md p-1"
                  >
                    {isCopied ? <CheckIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
                  </MessageAction>

                  {!isUser && isLastMessage && (
                    <MessageAction
                      label="Regenerate response"
                      tooltip="Regenerate response"
                      onClick={() => void regenerate()}
                      className="size-7 rounded-md p-1"
                    >
                      <RefreshCcwIcon className="size-3.5" />
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

        {isGenerating && (
          <Message from="assistant" className="max-w-none gap-3">
            <MessageContent className="max-w-4xl bg-transparent p-0 text-base leading-8 text-zinc-100 sm:text-[17px]">
              <LoadingState />
            </MessageContent>
          </Message>
        )}

        {status === 'error' && <ErrorState />}
      </ConversationContent>

      <ConversationNavigator messages={messages} />
      <ConversationScrollButton />
    </Conversation>
  )
}
