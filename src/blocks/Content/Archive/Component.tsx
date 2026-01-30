// Define local type since ArchiveBlock is not in payload-types
interface ArchiveBlockProps {
  id?: string | null
  blockName?: string | null
  blockType: 'archive'
  introContent?: any
  relationTo?: string
  selectedDocs?: any[]
  limit?: number
  // Add other archive-specific properties as needed
}
import RichText from '@/components/ui/RichText'
import { cn } from '@/utilities/ui'
import React from 'react'

export interface ArchiveComponentProps extends ArchiveBlockProps {
  className?: string
}

export const ArchiveComponent: React.FC<ArchiveComponentProps> = ({
  introContent,
  relationTo,
  selectedDocs,
  limit,
  className,
}) => {
  // Note: populatedDocs and populatedDocsTotal would be populated by a hook or frontend logic
  // For now, we'll use selectedDocs as a fallback
  const docs = selectedDocs || []

  return (
    <section className={cn('archive-block', className)}>
      <div className="container mx-auto px-4 py-16">
        {introContent && (
          <div className="mb-12 text-center">
            <RichText data={introContent} enableGutter={false} />
          </div>
        )}

        {docs && docs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {docs.map((doc: any, index: number) => (
              <div
                key={doc.id || index}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-3">{doc.title}</h3>
                {doc.excerpt && (
                  <p className="text-muted-foreground mb-4 line-clamp-3">{doc.excerpt}</p>
                )}
                {doc.slug && (
                  <a
                    href={`/${relationTo}/${doc.slug}`}
                    className="text-primary hover:underline font-medium"
                  >
                    Read More →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {docs.length > (limit || 10) && (
          <div className="text-center mt-12">
            <p className="text-muted-foreground">
              Showing {Math.min(limit || 10, docs.length)} of {docs.length} items
            </p>
          </div>
        )}

        {(!docs || docs.length === 0) && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No items found.</p>
          </div>
        )}
      </div>
    </section>
  )
}
