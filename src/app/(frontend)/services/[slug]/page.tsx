import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import config from '@payload-config'
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
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
    collection: 'services',
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
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'services',
    where: { slug: { equals: slug } },
    draft,
    limit: 1,
  })

  if (!result.docs[0]) {
    return {}
  }

  const page = result.docs[0]

  return {
    title: page.title,
    description: `Service: ${page.title}`,
  }
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'services',
    where: { slug: { equals: slug } },
    draft,
    limit: 1,
  })

  if (!result.docs[0]) {
    notFound()
  }

  const page = result.docs[0]

  return (
    <>
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
            </header>
            <div className="prose max-w-none">
              <p className="text-muted-foreground">
                This service page has no content blocks. Add blocks in the admin panel to display
                content.
              </p>
            </div>
          </article>
        )}
      </main>
    </>
  )
}
