'use client'

import type { ContentScope } from '@/components/AI/contentScopes'
import { AIInterface } from '@/components/AI'

type Props = {
  heading?: string | null
  description?: string | null
  placeholder?: string | null
  defaultScope?: ContentScope | null
}

export const AIBlockComponent: React.FC<Props> = ({
  heading,
  description,
  placeholder,
  defaultScope,
}) => {
  return (
    <section aria-label="OD LABS AI workspace" className="flex min-w-0 flex-1 flex-col">
      <AIInterface
        heading={heading || undefined}
        description={description || undefined}
        placeholder={placeholder || undefined}
        defaultScope={defaultScope || undefined}
      />
    </section>
  )
}
