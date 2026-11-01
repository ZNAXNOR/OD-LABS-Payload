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
  scope,
  setScope,
}: {
  input: string
  setInput: (value: string) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  status: ChatStatus
  stop: () => Promise<void>
  sticky: boolean
  scope: ContentScope
  setScope: (scope: ContentScope) => void
}) => {
  return (
    <div
      id="ai-chat-composer"
      className={[
        'relative shrink-0 border-t border-zinc-800/90 bg-black',
        sticky ? 'sticky bottom-0 z-30' : '',
      ].join(' ')}
    >
      <div className="mx-auto w-full max-w-5xl px-5 pt-4 pb-3 sm:px-8 lg:px-10">
        <PromptInput
          className="focus-within:border-odl/70 rounded-xl border border-zinc-700 bg-zinc-950 transition-colors"
          onSubmit={(_message, event) => onSubmit(event)}
        >
          <PromptInputBody>
            <PromptInputTextarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about OD LABS..."
              aria-label="Message the OD LABS AI assistant"
              className="min-h-14 rounded-t-xl px-4 py-3 text-base leading-6 text-zinc-100 placeholder:text-zinc-600"
            />
          </PromptInputBody>

          <PromptInputFooter className="px-3 pb-3">
            <PromptInputTools className="min-w-0 flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-zinc-600 uppercase">
                <Sparkles className="text-odl size-3" aria-hidden="true" />
                Knowledge assistant is using
              </span>
              <PromptInputSelect
                value={scope}
                onValueChange={(value) => setScope(value as ContentScope)}
                disabled={status === 'submitted' || status === 'streaming'}
              >
                <PromptInputSelectTrigger
                  aria-label="Search content category"
                  className="focus:ring-odl/50 h-8 w-auto min-w-28 rounded-md border border-zinc-800 px-2.5 text-xs text-zinc-300 hover:border-zinc-600 hover:bg-zinc-900 focus:ring-1"
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
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-zinc-600 uppercase">
                to answer your queries
              </span>
            </PromptInputTools>

            <PromptInputSubmit
              aria-label={
                status === 'streaming' || status === 'submitted'
                  ? 'Stop generating'
                  : 'Send message'
              }
              className="bg-odl hover:bg-odl/80 size-10 rounded-full text-white transition-colors disabled:pointer-events-none disabled:opacity-30"
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

        <p className="mt-2 text-center text-[11px] leading-5 text-zinc-600">
          AI can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  )
}
