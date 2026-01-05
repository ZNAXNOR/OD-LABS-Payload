'use client'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const RowLabel: React.FC<RowLabelProps> = () => {
  const { data, rowNumber } = useRowLabel<any>()

  const label = data?.label
    ? data.label
    : data?.link?.label
      ? data.link.label
      : `Row ${rowNumber !== undefined ? rowNumber + 1 : ''}`

  return <div>{label}</div>
}
