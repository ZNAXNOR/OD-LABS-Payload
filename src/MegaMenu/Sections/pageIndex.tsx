import type { MegaMenuCategory, MegaMenuEntry } from '../registry'

interface Props {
  categories: MegaMenuCategory[]
  activeCategory: string
  previewEntry: MegaMenuEntry | null
  currentHref: string
  onCategoryChange: (slug: string) => void
  onEntryHover: (entry: MegaMenuEntry) => void
  onEntryLeave: () => void
  onEntrySelect: (entry: MegaMenuEntry) => void
}

export const MegaMenu_PageIndex = ({
  categories, activeCategory, previewEntry, currentHref, onCategoryChange, onEntryHover, onEntryLeave, onEntrySelect,
}: Props) => {
  const category = categories.find((item) => item.slug === activeCategory) ?? categories[0]
  if (!category) return null

  return (
    <section className="mt-8 flex min-h-0 flex-1 flex-col pt-5 lg:mt-10 lg:pt-6">
      <div className="mb-4 flex shrink-0 items-center justify-between gap-4">
        <div className="font-mono text-xs tracking-widest text-zinc-500 uppercase">{category.label}</div>
        <div className="font-mono text-[10px] text-zinc-600">{String(category.entries.length).padStart(2, '0')} ITEMS</div>
      </div>

      <div role="tablist" aria-label="Content categories" className="mb-4 flex shrink-0 items-center gap-5 border-b border-zinc-800/80">
        {categories.map((item) => {
          const selected = item.slug === category.slug
          return (
            <button
              key={item.slug}
              id={'mega-tab-' + item.slug}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="mega-category-index"
              onClick={() => onCategoryChange(item.slug)}
              className={[
                'relative -mb-px shrink-0 border-b-2 px-0.5 py-3 font-mono text-xs tracking-wide transition-colors',
                selected ? 'border-odl text-white' : 'border-transparent text-zinc-500 hover:text-zinc-200',
              ].join(' ')}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      <nav
        id="mega-category-index"
        role="tabpanel"
        aria-labelledby={'mega-tab-' + category.slug}
        aria-label={category.label + ' index'}
        className="min-h-0 flex-1 overflow-visible pr-2 lg:overflow-y-auto odl-menu-scroll"
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-0 sm:grid-cols-2">
          {category.entries.map((entry, index) => {
            const selected = previewEntry?.id === entry.id
            const current = currentHref === entry.href
            return (
              <button
                key={entry.id}
                type="button"
                aria-pressed={selected}
                aria-current={current ? 'page' : undefined}
                onPointerEnter={() => onEntryHover(entry)}
                onPointerLeave={onEntryLeave}
                onFocus={() => onEntryHover(entry)}
                onBlur={onEntryLeave}
                onClick={() => onEntrySelect(entry)}
                className="group flex min-h-16 w-full items-center justify-between gap-5 border-b border-zinc-800/70 pb-5 pt-1 text-left font-mono text-xl font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-odl sm:text-2xl lg:text-3xl"
              >
                <span className="inline-flex min-w-0 items-center">
                  <span
                    aria-hidden="true"
                    className={['mr-1.5 text-odl transition-opacity duration-150', selected || current ? 'opacity-100' : 'opacity-0'].join(' ')}
                  >
                    [
                  </span>
                  <span className={[
                    'truncate transition-colors duration-300',
                    selected ? 'text-odl' : 'text-white group-hover:text-odl',
                  ].join(' ')}>
                    {entry.title}
                  </span>
                  <span
                    aria-hidden="true"
                    className={['ml-1.5 text-odl transition-opacity duration-150', selected || current ? 'opacity-100' : 'opacity-0'].join(' ')}
                  >
                    ]
                  </span>
                </span>
                <span className={[
                  'shrink-0 font-mono text-xs font-normal transition-colors duration-300 sm:pr-6 lg:pr-10',
                  selected || current ? 'text-odl' : 'text-zinc-500',
                ].join(' ')}>
                  {String(index + 1).padStart(2, '0')}
                </span>
              </button>
            )
          })}
        </div>
      </nav>
    </section>
  )
}
