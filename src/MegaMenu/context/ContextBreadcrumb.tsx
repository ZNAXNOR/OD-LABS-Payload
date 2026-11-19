import { Fragment } from 'react'
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
    <Breadcrumb className="min-w-0">
      <BreadcrumbList className="flex-wrap gap-1.5 font-mono text-[10px] tracking-wide text-text-muted sm:gap-2">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1
          return (
            <Fragment key={`${item.label}-${index}`}>
              <BreadcrumbItem>
                {isCurrent ? (
                  <BreadcrumbPage className="whitespace-normal break-words text-text-secondary">{item.label}</BreadcrumbPage>
                ) : item.href ? (
                  <BreadcrumbLink asChild className="text-text-muted hover:text-text-primary">
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <span className="text-text-muted">{item.label}</span>
                )}
              </BreadcrumbItem>
              {!isCurrent && <BreadcrumbSeparator className="text-text-muted" />}
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
