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
}: {
  input: string
  setInput: (value: string) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  status: ChatStatus
  stop: () => Promise<void>
}) => {
  return (
    <div className="relative shrink-0">
      <div className="mx-auto w-full max-w-5xl px-6 pb-4 sm:px-8 lg:px-12">
        <PromptInput onSubmit={(_message, event) => onSubmit(event)}>
          <PromptInputBody>
            <PromptInputTextarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </PromptInputBody>

          <PromptInputFooter>
            <PromptInputTools />

            <PromptInputSubmit
              className="bg-odl/90 hover:bg-odl cursor-not-allowed text-white transition-opacity hover:cursor-pointer hover:opacity-80"
              disabled={!input.trim() && status !== 'streaming'}
              status={status}
              onStop={stop}
            />
          </PromptInputFooter>
        </PromptInput>

        <div className="mt-2.5 text-center font-mono text-xs text-zinc-600">
          AI can make mistakes. Check important info.
        </div>
      </div>
    </div>
  )
}
