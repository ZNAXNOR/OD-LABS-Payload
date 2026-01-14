import type { Header as HeaderType } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/utilities/ui'

type Tab = NonNullable<HeaderType['tabs']>[number]
type Dropdown = NonNullable<Tab['dropdown']>

interface MenuRightProps {
  dropdown: Dropdown
  active: boolean
  direction: 'left' | 'right' | null
}

export function MenuRight({ dropdown, active, direction }: MenuRightProps) {
  return (
    <div
      className={cn(
        'col-span-4 transition-all duration-300',
        active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
        direction === null ? 'delay-[150ms]' : 'delay-0',
      )}
    >
      {dropdown.navItems
        ?.filter((item) => item.style === 'featured')
        .map((item, idx) => (
          <div key={idx} className="h-full flex flex-col justify-between">
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.05] transition-all group/card">
              {item.featuredLink?.tag && (
                <span className="inline-block px-2.5 py-1 rounded bg-[#E94235]/10 text-[#E94235] text-[9px] font-black uppercase tracking-widest mb-6">
                  {item.featuredLink.tag}
                </span>
              )}
              <p className="text-lg font-medium text-white/80 leading-snug group-hover/card:text-white transition-colors">
                &quot;{item.featuredLink?.label}&quot;
              </p>
              <div className="space-y-3 pt-6 mt-8 border-t border-white/5">
                {item.featuredLink?.links?.map((fl, fidx) => (
                  <CMSLink
                    key={fidx}
                    {...fl.link}
                    className="flex items-center justify-between text-sm font-bold text-white group/flink"
                    label={null}
                  >
                    {fl.link.label}
                    <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover/flink:border-[#E94235] group-hover/flink:bg-[#E94235] transition-all">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </CMSLink>
                ))}
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}
