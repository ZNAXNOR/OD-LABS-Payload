'use client'
import React from 'react'

import { getClientSideURL } from '@/utilities/getURL'
import { HeaderThemeProvider } from './HeaderTheme'
import { LivePreviewProvider } from './LivePreview'
import { ThemeProvider } from './Theme'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <HeaderThemeProvider>
        <LivePreviewProvider
          serverURL={getClientSideURL()}
          enabled={true}
          configuration={{
            collections: {
              pages: { enabled: true, urlPattern: '/{slug}' },
              blogs: { enabled: true, urlPattern: '/blogs/{slug}' },
              services: { enabled: true, urlPattern: '/services/{slug}' },
              legal: { enabled: true, urlPattern: '/legal/{slug}' },
              contacts: { enabled: true, urlPattern: '/contacts/{slug}' },
            },
            debounceMs: 300,
            maxRetries: 3,
            retryDelayMs: 1000,
            sessionTimeoutMs: 30 * 60 * 1000, // 30 minutes
          }}
        >
          {children}
        </LivePreviewProvider>
      </HeaderThemeProvider>
    </ThemeProvider>
  )
}
