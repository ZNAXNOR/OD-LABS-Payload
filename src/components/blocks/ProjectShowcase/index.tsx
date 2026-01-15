'use client'

import React, { useState, useMemo } from 'react'
import type { ProjectShowcaseBlock as ProjectShowcaseBlockType } from '@/payload-types'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import Image from 'next/image'
import { ExternalLink, Github } from 'lucide-react'

interface ProjectShowcaseBlockProps {
  block: ProjectShowcaseBlockType
  className?: string
}

export const ProjectShowcaseBlock: React.FC<ProjectShowcaseBlockProps> = ({ block, className }) => {
  const {
    heading,
    description,
    layout = 'grid',
    columns = '3',
    projects,
    enableFiltering = true,
    filterCategories,
    showLoadMore = false,
    itemsPerPage = 6,
  } = block

  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [visibleCount, setVisibleCount] = useState(itemsPerPage)

  // Extract unique categories from projects
  const categories = useMemo(() => {
    if (filterCategories && filterCategories.length > 0) {
      return filterCategories.map((cat) => cat.category).filter(Boolean)
    }
    const uniqueCategories = new Set(projects?.map((p) => p.category).filter(Boolean))
    return Array.from(uniqueCategories)
  }, [projects, filterCategories])

  // Filter projects by selected category
  const filteredProjects = useMemo(() => {
    if (!projects) return []
    if (selectedCategory === 'all') return projects
    return projects.filter((p) => p.category === selectedCategory)
  }, [projects, selectedCategory])

  // Apply pagination
  const displayedProjects = showLoadMore
    ? filteredProjects.slice(0, visibleCount)
    : filteredProjects

  const hasMore = showLoadMore && visibleCount < filteredProjects.length

  const columnClasses = {
    '2': 'md:grid-cols-2',
    '3': 'md:grid-cols-2 lg:grid-cols-3',
    '4': 'md:grid-cols-2 lg:grid-cols-4',
  }

  const getImageUrl = (image: any) => {
    if (!image) return ''
    if (typeof image === 'string') return image
    return image.url || ''
  }

  const getLinkHref = (linkData: any) => {
    if (!linkData) return '#'
    if (linkData.type === 'custom') return linkData.url || '#'
    if (linkData.type === 'reference' && linkData.reference) {
      const ref = linkData.reference
      if (typeof ref === 'object' && ref.slug) {
        return `/${ref.slug}`
      }
    }
    return '#'
  }

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
        {enableFiltering && categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button
              onClick={() => setSelectedCategory('all')}
              className={cn(
                'px-4 py-2 rounded-lg font-medium transition-colors',
                selectedCategory === 'all'
                  ? 'bg-brand-primary text-white'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700',
              )}
            >
              All Projects
            </button>
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
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Projects Grid */}
        <div
          className={cn(
            'grid grid-cols-1 gap-8',
            layout === 'grid' && columnClasses[columns as keyof typeof columnClasses],
            layout === 'masonry' && columnClasses[columns as keyof typeof columnClasses],
            layout === 'carousel' && 'md:grid-cols-1',
          )}
        >
          {displayedProjects?.map((project, index) => {
            const imageUrl = getImageUrl(project.image)
            const hasLink = project.link && (project.link.url || project.link.reference)

            return (
              <div
                key={index}
                className={cn(
                  'group relative bg-white dark:bg-zinc-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all',
                  project.featured && 'ring-2 ring-brand-primary',
                )}
              >
                {/* Project Image */}
                {imageUrl && (
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={project.title || 'Project'}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {project.featured && (
                      <div className="absolute top-4 right-4 bg-brand-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                        Featured
                      </div>
                    )}
                  </div>
                )}

                {/* Project Content */}
                <div className="p-6">
                  {/* Category Badge */}
                  {project.category && (
                    <span className="inline-block px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm rounded-full mb-3">
                      {project.category}
                    </span>
                  )}

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-zinc-600 dark:text-zinc-400 mb-4">{project.description}</p>

                  {/* Technologies */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 bg-brand-primary/10 text-brand-primary text-xs rounded"
                        >
                          {tech.technology}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Links */}
                  <div className="flex items-center gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                    {hasLink && project.link?.label && (
                      <Link
                        href={getLinkHref(project.link)}
                        target={project.link?.newTab ? '_blank' : undefined}
                        rel={project.link?.newTab ? 'noopener noreferrer' : undefined}
                        className="text-brand-primary hover:text-brand-primary/80 font-medium inline-flex items-center text-sm"
                      >
                        {project.link.label}
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-600 dark:text-zinc-400 hover:text-brand-primary dark:hover:text-brand-primary transition-colors"
                        aria-label="View on GitHub"
                      >
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-600 dark:text-zinc-400 hover:text-brand-primary dark:hover:text-brand-primary transition-colors"
                        aria-label="View live site"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center mt-12">
            <button
              onClick={() => setVisibleCount((prev) => prev + itemsPerPage)}
              className="inline-flex items-center px-6 py-3 bg-brand-primary text-white font-medium rounded-lg hover:bg-brand-primary/90 transition-colors"
            >
              Load More Projects
            </button>
          </div>
        )}

        {/* No Projects Message */}
        {displayedProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-zinc-600 dark:text-zinc-400">No projects found in this category.</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default ProjectShowcaseBlock
