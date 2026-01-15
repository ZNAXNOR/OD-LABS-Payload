import type { Block } from 'payload'

export const Code: Block = {
  slug: 'code',
  interfaceName: 'CodeBlock',
  fields: [
    {
      name: 'language',
      type: 'select',
      defaultValue: 'typescript',
      required: true,
      admin: {
        description: 'Select the programming language for syntax highlighting',
      },
      options: [
        { label: 'TypeScript', value: 'typescript' },
        { label: 'JavaScript', value: 'javascript' },
        { label: 'Python', value: 'python' },
        { label: 'Java', value: 'java' },
        { label: 'C#', value: 'csharp' },
        { label: 'C++', value: 'cpp' },
        { label: 'C', value: 'c' },
        { label: 'Go', value: 'go' },
        { label: 'Rust', value: 'rust' },
        { label: 'PHP', value: 'php' },
        { label: 'Ruby', value: 'ruby' },
        { label: 'Swift', value: 'swift' },
        { label: 'Kotlin', value: 'kotlin' },
        { label: 'HTML', value: 'html' },
        { label: 'CSS', value: 'css' },
        { label: 'SCSS', value: 'scss' },
        { label: 'JSON', value: 'json' },
        { label: 'YAML', value: 'yaml' },
        { label: 'Markdown', value: 'markdown' },
        { label: 'SQL', value: 'sql' },
        { label: 'Bash', value: 'bash' },
        { label: 'Shell', value: 'shell' },
        { label: 'PowerShell', value: 'powershell' },
        { label: 'GraphQL', value: 'graphql' },
        { label: 'Dockerfile', value: 'dockerfile' },
      ],
    },
    {
      name: 'code',
      type: 'code',
      label: false,
      required: true,
      admin: {
        description: 'Enter your code snippet',
      },
    },
    {
      name: 'filename',
      type: 'text',
      admin: {
        description: 'Optional filename to display above the code block',
        placeholder: 'e.g., index.ts',
      },
    },
    {
      name: 'showLineNumbers',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Display line numbers in the code block',
      },
    },
    {
      name: 'highlightLines',
      type: 'text',
      admin: {
        description: 'Comma-separated line numbers to highlight (e.g., 1,3-5,7)',
        placeholder: '1,3-5,7',
      },
    },
    {
      name: 'theme',
      type: 'select',
      defaultValue: 'auto',
      options: [
        { label: 'Auto (follows system)', value: 'auto' },
        { label: 'Dark', value: 'dark' },
        { label: 'Light', value: 'light' },
      ],
      admin: {
        description: 'Color theme for the code block',
      },
    },
    {
      name: 'enableCopy',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show copy-to-clipboard button',
      },
    },
    {
      name: 'caption',
      type: 'text',
      admin: {
        description: 'Optional caption to display below the code block',
        placeholder: 'e.g., Example implementation',
      },
    },
  ],
  labels: {
    singular: 'Code Block',
    plural: 'Code Blocks',
  },
}
