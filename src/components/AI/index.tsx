'use client'

import { useState } from 'react'

import { useAIInterface } from './useAIInterface'
import { Header } from './Header/Component'
import { Initial } from './ConversationContainer/Initial'
import { Active } from './ConversationContainer/Active'
import { Composer } from './Composer/Component'
import { suggestions } from './suggestions'
import { TooltipProvider } from '@/components/ui/tooltip'

type AIMode = 'initial' | 'conversation'

export const AIInterface = () => {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<AIMode>('initial')

  const { messages, sendMessage, status, setMessages, stop, regenerate } =
    useAIInterface()

  const isGenerating = status === 'submitted' || status === 'streaming'

  const submitMessage = (text: string) => {
    const prompt = text.trim()

    if (!prompt || isGenerating) return

    setMode('conversation')
    setInput('')

    void sendMessage({ text: prompt })
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    submitMessage(input)
  }

  const newConversation = () => {
    if (isGenerating) void stop()

    setMessages([])
    setInput('')
    setMode('initial')
  }

  return (
    <TooltipProvider delayDuration={150}>
      <section
        id="ai-chat-workspace"
        aria-label="OD LABS AI assistant"
        className="mx-auto my-8 flex h-[min(78svh,900px)] min-h-[520px] w-[calc(100%-2rem)] max-w-6xl min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-zinc-800 bg-black text-white shadow-2xl shadow-black/30 sm:my-10 sm:w-[calc(100%-3rem)]"
      >
        <Header mode={mode} newConversation={newConversation} />

        <div className="relative flex min-h-0 flex-1 flex-col">
          {mode === 'initial' ? (
            <Initial suggestedPrompts={suggestions} submit={submitMessage} />
          ) : (
            <Active
              messages={messages}
              status={status}
              regenerate={regenerate}
              submitSuggestion={submitMessage}
            />
          )}
        </div>

        <Composer
          input={input}
          setInput={setInput}
          onSubmit={handleSubmit}
          status={status}
          stop={stop}
          sticky
        />
      </section>
    </TooltipProvider>
  )
}
