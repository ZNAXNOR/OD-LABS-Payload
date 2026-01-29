import type { CodeBlock as CodeBlockType } from '@/payload-types'
import React from 'react'
import { CodeBlockClient } from './Component.client'

interface CodeBlockProps {
  block?: CodeBlockType
  // Legacy props for backward compatibility
  code?: string
  language?: string
  filename?: string
  showLineNumbers?: boolean
  highlightLines?: string
  theme?: 'auto' | 'dark' | 'light'
  enableCopy?: boolean
  caption?: string
  blockType?: 'code'
  className?: string
}

export const CodeBlock: React.FC<CodeBlockProps> = (props) => {
  // Handle both new block structure and legacy props
  const {
    block,
    className,
    // Legacy props
    code: legacyCode,
    language: legacyLanguage,
    filename: legacyFilename,
    showLineNumbers: legacyShowLineNumbers,
    highlightLines: legacyHighlightLines,
    theme: legacyTheme,
    enableCopy: legacyEnableCopy,
    caption: legacyCaption,
  } = props

  // Use block data if available, otherwise fall back to legacy props
  const code = block?.code || legacyCode || ''
  const language = block?.language || legacyLanguage || 'typescript'
  const filename = block?.filename || legacyFilename
  const showLineNumbers = block?.showLineNumbers ?? legacyShowLineNumbers ?? true
  const highlightLines = block?.highlightLines || legacyHighlightLines
  const theme = block?.theme || legacyTheme || 'auto'
  const enableCopy = block?.enableCopy ?? legacyEnableCopy ?? true
  const caption = block?.caption || legacyCaption
  return (
    <div className={['not-prose', className].filter(Boolean).join(' ')}>
      <CodeBlockClient
        code={code}
        language={language}
        filename={filename}
        showLineNumbers={showLineNumbers}
        highlightLines={highlightLines}
        theme={theme}
        enableCopy={enableCopy}
        caption={caption}
      />
    </div>
  )
}
