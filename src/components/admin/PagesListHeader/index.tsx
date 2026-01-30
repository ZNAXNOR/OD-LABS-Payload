'use client'
import React from 'react'

interface PagesListHeaderProps {
  // Standard Payload list header props
  hasCreatePermission?: boolean
  newDocumentURL?: string
}

export const PagesListHeader: React.FC<PagesListHeaderProps> = ({
  hasCreatePermission,
  newDocumentURL,
}) => {
  return (
    <div className="pages-list-header">
      <div className="pages-list-header__content">
        <div className="pages-list-header__info">
          <h1 className="pages-list-header__title">Pages Collection</h1>
          <p className="pages-list-header__description">
            Unified collection for all page types including blogs, services, legal documents, and
            contact pages. Use the page type filter to view specific types of content.
          </p>
        </div>

        {hasCreatePermission && newDocumentURL && (
          <div className="pages-list-header__actions">
            <a href={newDocumentURL} className="btn btn--style-primary btn--size-medium">
              Create New Page
            </a>
          </div>
        )}
      </div>

      <div className="pages-list-header__stats">
        <div className="pages-list-header__stat">
          <span className="pages-list-header__stat-label">Page Types:</span>
          <span className="pages-list-header__stat-value">5 types available</span>
        </div>
      </div>
    </div>
  )
}

export default PagesListHeader
