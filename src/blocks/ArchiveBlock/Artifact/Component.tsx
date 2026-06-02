import type { ArchiveBlock as ArchiveBlockProps } from '@/payload-types'
import React from 'react'
import Link from 'next/link'
import { ArrowRight, FileText } from 'lucide-react'
import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { ArtifactRenderer } from '@/artifacts'

type Props = ArchiveBlockProps & {
  id?: string
}

export const ArtifactArchiveBlock: React.FC<Props> = (props) => {
  const { items, artifactEyebrow, artifactHeading, artifactLink } = props

  if (!items?.length) {
    return null
  }

  const firstItem = items[0]
  const { archive, tag, content, artifact } = firstItem

  const archivePost = typeof archive === 'object' ? archive : null
  const postSlug = archivePost?.slug
  const postTitle = archivePost?.title

  const headerLinkProps = {
    ...(artifactLink ? { ...artifactLink, label: artifactLink.label || 'View all technical notes' } : {}),
  }

  return (
    <div className="max-w-7xl mx-auto px-8">
      {/* Section Header */}
      <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          {artifactEyebrow && (
            <h2 className="text-xl font-bold mb-4 uppercase tracking-wide text-on-surface-variant font-mono">
              {artifactEyebrow}
            </h2>
          )}
          {artifactHeading && (
            <p className="text-4xl md:text-5xl font-bold max-w-2xl text-on-surface leading-tight">
              {artifactHeading}
            </p>
          )}
        </div>
        {headerLinkProps.type && (
          <CMSLink
            className="inline-flex items-center gap-2 font-mono text-sm text-primary hover:underline pb-2 font-bold uppercase tracking-wider"
            {...headerLinkProps}
          >
            <ArrowRight className="w-4 h-4" />
          </CMSLink>
        )}
      </div>

      {/* Featured Artifact Card */}
      <div className="grid md:grid-cols-12 gap-0 border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div className="md:col-span-5 bg-surface-container-low p-12 border-b md:border-b-0 md:border-r border-outline-variant flex flex-col justify-center">
          {tag && (
            <div className="mb-8">
              <span className="text-xs font-mono font-bold uppercase text-on-surface-variant border border-outline-variant px-3 py-1.5 rounded bg-surface">
                {tag}
              </span>
            </div>
          )}

          {postTitle && (
            <h3 className="font-bold text-3xl mb-6 text-on-surface leading-tight">
              {postTitle}
            </h3>
          )}

          {content && (
            <div className="text-lg text-on-surface-variant leading-relaxed mb-10">
              <RichText data={content} enableGutter={false} enableProse={false} />
            </div>
          )}

          {postSlug && (
            <Link
              href={`/posts/${postSlug}`}
              className="inline-flex items-center gap-2 font-mono text-primary font-bold hover:text-primary/80 transition-colors uppercase text-sm tracking-wider"
            >
              <FileText className="w-5 h-5" />
              Read the full analysis
            </Link>
          )}
        </div>

        <div className="md:col-span-7 bg-surface p-8 md:p-12 flex flex-col justify-center items-center relative overflow-hidden">
          {artifact && (
            <div className="w-full relative z-10">
              <ArtifactRenderer artifact={artifact as any} />
            </div>
          )}

          {/* Decorative grid background */}
          <div
            className="absolute inset-0 z-0 opacity-20"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 1px)',
              backgroundSize: '24px 24px',
              color: 'var(--color-on-surface-variant)',
            }}
          />
        </div>
      </div>
    </div>
  )
}
