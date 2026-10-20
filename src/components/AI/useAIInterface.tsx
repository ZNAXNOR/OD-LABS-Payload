'use client'

import { DefaultChatTransport } from 'ai'
import { useChat } from '@ai-sdk/react'

export const useAIInterface = () => {
  return useChat({
    transport: new DefaultChatTransport({
      api: '/api/ai-chat',
    }),
  })
}
