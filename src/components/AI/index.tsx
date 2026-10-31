'use client'

import { useState } from 'react'

import { useAIInterface } from './useAIInterface'
import { Header } from './Header/Component'
import { Initial } from './ConversationContainer/Initial'
import { Active } from './ConversationContainer/Active'
import { Composer } from './Composer/Component'
import { suggestions } from './suggestions'

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
    <section
      id="ai-chat-workspace"
      aria-label="OD LABS AI assistant"
      className="flex min-h-svh w-full min-w-0 flex-1 flex-col bg-black text-white"
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
  )
}
