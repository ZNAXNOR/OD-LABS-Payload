import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from '@/components/ai-elements/prompt-input'
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
      className={[
        'relative shrink-0 bg-black',
        'shadow-[0_-25px_40px_-10px_rgba(0,0,0,0.8),0_-15px_30px_-5px_rgba(0,0,0,0.6)]',
        sticky && ['sticky bottom-4 z-30'],
      ].join(' ')}
    >
      <div className="mx-auto w-full max-w-5xl px-6 pt-3 pb-4 sm:px-8 lg:px-12">
        <PromptInput
          className={[
            'rounded-md border border-zinc-800 bg-zinc-950/90',
            'transition-colors',
            'focus-within:border-odl/50',
          ].join(' ')}
          onSubmit={(_message, event) => onSubmit(event)}
        >
          <PromptInputBody>
            <PromptInputTextarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-16 px-4 py-3 text-base"
            />
          </PromptInputBody>

          <PromptInputFooter className="px-3 pb-3">
            <PromptInputTools />

            <PromptInputSubmit
              className={[
                'transition-all',
                'disabled:pointer-events-none disabled:opacity-30',
                'enabled:cursor-pointer',
                'bg-odl text-white',
                'hover:bg-odl/80',
              ].join(' ')}
              disabled={!input.trim() && status !== 'streaming'}
              status={status}
              onStop={stop}
            />
          </PromptInputFooter>
        </PromptInput>

        <div className="mt-2.5 text-center text-xs text-zinc-500">
          AI can make mistakes. Check important info.
        </div>
      </div>
    </div>
  )
}
