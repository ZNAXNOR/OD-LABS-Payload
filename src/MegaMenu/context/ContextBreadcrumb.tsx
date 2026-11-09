import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export interface ContextBreadcrumbItem {
  label: string
  href?: string
}

export const ContextBreadcrumb = ({ items }: { items: ContextBreadcrumbItem[] }) => {
  if (items.length === 0) return null

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList className="gap-1.5 font-mono text-[10px] tracking-wide text-zinc-500 sm:gap-2">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1
          return (
            <BreadcrumbItem key={`${item.label}-${index}`}>
              {isCurrent ? (
                <BreadcrumbPage className="max-w-40 truncate text-zinc-300">{item.label}</BreadcrumbPage>
              ) : item.href ? (
                <BreadcrumbLink asChild className="text-zinc-500 hover:text-white">
                  <Link href={item.href}>{item.label}</Link>
                </BreadcrumbLink>
              ) : (
                <span className="text-zinc-500">{item.label}</span>
              )}
              {!isCurrent && <BreadcrumbSeparator className="text-zinc-700" />}
            </BreadcrumbItem>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
