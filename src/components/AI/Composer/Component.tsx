import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  PromptInputSelect,
  PromptInputSelectTrigger,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSelectValue,
} from '@/components/ai-elements/prompt-input'
import { Sparkles } from 'lucide-react'
import { CONTENT_SCOPES, type ContentScope } from '../contentScopes'
import type { ChatStatus } from 'ai'

export const Composer = ({
  input,
  setInput,
  onSubmit,
  status,
  stop,
  sticky = false,
  placeholder,
  scope,
  setScope,
}: {
  input: string
  setInput: (value: string) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  status: ChatStatus
  stop: () => Promise<void>
  sticky: boolean
  placeholder?: string
  scope: ContentScope
  setScope: (scope: ContentScope) => void
}) => {
  return (
    <div
      id="ai-chat-composer"
      className={[
        'relative shrink-0 border-t border-border-default bg-surface',
        sticky ? 'sticky bottom-0 z-30' : '',
      ].join(' ')}
    >
      <div className="mx-auto w-full max-w-5xl px-5 pt-4 pb-3 sm:px-8 lg:px-10">
        <PromptInput
          className="focus-within:border-focus-ring rounded-xl border border-border-default bg-surface-inset transition-colors"
          onSubmit={(_message, event) => onSubmit(event)}
        >
          <PromptInputBody>
            <PromptInputTextarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={placeholder || "Ask about OD LABS..."}
              aria-label="Message the OD LABS AI assistant"
              className="min-h-14 rounded-t-xl px-4 py-3 text-base leading-6 text-text-primary placeholder:text-text-muted"
            />
          </PromptInputBody>

          <PromptInputFooter className="px-3 pb-3">
            <PromptInputTools className="min-w-0 flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-text-muted uppercase">
                <Sparkles className="text-brand size-3" aria-hidden="true" />
                Knowledge assistant is using
              </span>
              <PromptInputSelect
                value={scope}
                onValueChange={(value) => setScope(value as ContentScope)}
                disabled={status === 'submitted' || status === 'streaming'}
              >
                <PromptInputSelectTrigger
                  aria-label="Search content category"
                  className="focus:ring-focus-ring/50 h-8 w-auto min-w-28 rounded-md border border-zinc-800 px-2.5 text-xs text-text-secondary hover:border-border-strong hover:bg-surface-subtle focus:ring-1"
                >
                  <PromptInputSelectValue placeholder="All content" />
                </PromptInputSelectTrigger>
                <PromptInputSelectContent align="start">
                  {CONTENT_SCOPES.map((option) => (
                    <PromptInputSelectItem
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </PromptInputSelectItem>
                  ))}
                </PromptInputSelectContent>
              </PromptInputSelect>
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-text-muted uppercase">
                to answer your queries
              </span>
            </PromptInputTools>

            <PromptInputSubmit
              aria-label={
                status === 'streaming' || status === 'submitted'
                  ? 'Stop generating'
                  : 'Send message'
              }
              className="bg-brand-hover hover:bg-brand-hover/80 size-10 rounded-full text-text-inverted transition-colors disabled:pointer-events-none disabled:opacity-30"
              disabled={
                !input.trim() &&
                status !== 'streaming' &&
                status !== 'submitted'
              }
              status={status}
              onStop={stop}
            />
          </PromptInputFooter>
        </PromptInput>

        <p className="mt-2 text-center text-[11px] leading-5 text-text-muted">
          AI can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  )
}
