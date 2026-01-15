'use client'

import React, { useState } from 'react'
import type { TechStackBlock as TechStackBlockType } from '@/payload-types'
import { cn } from '@/utilities/ui'
import Image from 'next/image'
import * as LucideIcons from 'lucide-react'

interface TechStackBlockProps {
  block: TechStackBlockType
  className?: string
}

export const TechStackBlock: React.FC<TechStackBlockProps> = ({ block, className }) => {
  const {
    heading,
    description,
    layout = 'grid',
    technologies,
    showDescriptions = false,
    enableFiltering = true,
  } = block
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = ['all', 'frontend', 'backend', 'database', 'devops', 'tools', 'other']
  const categoryLabels: Record<string, string> = {
    all: 'All',
    frontend: 'Frontend',
    backend: 'Backend',
    database: 'Database',
    devops: 'DevOps',
    tools: 'Tools',
    other: 'Other',
  }

  const filteredTechnologies =
    selectedCategory === 'all'
      ? technologies
      : technologies?.filter((tech) => tech.category === selectedCategory)

  const getIcon = (tech: any) => {
    // If uploaded icon exists
    if (tech.icon && typeof tech.icon === 'object' && tech.icon.url) {
      return (
        <Image
          src={tech.icon.url}
          alt={tech.icon.alt || tech.name}
          width={48}
          height={48}
          className="w-12 h-12 object-contain"
        />
      )
    }

    // If Lucide icon name provided
    if (tech.iconName) {
      const Icon = (LucideIcons as any)[tech.iconName]
      if (Icon) {
        return <Icon className="w-12 h-12 text-brand-primary" />
      }
    }

    // Default icon
    const DefaultIcon = LucideIcons.Code
    return <DefaultIcon className="w-12 h-12 text-zinc-400 dark:text-zinc-600" />
  }

  const getProficiencyColor = (proficiency?: string) => {
    switch (proficiency) {
      case 'expert':
        return 'bg-green-500'
      case 'advanced':
        return 'bg-blue-500'
      case 'intermediate':
        return 'bg-yellow-500'
      case 'beginner':
        return 'bg-orange-500'
      default:
        return 'bg-zinc-400'
    }
  }

  const renderTechCard = (tech: any, index: number) => (
    <div
      key={index}
      className={cn(
        'p-6 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800',
        'hover:border-brand-primary dark:hover:border-brand-primary transition-colors',
        'flex flex-col items-center text-center',
      )}
    >
      {/* Icon */}
      <div className="mb-4">{getIcon(tech)}</div>

      {/* Name */}
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">{tech.name}</h3>

      {/* Proficiency Badge */}
      {tech.proficiency && (
        <div className="mb-2">
          <span
            className={cn(
              'inline-block px-3 py-1 rounded-full text-xs font-medium text-white',
              getProficiencyColor(tech.proficiency),
            )}
          >
            {tech.proficiency.charAt(0).toUpperCase() + tech.proficiency.slice(1)}
          </span>
        </div>
      )}

      {/* Years Experience */}
      {tech.yearsExperience && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
          {tech.yearsExperience} {tech.yearsExperience === 1 ? 'year' : 'years'} experience
        </p>
      )}

      {/* Description */}
      {showDescriptions && tech.description && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">{tech.description}</p>
      )}
    </div>
  )

  const renderGrid = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
      {filteredTechnologies?.map((tech, index) => renderTechCard(tech, index))}
    </div>
  )

  const renderList = () => (
    <div className="space-y-4">
      {filteredTechnologies?.map((tech, index) => (
        <div
          key={index}
          className={cn(
            'p-6 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800',
            'hover:border-brand-primary dark:hover:border-brand-primary transition-colors',
            'flex items-center gap-6',
          )}
        >
          {/* Icon */}
          <div className="flex-shrink-0">{getIcon(tech)}</div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{tech.name}</h3>
              {tech.proficiency && (
                <span
                  className={cn(
                    'inline-block px-3 py-1 rounded-full text-xs font-medium text-white',
                    getProficiencyColor(tech.proficiency),
                  )}
                >
                  {tech.proficiency.charAt(0).toUpperCase() + tech.proficiency.slice(1)}
                </span>
              )}
            </div>
            {showDescriptions && tech.description && (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{tech.description}</p>
            )}
          </div>

          {/* Years Experience */}
          {tech.yearsExperience && (
            <div className="flex-shrink-0 text-right">
              <p className="text-2xl font-bold text-brand-primary">{tech.yearsExperience}</p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                {tech.yearsExperience === 1 ? 'year' : 'years'}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  )

  const renderCarousel = () => (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-6 min-w-max">
        {filteredTechnologies?.map((tech, index) => (
          <div key={index} className="w-48 flex-shrink-0">
            {renderTechCard(tech, index)}
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <section className={cn('py-16 px-4', className)}>
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        {(heading || description) && (
          <div className="text-center mb-12">
            {heading && (
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
                {heading}
              </h2>
            )}
            {description && (
              <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Category Filter */}
        {enableFiltering && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  'px-4 py-2 rounded-lg font-medium transition-colors',
                  selectedCategory === category
                    ? 'bg-brand-primary text-white'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700',
                )}
              >
                {categoryLabels[category]}
              </button>
            ))}
          </div>
        )}

        {/* Technologies Display */}
        {layout === 'grid' && renderGrid()}
        {layout === 'list' && renderList()}
        {layout === 'carousel' && renderCarousel()}

        {/* Empty State */}
        {(!filteredTechnologies || filteredTechnologies.length === 0) && (
          <div className="text-center py-12">
            <p className="text-zinc-600 dark:text-zinc-400">
              No technologies found in this category.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default TechStackBlock
