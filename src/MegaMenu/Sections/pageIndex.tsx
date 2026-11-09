import type { MegaMenuCategory, MegaMenuEntry } from '../registry'
interface Props {
  categories: MegaMenuCategory[]; activeCategory: string; previewEntry: MegaMenuEntry | null; currentHref: string
  onCategoryChange: (slug: string) => void; onEntryHover: (entry: MegaMenuEntry) => void; onEntrySelect: (entry: MegaMenuEntry) => void
}
export const MegaMenu_PageIndex = ({ categories, activeCategory, previewEntry, currentHref, onCategoryChange, onEntryHover, onEntrySelect }: Props) => {
  const category = categories.find((item) => item.slug === activeCategory) ?? categories[0]
  if (!category) return null
  return <section className="flex min-h-0 flex-1 flex-col pt-5 lg:pt-6">
    <div className="mb-4 flex shrink-0 items-center justify-between gap-4">
      <div className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">Explore</div>
      <div className="font-mono text-[10px] text-zinc-600">{String(category.entries.length).padStart(2, '0')} ITEMS</div>
    </div>
    <div role="tablist" aria-label="Content categories" className="mb-4 flex shrink-0 items-center gap-5 overflow-x-auto border-b border-zinc-800/80">
      {categories.map((item) => {
        const selected = item.slug === category.slug
        return <button key={item.slug} id={'mega-tab-' + item.slug} type="button" role="tab" aria-selected={selected}
          aria-controls="mega-category-index" onClick={() => onCategoryChange(item.slug)}
          className={['relative -mb-px shrink-0 border-b-2 px-0.5 py-3 font-mono text-xs tracking-wide transition-colors',
            selected ? 'border-odl text-white' : 'border-transparent text-zinc-500 hover:text-zinc-200'].join(' ')}>{item.label}</button>
      })}
    </div>
    <nav id="mega-category-index" role="tabpanel" aria-labelledby={'mega-tab-' + category.slug} aria-label={category.label + ' index'}
      className="min-h-0 flex-1 overflow-y-auto pr-2 odl-menu-scroll">
      <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
        {category.entries.map((entry, index) => {
          const selected = previewEntry?.id === entry.id, current = currentHref === entry.href
          return <button key={entry.id} type="button" aria-pressed={selected} aria-current={current ? 'page' : undefined}
            onPointerEnter={() => onEntryHover(entry)} onFocus={() => onEntryHover(entry)} onClick={() => onEntrySelect(entry)}
            className="group flex min-h-16 w-full items-center justify-between gap-5 border-b border-zinc-800/70 py-4 text-left transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-odl">
            <span className="min-w-0">
              {category.layout === 'editorial' && <span className="mb-1 block font-mono text-[10px] tracking-wide text-zinc-600">
                {entry.publishedAt ? new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeZone: 'Asia/Kolkata' }).format(new Date(entry.publishedAt)) : 'PUBLICATION'}
              </span>}
              <span className={['block truncate font-mono font-semibold', category.layout === 'editorial' ? 'text-base sm:text-lg' : 'text-lg sm:text-xl',
                selected ? 'text-odl' : 'text-zinc-200 group-hover:text-white'].join(' ')}>
                {category.layout !== 'editorial' && <span className={['mr-2 text-odl transition-opacity', selected || current ? 'opacity-100' : 'opacity-0'].join(' ')}>[</span>}
                {entry.title}
                {category.layout !== 'editorial' && <span className={['ml-2 text-odl transition-opacity', selected || current ? 'opacity-100' : 'opacity-0'].join(' ')}>] </span>}
              </span>
              {entry.categories && entry.categories.length > 0 && <span className="mt-1 block truncate font-mono text-[10px] text-zinc-500">{entry.categories.join(' / ')}</span>}
            </span>
            <span className={['shrink-0 font-mono text-xs', selected || current ? 'text-odl' : 'text-zinc-600'].join(' ')}>{String(index + 1).padStart(2, '0')}</span>
          </button>
        })}
      </div>
    </nav>
  </section>
}