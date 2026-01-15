'use client'
import React, { useState, useMemo } from 'react'
import { ChevronDownIcon } from '@/icons/ChevronDownIcon'
import { SearchIcon } from '@/icons/SearchIcon'

type FAQ = {
  question: string
  answer: any // Rich text content
  category?: string
}

type FAQAccordionBlockProps = {
  block: {
    blockType: 'faqAccordion'
    heading?: string
    description?: string
    allowMultipleOpen: boolean
    defaultOpen?: string
    showSearch: boolean
    faqs: FAQ[]
  }
}

export function FAQAccordionBlock({ block }: FAQAccordionBlockProps) {
  const { heading, description, allowMultipleOpen, defaultOpen, showSearch, faqs } = block

  const defaultOpenIndices = useMemo(() => {
    if (!defaultOpen) return []
    return defaultOpen.split(',').map((i) => parseInt(i.trim(), 10))
  }, [defaultOpen])

  const [openItems, setOpenItems] = useState<number[]>(defaultOpenIndices)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredFaqs = useMemo(() => {
    if (!searchQuery) return faqs
    const query = searchQuery.toLowerCase()
    return faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(query) ||
        (faq.category && faq.category.toLowerCase().includes(query)),
    )
  }, [faqs, searchQuery])

  const toggleItem = (index: number) => {
    if (allowMultipleOpen) {
      setOpenItems((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
      )
    } else {
      setOpenItems((prev) => (prev.includes(index) ? [] : [index]))
    }
  }

  // Group FAQs by category if categories exist
  const groupedFaqs = useMemo(() => {
    const hasCategories = filteredFaqs.some((faq) => faq.category)
    if (!hasCategories) return { '': filteredFaqs }

    return filteredFaqs.reduce(
      (acc, faq) => {
        const category = faq.category || 'Other'
        if (!acc[category]) acc[category] = []
        acc[category].push(faq)
        return acc
      },
      {} as Record<string, FAQ[]>,
    )
  }, [filteredFaqs])

  const renderAnswer = (answer: any) => {
    // Simple rich text rendering - in production, use proper rich text renderer
    if (typeof answer === 'string') {
      return <p className="text-zinc-600 dark:text-zinc-400">{answer}</p>
    }
    return <div className="text-zinc-600 dark:text-zinc-400">Rich text content</div>
  }

  return (
    <section className="py-16 bg-white dark:bg-zinc-950">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {(heading || description) && (
            <div className="text-center mb-12">
              {heading && (
                <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                  {heading}
                </h2>
              )}
              {description && (
                <p className="text-lg text-zinc-600 dark:text-zinc-400">{description}</p>
              )}
            </div>
          )}

          {showSearch && (
            <div className="mb-8">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>
            </div>
          )}

          {Object.entries(groupedFaqs).map(([category, categoryFaqs]) => (
            <div key={category} className="mb-8">
              {category && (
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                  {category}
                </h3>
              )}

              <div className="space-y-4">
                {categoryFaqs.map((faq, index) => {
                  const globalIndex = faqs.indexOf(faq)
                  const isOpen = openItems.includes(globalIndex)

                  return (
                    <div
                      key={globalIndex}
                      className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleItem(globalIndex)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <span className="font-medium text-zinc-900 dark:text-zinc-100 pr-4">
                          {faq.question}
                        </span>
                        <ChevronDownIcon
                          className={`h-5 w-5 text-zinc-500 flex-shrink-0 transition-transform ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-200 dark:border-zinc-800">
                          {renderAnswer(faq.answer)}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-zinc-600 dark:text-zinc-400">
                No FAQs found matching your search.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
