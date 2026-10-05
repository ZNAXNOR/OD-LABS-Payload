'use client'

import { useState } from 'react'
import { useAIInterface } from './useAIInterface'

import { Header } from './Header/Component'
import { Initial } from './ConversationContainer/Initial'
import { Active } from './ConversationContainer/Active'
import { Composer } from './Composer/Component'
import { suggestedPrompts } from './prompts'

type AIMode = 'initial' | 'conversation'

export const AIInterface = () => {
  const [mode, setMode] = useState<AIMode>('initial')
  const [input, setInput] = useState('')

  const { messages, sendMessage, status, setMessages, stop } = useAIInterface()

  const startConversation = (text: string) => {
    const prompt = text.trim()

    if (!prompt || status === 'submitted' || status === 'streaming') {
      return
    }

    setMode('conversation')
    setInput('')

    void sendMessage({
      text: prompt,
    })
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    startConversation(input)
  }

  const newConversation = () => {
    if (status === 'submitted' || status === 'streaming') {
      stop()
    }

    setMessages([])
    setInput('')
    setMode('initial')
  }

  return (
    <section
      className={
        mode === 'conversation' ? 'flex h-svh flex-col' : 'flex flex-col'
      }
    >
      {/* HERO */}
      <div
        className={[
          'overflow-hidden',
          mode === 'conversation' ? 'h-0 opacity-0' : 'mb-20 opacity-100',
          'transition-opacity',
          'duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
        ].join(' ')}
      >
        <div className="px-6 pt-20 pb-8 lg:px-12 lg:pt-20">
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="space-y-4 lg:col-span-8">
              <div className="text-odl mb-2 flex items-center font-mono text-xs tracking-wider uppercase">
                <span>OD LABS // AI ASSISTANT</span>
                <span className="bg-odl/40 inline-block h-px w-8" />
              </div>

              <h1 className="text-5xl leading-[1.05] font-bold tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
                Hello there. I am Omkar
              </h1>

              <p className="pt-2 text-xl font-normal tracking-[-0.02em] text-zinc-400 sm:text-2xl">
                Want to know more about me or my work?
              </p>
            </div>

            <div className="space-y-3 border-l border-zinc-700 py-2 pl-8 lg:col-span-4">
              <p className="font-sans text-sm leading-relaxed text-zinc-400">
                Consider this a small piece of me, always here and ready to
                answer questions about what I build & how I work.
              </p>

              <p className="font-mono text-xs tracking-tight text-zinc-100">
                I know what exists here. Ask me about it.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Workspace */}
      <div
        className={[
          'relative flex flex-col overflow-hidden',
          'border border-zinc-600 bg-black',
          'transition-[border-radius,border-color,width,margin,max-width]',
          'duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',

          mode === 'conversation'
            ? [
                'h-svh',
                'min-h-0',
                'shrink-0',
                'w-full max-w-none',
                'm-0',
                'rounded-none',
                'border-x-0',
              ].join(' ')
            : [
                'mx-auto mb-20',
                'w-full max-w-6xl',
                'min-h-[calc(100svh-10rem)]',
                'rounded-[2px]',
              ].join(' '),
        ].join(' ')}
      >
        {/* Header */}
        <Header mode={mode} newConversation={newConversation} />

        <div className="min-h-0 flex-1 bg-linear-to-b from-zinc-900 via-zinc-950 to-black">
          {/* Rest State */}
          {mode === 'initial' ? (
            <Initial
              suggestedPrompts={suggestedPrompts}
              submit={startConversation}
            />
          ) : (
            // Conversation State
            <Active messages={messages} status={status} />
          )}
        </div>

        {/* Footer */}
        <Composer
          input={input}
          setInput={setInput}
          onSubmit={handleSubmit}
          status={status}
          stop={stop}
        />
      </div>
    </section>
  )
}
