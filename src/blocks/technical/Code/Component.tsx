import React from 'react'
import { CodeBlockClient } from './Component.client'

export type CodeBlockProps = {
  code: string
  language?: string
  filename?: string
  showLineNumbers?: boolean
  highlightLines?: string
  theme?: 'auto' | 'dark' | 'light'
  enableCopy?: boolean
  caption?: string
  blockType: 'code'
}

type Props = CodeBlockProps & {
  className?: string
}

export const CodeBlock: React.FC<Props> = ({
  className,
  code,
  language = 'typescript',
  filename,
  showLineNumbers = true,
  highlightLines,
  theme = 'auto',
  enableCopy = true,
  caption,
}) => {
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
