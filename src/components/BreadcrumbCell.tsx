import React from 'react'

interface BreadcrumbCellProps {
  cellData?: Array<{
    doc: string | number
    url: string
    label: string
  }>
}

export const BreadcrumbCell: React.FC<BreadcrumbCellProps> = ({ cellData }) => {
  if (!cellData || !Array.isArray(cellData) || cellData.length === 0) {
    return <span style={{ color: '#666', fontStyle: 'italic' }}>No breadcrumbs</span>
  }

  return (
    <span>
      {cellData.map((crumb, index) => (
        <span key={crumb.doc}>
          {crumb.label}
          {index < cellData.length - 1 && ' > '}
        </span>
      ))}
    </span>
  )
}

export default BreadcrumbCell
