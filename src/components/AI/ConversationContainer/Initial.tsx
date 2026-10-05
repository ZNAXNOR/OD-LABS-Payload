import { SquareLogo } from '../../Logo/Logo'

export const Initial = ({
  suggestedPrompts,
  submit,
}: {
  suggestedPrompts: string[]
  submit: (prompt: string) => void
}) => {
  return (
    <div className="flex flex-col justify-center px-6 py-8 text-center">
      <div className="mx-auto flex max-w-xl flex-col items-center space-y-8">
        <div className="text-odl shadow-odl/10 flex h-12 w-12 items-center justify-center border border-zinc-600 bg-zinc-900 font-mono text-base font-semibold shadow-lg">
          <SquareLogo className="size-7" />
        </div>

        <div className="space-y-2">
          <h2 className="font-mono text-2xl font-bold tracking-tight text-zinc-200 uppercase sm:text-3xl">
            OD LABS Assistance AI
          </h2>

          <p className="mx-auto max-w-md font-sans text-sm leading-relaxed text-zinc-400 sm:text-base">
            Ask about my work, projects, technology, or how I build.
          </p>
        </div>

        <div className="flex w-full flex-col items-center space-y-3 pt-4">
          <span className="text-odl font-mono text-xs font-semibold tracking-wider uppercase">
            OR SELECT A STARTING POINT
          </span>

          <div className="flex max-w-lg flex-wrap justify-center gap-2.5">
            {suggestedPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => void submit(prompt)}
                className="hover:border-odl/80 cursor-pointer border border-zinc-600 px-4 py-2 text-center font-mono text-xs text-zinc-400 transition-colors hover:text-zinc-200"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
