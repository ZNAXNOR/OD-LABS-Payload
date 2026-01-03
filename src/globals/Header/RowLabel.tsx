'use client'
import { useRowLabel } from '@payloadcms/ui'

export function RowLabel() {
  const { data, rowNumber } = useRowLabel<any>()
  const label = data?.label || `Tab ${rowNumber !== undefined ? rowNumber + 1 : ''}`
  return <div>{label}</div>
}

export function NavItemRowLabel() {
  const { data, rowNumber } = useRowLabel<any>()
  const label =
    data?.defaultLink?.link?.label ||
    data?.featuredLink?.label ||
    data?.listLinks?.tag ||
    `Item ${rowNumber !== undefined ? rowNumber + 1 : ''}`
  return <div>{label}</div>
}
