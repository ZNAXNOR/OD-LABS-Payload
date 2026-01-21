import type { CodeBlock } from '@/payload-types'

export interface CodeBlockProps extends CodeBlock {
  className?: string
}

export type CodeLanguage =
  | 'typescript'
  | 'javascript'
  | 'python'
  | 'java'
  | 'csharp'
  | 'cpp'
  | 'c'
  | 'go'
  | 'rust'
  | 'php'
  | 'ruby'
  | 'swift'
  | 'kotlin'
  | 'html'
  | 'css'
  | 'scss'
  | 'json'
  | 'yaml'
  | 'markdown'
  | 'sql'
  | 'bash'
  | 'shell'
  | 'powershell'
  | 'graphql'
  | 'dockerfile'

export type CodeTheme = 'auto' | 'dark' | 'light'
