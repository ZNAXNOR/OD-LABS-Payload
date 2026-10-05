import type { Metadata } from 'next'

import { AIInterface } from '@/components/AI'

export const metadata: Metadata = {
  title: 'AI | OD LABS',
  description:
    'Ask the OD LABS AI about Omkar, his work, projects, and technology.',
}

export default function AIPage() {
  return (
    <article className="flex flex-1 flex-col">
      <AIInterface />
    </article>
  )
}
