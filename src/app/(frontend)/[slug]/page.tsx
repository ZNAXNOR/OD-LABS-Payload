import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { RenderBlocks } from '@/components/RenderBlocks'
import { HeroBlock } from '@/components/blocks/HeroBlock'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
}

// Enable ISR with 60 second revalidation
export const revalidate = 60

export async function generateStaticParams() {
  const payload = await getPayload({ config })
  const pages = await payload.find({
    collection: 'pages',
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
    collection: 'pages',
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
    description: `Page: ${page.title}`,
  }
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'pages',
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
      {page.hero && page.hero.length > 0 && page.hero[0] && <HeroBlock block={page.hero[0]} />}

      {/* Main content */}
      <main id="main-content">
        {page.layout && page.layout.length > 0 ? (
          <RenderBlocks blocks={page.layout} />
        ) : (
          <article className="container mx-auto px-4 py-16 max-w-4xl">
            <header className="mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{page.title}</h1>
            </header>
            <div className="prose max-w-none">
              <p className="text-muted-foreground">
                This page has no content blocks. Add blocks in the admin panel to display content.
              </p>
            </div>
          </article>
        )}
      </main>
    </>
  )
}
