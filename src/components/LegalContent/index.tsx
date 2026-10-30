import React from 'react'
import type { RequiredDataFromCollectionSlug } from 'payload'
import RichText from '@/components/RichText'
import { ExternalEmbed } from '@/components/ExternalEmbed'
import './index.scss'

export type LegalPageDoc = RequiredDataFromCollectionSlug<'legal-pages'>

type Props = {
  legalPage: LegalPageDoc
}

const formatEffectiveDate = (date?: string | null) => {
  if (!date) return null

  const parsedDate = new Date(date)
  if (Number.isNaN(parsedDate.getTime())) return null

  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(parsedDate)
}

const LegalHeader: React.FC<{ legalPage: LegalPageDoc; showEffectiveDate?: boolean }> = ({
  legalPage,
  showEffectiveDate = false,
}) => {
  const effectiveDate = showEffectiveDate ? formatEffectiveDate(legalPage.updatedAt) : null

  return (
    <header className="legal-page__header">
      <span className="legal-page__eyebrow">
        <span className="legal-page__eyebrow-square" aria-hidden="true" />
        Legal
      </span>
      <h1 className="legal-page__title">{legalPage.title}</h1>
      {legalPage.meta?.description && (
        <p className="legal-page__description">{legalPage.meta.description}</p>
      )}
      {effectiveDate && (
        <p className="legal-page__effective-date">
          <span>Effective date:</span> <time dateTime={legalPage.updatedAt}>{effectiveDate}</time>
        </p>
      )}
    </header>
  )
}

export const LegalContent: React.FC<Props> = ({ legalPage }) => {
  const isExternalEmbed = legalPage.contentMode === 'externalEmbed' && Boolean(legalPage.embed)

  return (
    <article className="legal-page">
      <div className="container">
        <LegalHeader legalPage={legalPage} showEffectiveDate={!isExternalEmbed} />
        <div className="legal-page__content">
          {isExternalEmbed && legalPage.embed ? (
            <div className="legal-page__embed">
              <ExternalEmbed embed={legalPage.embed} />
            </div>
          ) : (
            legalPage.content && (
              <RichText
                className="legal-page__rich-text"
                data={legalPage.content}
                enableGutter={false}
              />
            )
          )}
        </div>
      </div>
    </article>
  )
}

export default LegalContent
