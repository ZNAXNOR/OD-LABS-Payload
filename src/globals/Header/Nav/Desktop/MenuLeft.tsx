import type { Header as HeaderType } from '@/payload-types'
import { CMSLink } from '@/components/ui/Link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/utilities/ui'

type Tab = NonNullable<HeaderType['tabs']>[number]
type Dropdown = NonNullable<Tab['dropdown']>

interface MenuLeftProps {
  label: string
  dropdown: Dropdown
  active: boolean
  direction: 'left' | 'right' | null
}

export function MenuLeft({ label, dropdown, active, direction }: MenuLeftProps) {
  return (
    <div
      className={cn(
        'col-span-3 space-y-8 transition-all duration-300',
        active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
        direction === null ? 'delay-0' : 'delay-0',
      )}
    >
      <div className="space-y-4">
        <span className="text-[11px] font-black text-[#E94235] uppercase tracking-[4px] border-b border-[#E94235]/30 pb-1 inline-block">
          {label}
        </span>
        <h2 className="text-3xl font-medium text-white leading-tight">
          {dropdown.description || `Explore our ${label} solutions.`}
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        {dropdown.descriptionLinks?.map((l, idx) => (
          <CMSLink
            key={idx}
            {...l.link}
            className="group flex items-center gap-3 text-sm font-semibold text-white/60 hover:text-white transition-colors"
          >
            <div className="w-8 h-[1px] bg-white/20 group-hover:w-12 group-hover:bg-[#E94235] transition-all" />
            {l.link.label}
            <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#E94235]" />
          </CMSLink>
        ))}
      </div>
    </div>
  )
}
