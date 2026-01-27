import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { getBlogData, isPreviewMode } from '@/utilities/livePreviewData'
import config from '@payload-config'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

interface PageProps {
  params: Promise<{ slug: string }>
}

// Enable ISR with 60 second revalidation
export const revalidate = 60

export async function generateStaticParams() {
  const payload = await getPayload({ config })
  const pages = await payload.find({
    collection: 'blogs',
    limit: 1000,
    where: {
      _status: { equals: 'published' },
    },
  })

  return pages.docs.map((doc) => ({
    slug: doc.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const blogData = await getBlogData(slug)

  if (!blogData?.doc) {
    return {}
  }

  const page = blogData.doc

  return {
    title: page.title,
    description: `Blog post: ${page.title}`,
  }
}

export default async function BlogPage({ params }: PageProps) {
  const { slug } = await params
  const blogData = await getBlogData(slug)
  const isPreview = await isPreviewMode()

  if (!blogData?.doc) {
    notFound()
  }

  const page = blogData.doc

  return (
    <>
      {/* Preview indicator for development */}
      {isPreview && process.env.NODE_ENV === 'development' && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-2 text-sm">
          <strong>Preview Mode:</strong> You are viewing{' '}
          {blogData.isPreview ? 'draft' : 'published'} content
          {blogData.lastModified && (
            <span className="ml-2">
              (Last modified: {new Date(blogData.lastModified).toLocaleString()})
            </span>
          )}
        </div>
      )}

      {/* Render Hero Block if present */}
      {(page as any).hero && (page as any).hero.length > 0 && (
        <BlockRenderer blocks={(page as any).hero} />
      )}

      {/* Main content */}
      <main id="main-content">
        {(page as any).layout && (page as any).layout.length > 0 ? (
          <BlockRenderer blocks={(page as any).layout} />
        ) : (
          <article className="container mx-auto px-4 py-16 max-w-4xl">
            <header className="mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{page.title}</h1>
              {page.createdAt && (
                <p className="text-sm text-muted-foreground">
                  Published: {new Date(page.createdAt).toLocaleDateString()}
                </p>
              )}
              {isPreview && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Live Preview:</strong> Collection: {blogData.collection} | Status:{' '}
                    {blogData.isPreview ? 'Draft Mode' : 'Published'} | ID: {page.id}
                  </p>
                </div>
              )}
            </header>
            <div className="prose max-w-none">
              <p className="text-muted-foreground">
                This blog post has no content blocks. Add blocks in the admin panel to display
                content.
              </p>
            </div>
          </article>
        )}
      </main>
    </>
  )
}
