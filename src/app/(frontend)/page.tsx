import { CMSLink } from '@/components/ui/Link'
import config from '@/payload.config'
import { getServicesCollection, isPreviewMode } from '@/utilities/livePreviewData'
import { ArrowRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react'
import { headers as getHeaders } from 'next/headers'
import Image from 'next/image'
import { getPayload } from 'payload'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  await payload.auth({ headers })

  // Fetch services using live preview data utility
  const servicesData = await getServicesCollection({ limit: 3 })
  const services = servicesData.docs
  const isPreview = await isPreviewMode()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Preview indicator for development */}
      {isPreview && process.env.NODE_ENV === 'development' && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-2 text-sm">
          <strong>Preview Mode:</strong> You are viewing draft content
        </div>
      )}

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black text-white">
        {/* Abstract Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/media/hero.webp"
            alt="Premium Hero"
            fill
            className="object-cover scale-110 animate-pulse duration-[10000ms] opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
        </div>

        <div className="container relative z-10 text-center px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Zap className="w-4 h-4 text-primary" />
            <span>Next-Generation Payload CMS</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Design for the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Future of Web
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
            Build high-performance, content-rich applications with OD Labs&apos; cutting-edge
            Payload CMS foundation.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500">
            <CMSLink url="/admin" appearance="default" className="px-8 py-6 text-lg rounded-full">
              Get Started <ArrowRight className="ml-2 w-5 h-5" />
            </CMSLink>
            <CMSLink
              url="https://payloadcms.com/docs"
              appearance="outline"
              className="px-8 py-6 text-lg rounded-full backdrop-blur-sm"
            >
              View Documentation
            </CMSLink>
          </div>
        </div>

        {/* Floating background elements */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center p-1">
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-background">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h2>
              <p className="text-xl text-muted-foreground">
                We provide end-to-end solutions for modern enterprises looking to scale their
                digital presence.
              </p>
            </div>
            <CMSLink url="/services" appearance="link" className="text-lg font-medium group">
              View all services{' '}
              <ArrowRight className="inline-block ml-1 transition-transform group-hover:translate-x-1" />
            </CMSLink>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.length > 0 ? (
              services.map((service, i) => (
                <div
                  key={service.id}
                  className="group p-8 rounded-3xl border bg-card hover:bg-accent transition-colors"
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    {i === 0 ? <Zap /> : i === 1 ? <ShieldCheck /> : <CheckCircle2 />}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                  <p className="text-muted-foreground mb-6 line-clamp-3">
                    {/* Show actual content if available, otherwise fallback */}
                    {service.description ||
                      'Explore our specialized solution designed to accelerate your growth.'}
                  </p>
                  <CMSLink
                    url={`/services/${service.slug}`}
                    appearance="link"
                    className="font-semibold"
                  >
                    Learn more
                  </CMSLink>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center border-2 border-dashed rounded-3xl border-muted">
                <p className="text-xl text-muted-foreground mb-4">
                  No services found. Add some in the admin panel!
                </p>
                <CMSLink url="/admin/collections/services" appearance="default">
                  Add Service
                </CMSLink>
              </div>
            )}
          </div>

          {/* Preview mode indicator for services */}
          {isPreview && services.length > 0 && (
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Live Preview:</strong> Showing {servicesData.totalDocs} services
                {servicesData.isPreview ? ' (including drafts)' : ' (published only)'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-muted/30">
        <div className="container px-4 text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why Choose OD Labs?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the power of a headless CMS combined with a premium design system.
          </p>
        </div>

        <div className="container px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: 'Performance', desc: 'Optimized for Core Web Vitals and speed.' },
            { title: 'Type Safety', desc: 'Fully typed project with TypeScript.' },
            { title: 'SEO Ready', desc: 'Built-in SEO field and structural data.' },
            { title: 'Scalable', desc: 'Next.js and Payload architecture.' },
          ].map((feature, i) => (
            <div key={i} className="p-6 text-left">
              <h4 className="text-xl font-bold mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                {feature.title}
              </h4>
              <p className="text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
