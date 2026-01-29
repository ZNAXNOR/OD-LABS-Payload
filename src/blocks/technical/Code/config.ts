import type { Block } from 'payload'

export const Code: Block = {
  slug: 'code',
  dbName: 'code_block', // Root level optimization
  interfaceName: 'CodeBlock',
  labels: {
    singular: 'Code Block',
    plural: 'Code Blocks',
  },
  admin: {
    group: 'Technical',
  },
  fields: [
    {
      name: 'language',
      type: 'select',
      defaultValue: 'typescript',
      required: true,
      admin: {
        description:
          'Programming language for syntax highlighting. Choose the language that matches your code snippet for proper highlighting and formatting.',
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
      validate: (value) => {
        if (!value || value.trim().length === 0) {
          return 'Code snippet is required'
        }
        if (value.trim().length < 3) {
          return 'Code snippet must be at least 3 characters long'
        }
        return true
      },
      admin: {
        description: 'Enter your code snippet',
      },
    },
    {
      name: 'filename',
      type: 'text',
      maxLength: 100,
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
      maxLength: 100,
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
        description:
          'Color theme: Auto (matches user system preference), Dark (dark background), Light (light background)',
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
      maxLength: 200,
      admin: {
        description: 'Optional caption to display below the code block',
        placeholder: 'e.g., Example implementation',
      },
    },
  ],
}
