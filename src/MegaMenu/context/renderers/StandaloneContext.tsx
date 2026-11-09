import { Compass } from 'lucide-react'
import type { StandaloneContextData } from '../../types'

export const StandaloneContext = ({ context }: { context: StandaloneContextData }) => (
  <aside className="space-y-4">
    <div className="flex items-center gap-2 font-mono text-[11px] tracking-widest text-zinc-500 uppercase">
      <Compass className="size-3.5 text-odl" aria-hidden="true" />
      Standalone Route
    </div>
    <h2 className="font-mono text-2xl font-bold tracking-tight text-white sm:text-3xl">{context.title}</h2>
    <p className="font-sans text-xs leading-relaxed text-zinc-400 sm:text-sm">{context.description}</p>
  </aside>
)
