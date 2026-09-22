import type { MegaMenuPage } from './pageData'

interface MegaMenu_CurrentPageProps {
  page: MegaMenuPage | null
}

export const MegaMenu_CurrentPage = ({ page }: MegaMenu_CurrentPageProps) => {
  if (!page) return null

  return (
    <section className="space-y-4">
      <div className="font-mono text-xs tracking-widest uppercase text-zinc-500">Current Page</div>

      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-none uppercase">
        {page.title}
      </h1>

      <p className="text-base sm:text-lg pt-1 max-w-2xl text-zinc-400">{page.description}</p>
    </section>
  )
}
