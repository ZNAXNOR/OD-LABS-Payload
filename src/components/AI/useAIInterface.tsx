'use client'

import { useMemo } from 'react'
import { DefaultChatTransport } from 'ai'
import { useChat } from '@ai-sdk/react'

import type { ContentScope } from './contentScopes'

export const useAIInterface = (scope: ContentScope) => {
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/ai-chat',
        body: { scope },
      }),
    [scope],
  )

  return useChat({
    transport,
    onError: (error) => {
      console.error('[AI Chat] Client request failed:', error)
    },
  })
}
