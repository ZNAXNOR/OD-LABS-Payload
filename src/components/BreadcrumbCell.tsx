'use client'

import type { CellComponent } from 'payload'

const BreadcrumbCell: CellComponent = ({ cellData }) => {
  if (!cellData || !Array.isArray(cellData)) {
    return <span>-</span>
  }

  return (
    <div className="breadcrumb-cell">
      {cellData.map((crumb: any, index: number) => (
        <span key={index}>
          {crumb.label || crumb.doc?.title || 'Untitled'}
          {index < cellData.length - 1 && ' > '}
        </span>
      ))}
    </div>
  )
}

export default BreadcrumbCell
