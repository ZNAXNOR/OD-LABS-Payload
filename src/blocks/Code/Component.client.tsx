'use client'
import React, { useEffect, useState } from 'react'
import { CopyButton } from './CopyButton'

// Import Prism CSS
import 'prismjs/themes/prism-tomorrow.css'

type Props = {
  code: string
  language?: string
  filename?: string
  showLineNumbers?: boolean
  highlightLines?: string
  theme?: 'auto' | 'dark' | 'light'
  enableCopy?: boolean
  caption?: string
}

export const CodeBlockClient: React.FC<Props> = ({
  code,
  language = 'typescript',
  filename,
  showLineNumbers = true,
  highlightLines,
  theme = 'auto',
  enableCopy = true,
  caption,
}) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const loadPrism = async () => {
      const Prism = (await import('prismjs')).default

      // Load line numbers plugin
      if (showLineNumbers) {
        await import('prismjs/plugins/line-numbers/prism-line-numbers')
        await import('prismjs/plugins/line-numbers/prism-line-numbers.css')
      }

      // Load line highlight plugin
      if (highlightLines) {
        await import('prismjs/plugins/line-highlight/prism-line-highlight')
        await import('prismjs/plugins/line-highlight/prism-line-highlight.css')
      }

      // Load the language if it's not already loaded
      if (language && !Prism.languages[language]) {
        try {
          await import(`prismjs/components/prism-${language}`)
        } catch (error) {
          console.warn(`Could not load Prism language: ${language}`)
        }
      }

      Prism.highlightAll()
    }

    loadPrism()
  }, [code, language, mounted, showLineNumbers, highlightLines])

  if (!mounted) {
    return null
  }

  const themeClass =
    theme === 'auto'
      ? 'bg-zinc-900 dark:bg-zinc-950'
      : theme === 'dark'
        ? 'bg-zinc-900'
        : 'bg-zinc-100'

  return (
    <div className="my-8">
      {filename && (
        <div
          className={`px-4 py-2 text-sm font-mono border-b ${
            theme === 'light'
              ? 'bg-zinc-200 text-zinc-900 border-zinc-300'
              : 'bg-zinc-800 text-zinc-100 border-zinc-700'
          }`}
        >
          {filename}
        </div>
      )}
      <div className={`relative rounded-lg overflow-hidden ${themeClass}`}>
        {enableCopy && <CopyButton code={code} />}
        <pre
          className={`${showLineNumbers ? 'line-numbers' : ''} language-${language} !m-0 !rounded-none`}
          data-line={highlightLines}
        >
          <code className={`language-${language}`}>{code}</code>
        </pre>
      </div>
      {caption && (
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 text-center">{caption}</p>
      )}
    </div>
  )
}
