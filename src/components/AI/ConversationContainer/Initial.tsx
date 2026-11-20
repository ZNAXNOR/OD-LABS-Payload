import { Sparkles } from 'lucide-react'

export const Initial = ({
  suggestedPrompts,
  submit,
  heading,
  description,
}: {
  suggestedPrompts: string[]
  submit: (prompt: string) => void
  heading?: string
  description?: string
}) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center sm:px-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center">
        <div className="mb-7 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">
          <Sparkles className="size-4 text-odl" aria-hidden="true" />
          <span>OD LABS / Knowledge assistant</span>
        </div>

        <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-[-0.045em] text-text-primary sm:text-5xl lg:text-6xl">
          {heading || 'What would you like to know?'}
        </h1>

        <p className="mt-5 max-w-xl text-pretty text-base leading-7 text-text-secondary sm:text-lg">
          {description ||
            'Explore our work, projects, technology, and approach. Ask a question in your own words to get started.'}
        </p>

        <div className="mt-10 w-full">
          <p className="mb-3 text-left font-mono text-[11px] uppercase tracking-[0.16em] text-text-muted">
            Suggested starting points
          </p>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {suggestedPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => submit(prompt)}
                className="group flex min-h-12 items-center justify-between gap-4 border border-border-default px-4 py-3 text-left text-sm text-text-secondary transition-colors hover:border-brand/70 hover:bg-surface-subtle hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
              >
                <span>{prompt}</span>
                <Sparkles
                  className="size-3.5 shrink-0 text-text-muted transition-colors group-hover:text-link"
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
