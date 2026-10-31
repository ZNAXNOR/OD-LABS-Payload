import { Sparkles } from 'lucide-react'

export const Initial = ({
  suggestedPrompts,
  submit,
}: {
  suggestedPrompts: string[]
  submit: (prompt: string) => void
}) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center sm:px-10">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center">
        <div className="mb-7 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
          <Sparkles className="size-4 text-odl" aria-hidden="true" />
          <span>OD LABS / Knowledge assistant</span>
        </div>

        <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-[-0.045em] text-zinc-100 sm:text-5xl lg:text-6xl">
          What would you like to know?
        </h1>

        <p className="mt-5 max-w-xl text-pretty text-base leading-7 text-zinc-400 sm:text-lg">
          Explore our work, projects, technology, and approach. Ask a question
          in your own words to get started.
        </p>

        <div className="mt-10 w-full max-w-2xl">
          <p className="mb-3 text-left font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-500">
            Suggested starting points
          </p>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {suggestedPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => submit(prompt)}
                className="group flex min-h-12 items-center justify-between gap-4 border border-zinc-800 px-4 py-3 text-left text-sm text-zinc-300 transition-colors hover:border-odl/70 hover:bg-zinc-950 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-odl"
              >
                <span>{prompt}</span>
                <Sparkles
                  className="size-3.5 shrink-0 text-zinc-600 transition-colors group-hover:text-odl"
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
