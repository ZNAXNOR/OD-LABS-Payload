'use client'

import React, { useState } from 'react'
import type { TestimonialBlock as TestimonialBlockType } from '@/payload-types'
import { cn } from '@/utilities/ui'
import Image from 'next/image'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'

interface TestimonialBlockProps {
  block: TestimonialBlockType
  className?: string
}

export const TestimonialBlock: React.FC<TestimonialBlockProps> = ({ block, className }) => {
  const { heading, layout = 'grid', testimonials, showRatings = true } = block

  const [currentIndex, setCurrentIndex] = useState(0)

  const getImageUrl = (image: any) => {
    if (!image) return ''
    if (typeof image === 'string') return image
    return image.url || ''
  }

  const nextTestimonial = () => {
    if (!testimonials) return
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    if (!testimonials) return
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const renderStars = (rating?: number) => {
    if (!showRatings || !rating) return null

    return (
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={cn(
              'w-5 h-5',
              index < rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-zinc-200 dark:fill-zinc-700 text-zinc-200 dark:text-zinc-700',
            )}
          />
        ))}
      </div>
    )
  }

  const renderTestimonial = (testimonial: any, index: number) => {
    const avatarUrl = getImageUrl(testimonial.avatar)

    return (
      <div
        key={index}
        className="bg-white dark:bg-zinc-900 rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow"
      >
        {/* Rating */}
        {renderStars(testimonial.rating)}

        {/* Quote */}
        <blockquote className="text-lg text-zinc-700 dark:text-zinc-300 mb-6 italic">
          "{testimonial.quote}"
        </blockquote>

        {/* Author Info */}
        <div className="flex items-center gap-4">
          {avatarUrl && (
            <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
              <Image src={avatarUrl} alt={testimonial.author} fill className="object-cover" />
            </div>
          )}
          <div>
            <div className="font-semibold text-zinc-900 dark:text-white">{testimonial.author}</div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              {testimonial.role}
              {testimonial.company && `, ${testimonial.company}`}
            </div>
            {testimonial.projectType && (
              <div className="text-xs text-brand-primary mt-1">{testimonial.projectType}</div>
            )}
          </div>
        </div>

        {/* Date */}
        {testimonial.date && (
          <div className="text-xs text-zinc-500 dark:text-zinc-500 mt-4">{testimonial.date}</div>
        )}
      </div>
    )
  }

  if (!testimonials || testimonials.length === 0) {
    return null
  }

  return (
    <section className={cn('py-16 px-4', className)}>
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        {heading && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white">
              {heading}
            </h2>
          </div>
        )}

        {/* Single Layout */}
        {layout === 'single' && testimonials.length > 0 && testimonials[0] && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white dark:bg-zinc-900 rounded-lg p-12 shadow-2xl">
              {/* Rating */}
              <div className="flex justify-center mb-6">
                {renderStars(testimonials[0].rating || undefined)}
              </div>

              {/* Quote */}
              <blockquote className="text-2xl text-zinc-700 dark:text-zinc-300 mb-8 italic text-center">
                "{testimonials[0].quote}"
              </blockquote>

              {/* Author Info */}
              <div className="flex flex-col items-center gap-4">
                {getImageUrl(testimonials[0].avatar) && (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden">
                    <Image
                      src={getImageUrl(testimonials[0].avatar) || ''}
                      alt={testimonials[0].author || 'Testimonial author'}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="text-center">
                  <div className="font-semibold text-xl text-zinc-900 dark:text-white">
                    {testimonials[0].author}
                  </div>
                  <div className="text-zinc-600 dark:text-zinc-400">
                    {testimonials[0].role}
                    {testimonials[0].company && `, ${testimonials[0].company}`}
                  </div>
                  {testimonials[0].projectType && (
                    <div className="text-sm text-brand-primary mt-2">
                      {testimonials[0].projectType}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grid Layout */}
        {layout === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => renderTestimonial(testimonial, index))}
          </div>
        )}

        {/* Carousel Layout */}
        {layout === 'carousel' && testimonials[currentIndex] && (
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Testimonial */}
              <div className="bg-white dark:bg-zinc-900 rounded-lg p-12 shadow-2xl">
                {/* Rating */}
                <div className="flex justify-center mb-6">
                  {renderStars(testimonials[currentIndex].rating || undefined)}
                </div>

                {/* Quote */}
                <blockquote className="text-2xl text-zinc-700 dark:text-zinc-300 mb-8 italic text-center">
                  "{testimonials[currentIndex].quote}"
                </blockquote>

                {/* Author Info */}
                <div className="flex flex-col items-center gap-4">
                  {getImageUrl(testimonials[currentIndex].avatar) && (
                    <div className="relative w-16 h-16 rounded-full overflow-hidden">
                      <Image
                        src={getImageUrl(testimonials[currentIndex].avatar) || ''}
                        alt={testimonials[currentIndex].author || 'Testimonial author'}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="text-center">
                    <div className="font-semibold text-xl text-zinc-900 dark:text-white">
                      {testimonials[currentIndex].author}
                    </div>
                    <div className="text-zinc-600 dark:text-zinc-400">
                      {testimonials[currentIndex].role}
                      {testimonials[currentIndex].company &&
                        `, ${testimonials[currentIndex].company}`}
                    </div>
                    {testimonials[currentIndex].projectType && (
                      <div className="text-sm text-brand-primary mt-2">
                        {testimonials[currentIndex].projectType}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              {testimonials.length > 1 && (
                <>
                  <button
                    onClick={prevTestimonial}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 bg-white dark:bg-zinc-800 rounded-full shadow-lg flex items-center justify-center text-zinc-900 dark:text-white hover:bg-brand-primary hover:text-white transition-colors"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextTestimonial}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-12 h-12 bg-white dark:bg-zinc-800 rounded-full shadow-lg flex items-center justify-center text-zinc-900 dark:text-white hover:bg-brand-primary hover:text-white transition-colors"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Dots Indicator */}
              {testimonials.length > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={cn(
                        'w-2 h-2 rounded-full transition-all',
                        index === currentIndex
                          ? 'bg-brand-primary w-8'
                          : 'bg-zinc-300 dark:bg-zinc-700',
                      )}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default TestimonialBlock
