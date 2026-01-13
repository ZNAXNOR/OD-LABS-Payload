import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { RichText } from '@/components/RichText'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const payload = await getPayload({ config })
  const pages = await payload.find({
    collection: 'contacts',
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
    collection: 'contacts',
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
    description: `Contact: ${page.title}`,
  }
}

export default async function ContactPage({ params }: PageProps) {
  const { slug } = await params
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'contacts',
    where: { slug: { equals: slug } },
    draft,
    limit: 1,
  })

  if (!result.docs[0]) {
    notFound()
  }

  const page = result.docs[0]

  return (
    <article className="container mx-auto px-4 py-16 max-w-4xl">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{page.title}</h1>
      </header>

      {page.content && <RichText data={page.content} />}

      {/* Contact form integration can be added here if needed */}
      {page.form && (
        <div className="mt-12 p-6 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Contact form integration: Form ID{' '}
            {typeof page.form === 'string' ? page.form : page.form.id}
          </p>
        </div>
      )}
    </article>
  )
}
