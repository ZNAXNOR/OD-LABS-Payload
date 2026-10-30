import React from 'react'
import type { RequiredDataFromCollectionSlug } from 'payload'
import RichText from '@/components/RichText'
import { ExternalEmbed } from '@/components/ExternalEmbed'
import './index.scss'

export type LegalPageDoc = RequiredDataFromCollectionSlug<'legal-pages'>

type Props = {
  legalPage: LegalPageDoc
}

export const LegalContent: React.FC<Props> = ({ legalPage }) => {
  return (
    <article className="legal-page">
      <div className="container">
        <header className="legal-page__header">
          <span className="legal-page__eyebrow">
            <span className="legal-page__eyebrow-square" aria-hidden="true" />
            Legal
          </span>
          <h1 className="legal-page__title">{legalPage.title}</h1>
          {legalPage.meta?.description && (
            <p className="legal-page__description">{legalPage.meta.description}</p>
          )}
        </header>

        <div className="legal-page__content">
          {legalPage.contentMode === 'externalEmbed' && legalPage.embed ? (
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

