'use client'
import React, { useEffect } from 'react'
import { CopyButton } from './CopyButton'

// Import Prism CSS
import 'prismjs/themes/prism-tomorrow.css'

type Props = {
  code: string
  language?: string
}

export const Code: React.FC<Props> = ({ code, language = 'typescript' }) => {
  useEffect(() => {
    const loadPrism = async () => {
      const Prism = (await import('prismjs')).default

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
  }, [code, language])

  return (
    <div className="relative">
      <CopyButton code={code} />
      <pre className={`language-${language}`}>
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  )
}
