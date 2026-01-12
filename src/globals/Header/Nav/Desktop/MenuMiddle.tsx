import type { Header as HeaderType } from '@/payload-types'
import { CMSLink } from '@/components/CMSLink'
import { cn } from '@/utilities/ui'

type Tab = NonNullable<HeaderType['tabs']>[number]
type Dropdown = NonNullable<Tab['dropdown']>

interface MenuMiddleProps {
  dropdown: Dropdown
  active: boolean
  direction: 'left' | 'right' | null
}

export function MenuMiddle({ dropdown, active, direction }: MenuMiddleProps) {
  return (
    <div
      className={cn(
        'col-span-3 transition-all duration-300',
        active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
        direction === null ? 'delay-[75ms]' : 'delay-0',
      )}
    >
      <div className="grid grid-cols-2 gap-x-12 gap-y-10">
        {dropdown.navItems
          ?.filter((item) => item.style !== 'featured')
          .map((item, idx) => (
            <div key={idx} className="space-y-6">
              {item.style === 'list' && (
                <div className="space-y-5">
                  {item.listLinks?.tag && (
                    <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[2px] mb-4">
                      {item.listLinks.tag}
                    </h4>
                  )}
                  <div className="flex flex-col gap-4">
                    {item.listLinks?.links?.map((ll, lidx) => (
                      <CMSLink
                        key={lidx}
                        {...ll.link}
                        className="text-sm font-medium text-white/50 hover:text-white transition-colors"
                        label={null}
                      >
                        {ll.link.label}
                      </CMSLink>
                    ))}
                  </div>
                </div>
              )}

              {item.style === 'default' && item.defaultLink && (
                <CMSLink
                  {...item.defaultLink.link}
                  className="group/item block space-y-2 translate-all"
                  label={null}
                >
                  <span className="text-sm font-bold text-white group-hover/item:text-[#E94235] transition-colors block">
                    {item.defaultLink.link.label}
                  </span>
                  {item.defaultLink.description && (
                    <span className="text-xs text-white/40 block leading-relaxed line-clamp-2">
                      {item.defaultLink.description}
                    </span>
                  )}
                </CMSLink>
              )}
            </div>
          ))}
      </div>
    </div>
  )
}
