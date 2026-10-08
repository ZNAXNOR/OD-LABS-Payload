'use client'

import { useState } from 'react'

import { useAIInterface } from './useAIInterface'

import { Header } from './Header/Component'
import { Initial } from './ConversationContainer/Initial'
import { Active } from './ConversationContainer/Active'
import { Composer } from './Composer/Component'

import { suggestions } from './suggestions'
import { ConversationNavigator } from './ConversationContainer/ConversationNavigator/Component'

type AIMode = 'initial' | 'conversation'

export const AIInterface = () => {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<AIMode>('initial')

  const { messages, sendMessage, status, setMessages, stop, regenerate } =
    useAIInterface()

  const isGenerating = status === 'submitted' || status === 'streaming'

  const submitMessage = (text: string) => {
    const prompt = text.trim()

    if (!prompt || isGenerating) {
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
    submitMessage(input)
  }

  const newConversation = () => {
    if (isGenerating) {
      stop()
    }

    setMessages([])
    setInput('')
    setMode('initial')
  }

  return (
    <section
      className={['flex flex-col', mode === 'initial' ? 'min-h-svh' : ''].join(
        ' ',
      )}
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

      {/* AI Interface */}
      <div
        className={[
          'relative flex w-full flex-col',
          'border border-zinc-600 bg-black',
          'transition-[border-radius,border-color,width,margin,max-width]',
          'duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',

          mode === 'conversation'
            ? [
                'm-0',
                'w-full max-w-none',
                'min-h-svh',
                'rounded-none',
                'border-x-0',
              ].join(' ')
            : ['mx-auto mb-24', 'w-full max-w-6xl', 'rounded-[2px]'].join(' '),
        ].join(' ')}
      >
        {/* Header */}
        <Header mode={mode} newConversation={newConversation} />

        {/* Workspace Body */}
        <div className="relative flex-1">
          <div className="bg-linear-to-b from-zinc-900 via-zinc-950 to-black">
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
          {/* Conversation Navigator */}
          {mode === 'conversation' && (
            <ConversationNavigator messages={messages} />
          )}
        </div>

        {/* Footer */}
        <Composer
          input={input}
          setInput={setInput}
          onSubmit={handleSubmit}
          status={status}
          stop={stop}
          sticky={mode === 'conversation'}
        />
      </div>
    </section>
  )
}
