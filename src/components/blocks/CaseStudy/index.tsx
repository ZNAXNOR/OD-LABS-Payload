import React from 'react'
import type { CaseStudyBlock as CaseStudyBlockType } from '@/payload-types'
import { cn } from '@/utilities/ui'
import Image from 'next/image'
import * as LucideIcons from 'lucide-react'

interface CaseStudyBlockProps {
  block: CaseStudyBlockType
  className?: string
}

export const CaseStudyBlock: React.FC<CaseStudyBlockProps> = ({ block, className }) => {
  const { client, project, duration, role, challenge, approach, solution, results } = block

  const getImageUrl = (image: any) => {
    if (!image) return ''
    if (typeof image === 'string') return image
    return image.url || ''
  }

  const getIcon = (iconName?: string) => {
    if (!iconName) return null
    const Icon = (LucideIcons as any)[iconName]
    return Icon ? <Icon className="w-8 h-8" /> : null
  }

  return (
    <section className={cn('py-16 px-4', className)}>
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-brand-primary/10 text-brand-primary rounded-full text-sm font-medium mb-4">
            Case Study
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
            {project}
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-6">{client}</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-zinc-600 dark:text-zinc-400">
            {duration && (
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{duration}</span>
              </div>
            )}
            {role && (
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>{role}</span>
              </div>
            )}
          </div>
        </div>

        {/* Challenge Section */}
        {challenge && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-6">
              {challenge.heading}
            </h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {challenge.content}
                </p>
              </div>
              {challenge.image && getImageUrl(challenge.image) && (
                <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src={getImageUrl(challenge.image)}
                    alt="Challenge"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Approach Section */}
        {approach && (
          <div className="mb-16 bg-zinc-50 dark:bg-zinc-900 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-6">
              {approach.heading}
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
              {approach.content}
            </p>
            {approach.steps && approach.steps.length > 0 && (
              <div className="grid md:grid-cols-2 gap-4">
                {approach.steps.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 bg-white dark:bg-zinc-800 p-4 rounded-lg"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <p className="text-zinc-700 dark:text-zinc-300 pt-1">{step.step}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Solution Section */}
        {solution && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-6">
              {solution.heading}
            </h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {solution.image && getImageUrl(solution.image) && (
                <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src={getImageUrl(solution.image)}
                    alt="Solution"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                  {solution.content}
                </p>
                {solution.technologies && solution.technologies.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-3 uppercase tracking-wide">
                      Technologies Used
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {solution.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-brand-primary/10 text-brand-primary text-sm rounded-full"
                        >
                          {tech.technology}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {results && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-6">
              {results.heading}
            </h2>

            {/* Metrics */}
            {results.metrics && results.metrics.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                {results.metrics.map((metric, index) => {
                  const icon = getIcon(metric.icon)
                  return (
                    <div
                      key={index}
                      className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg text-center"
                    >
                      {icon && (
                        <div className="flex justify-center text-brand-primary mb-3">{icon}</div>
                      )}
                      <div className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">
                        {metric.value}
                      </div>
                      {metric.change && (
                        <div
                          className={cn(
                            'text-sm font-medium mb-2',
                            metric.change.startsWith('+') || metric.change.startsWith('-')
                              ? metric.change.startsWith('+')
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                              : 'text-zinc-600 dark:text-zinc-400',
                          )}
                        >
                          {metric.change}
                        </div>
                      )}
                      <div className="text-sm text-zinc-600 dark:text-zinc-400">{metric.label}</div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Testimonial */}
            {results.testimonial && results.testimonial.quote && (
              <div className="bg-brand-primary/5 dark:bg-brand-primary/10 rounded-lg p-8 border-l-4 border-brand-primary">
                <svg
                  className="w-10 h-10 text-brand-primary mb-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-xl text-zinc-900 dark:text-white mb-4 italic">
                  "{results.testimonial.quote}"
                </p>
                {(results.testimonial.author || results.testimonial.role) && (
                  <div className="text-zinc-600 dark:text-zinc-400">
                    {results.testimonial.author && (
                      <div className="font-semibold">{results.testimonial.author}</div>
                    )}
                    {results.testimonial.role && <div>{results.testimonial.role}</div>}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default CaseStudyBlock
