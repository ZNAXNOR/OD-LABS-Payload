import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from '@/components/ai-elements/prompt-input'
import { Sparkles } from 'lucide-react'
import type { ChatStatus } from 'ai'

export const Composer = ({
  input,
  setInput,
  onSubmit,
  status,
  stop,
  sticky = false,
}: {
  input: string
  setInput: (value: string) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  status: ChatStatus
  stop: () => Promise<void>
  sticky: boolean
}) => {
  return (
    <div
      id="ai-chat-composer"
      className={[
        'relative shrink-0 border-t border-zinc-800/90 bg-black',
        sticky ? 'sticky bottom-0 z-30' : '',
      ].join(' ')}
    >
      <div className="mx-auto w-full max-w-5xl px-5 pb-3 pt-4 sm:px-8 lg:px-10">
        <PromptInput
          className="rounded-xl border border-zinc-700 bg-zinc-950 transition-colors focus-within:border-odl/70"
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
            <PromptInputTools>
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-600">
                <Sparkles className="size-3 text-odl" aria-hidden="true" />
                Knowledge assistant
              </span>
            </PromptInputTools>

            <PromptInputSubmit
              aria-label={status === 'streaming' || status === 'submitted' ? 'Stop generating' : 'Send message'}
              className="size-10 rounded-full bg-odl text-white transition-colors hover:bg-odl/80 disabled:pointer-events-none disabled:opacity-30"
              disabled={!input.trim() && status !== 'streaming' && status !== 'submitted'}
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
