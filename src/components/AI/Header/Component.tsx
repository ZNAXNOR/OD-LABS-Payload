import { ChatGPTLogo } from '@/components/Logo/AI/AI_Logo'

import { PlusIcon } from 'lucide-react'

type AIMode = 'initial' | 'conversation'

export const Header = ({
  mode,
  newConversation,
}: {
  mode: AIMode
  newConversation: () => void
}) => {
  const isConversation = mode === 'conversation'

  return (
    <div
      className={[
        'sticky top-0 z-30',
        'flex items-center justify-between gap-4',
        'border-b border-zinc-700',
        'bg-zinc-950 px-6 py-3.5 sm:px-6',
      ].join(' ')}
    >
      <div className="flex items-center gap-2 font-mono text-xs select-none">
        <span className="bg-odl size-1.5 rounded-none" />

        <span className="font-semibold text-zinc-300">OD LABS</span>

        <span className="text-zinc-600">//</span>

        <ChatGPTLogo className="size-4" />

        <strong className="font-normal text-zinc-200">GPT-5 mini</strong>
      </div>

      {isConversation && (
        <div className="flex items-center gap-2.5 font-mono text-xs">
          <button
            type="button"
            onClick={newConversation}
            aria-label="New conversation"
            title="New conversation"
            className="group flex items-center gap-1 text-zinc-400 transition-colors hover:cursor-pointer hover:text-white"
          >
            New Conversation{' '}
            <PlusIcon className="group-hover:text-odl size-3.5 transition-colors" />
          </button>
        </div>
      )}
    </div>
  )
}
