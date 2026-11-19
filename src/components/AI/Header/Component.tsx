import { Sparkles, PlusIcon } from 'lucide-react'

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
    <header
      className={[
        'sticky top-0 z-30 flex min-h-14 items-center justify-between gap-4',
        'border-b border-border-default bg-surface-raised/95 px-5 py-3 backdrop-blur-sm sm:px-8 lg:px-10',
      ].join(' ')}
    >
      <div className="flex min-w-0 items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.12em]">
        <Sparkles className="size-4 shrink-0 text-brand" aria-hidden="true" />
        <span className="font-semibold text-text-primary">OD LABS</span>
        <span className="text-text-muted">/</span>
        <span className="truncate text-text-muted">AI assistant</span>
      </div>

      {isConversation && (
        <button
          type="button"
          onClick={newConversation}
          aria-label="Start a new conversation"
          title="Start a new conversation"
          className="group flex shrink-0 items-center gap-2 border border-border-default px-3 py-2 font-mono text-[11px] text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
          <span>New chat</span>
          <PlusIcon className="size-3.5 transition-colors group-hover:text-brand" />
        </button>
      )}
    </header>
  )
}
