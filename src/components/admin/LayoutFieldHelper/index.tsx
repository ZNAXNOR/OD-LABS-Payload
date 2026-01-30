'use client'
import { useFormFields } from '@payloadcms/ui'
import React, { useState } from 'react'

const BLOCK_RECOMMENDATIONS = {
  page: {
    title: 'Regular Page Blocks',
    description: 'Recommended blocks for general content pages',
    blocks: [
      { name: 'Hero', description: 'Page header with title and call-to-action' },
      { name: 'Content', description: 'Rich text content with formatting' },
      { name: 'Call to Action', description: 'Buttons and action prompts' },
      { name: 'Media Block', description: 'Images, videos, and galleries' },
    ],
  },
  blog: {
    title: 'Blog Post Blocks',
    description: 'Ideal blocks for blog articles and content marketing',
    blocks: [
      { name: 'Content', description: 'Main article content with rich formatting' },
      { name: 'Code', description: 'Code snippets and technical examples' },
      { name: 'Media Block', description: 'Images and diagrams to support content' },
      { name: 'Call to Action', description: 'Newsletter signup, related posts' },
    ],
  },
  service: {
    title: 'Service Page Blocks',
    description: 'Perfect blocks for showcasing services and capabilities',
    blocks: [
      { name: 'Hero', description: 'Service introduction and value proposition' },
      { name: 'Services Grid', description: 'Display multiple services in a grid' },
      { name: 'Pricing Table', description: 'Service pricing and packages' },
      { name: 'Process Steps', description: 'How your service works' },
      { name: 'Tech Stack', description: 'Technologies and tools used' },
      { name: 'Testimonial', description: 'Client testimonials and reviews' },
      { name: 'Case Study', description: 'Detailed project examples' },
    ],
  },
  legal: {
    title: 'Legal Document Blocks',
    description: 'Structured blocks for legal content and policies',
    blocks: [
      { name: 'Content', description: 'Legal text with proper formatting' },
      { name: 'FAQ Accordion', description: 'Common questions about policies' },
      { name: 'Timeline', description: 'Policy changes and effective dates' },
      { name: 'Contact Form', description: 'Legal inquiries and questions' },
    ],
  },
  contact: {
    title: 'Contact Page Blocks',
    description: 'Essential blocks for contact and communication pages',
    blocks: [
      { name: 'Hero', description: 'Contact page introduction' },
      { name: 'Contact Form', description: 'Primary contact form' },
      { name: 'Content', description: 'Contact information and details' },
      { name: 'Social Proof', description: 'Trust indicators and testimonials' },
    ],
  },
}

export const LayoutFieldHelper: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const pageType = useFormFields(([fields]) => fields.pageType?.value as string) || 'page'

  const recommendations = BLOCK_RECOMMENDATIONS[pageType as keyof typeof BLOCK_RECOMMENDATIONS]

  return (
    <div className="layout-field-helper">
      <button
        type="button"
        className="layout-field-helper__toggle"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="layout-field-helper__toggle-icon">{isExpanded ? '▼' : '▶'}</span>
        <span className="layout-field-helper__toggle-text">
          Block Recommendations for {recommendations.title}
        </span>
      </button>

      {isExpanded && (
        <div className="layout-field-helper__content">
          <p className="layout-field-helper__description">{recommendations.description}</p>

          <div className="layout-field-helper__blocks">
            <h4 className="layout-field-helper__blocks-title">Recommended Blocks:</h4>
            <div className="layout-field-helper__blocks-grid">
              {recommendations.blocks.map((block, index) => (
                <div key={index} className="layout-field-helper__block">
                  <strong className="layout-field-helper__block-name">{block.name}</strong>
                  <p className="layout-field-helper__block-description">{block.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="layout-field-helper__tips">
            <h4 className="layout-field-helper__tips-title">Layout Tips:</h4>
            <ul className="layout-field-helper__tips-list">
              <li>Start with a Hero block for important pages</li>
              <li>Use Content blocks for main text and information</li>
              <li>Add Call to Action blocks to guide user behavior</li>
              <li>Consider the user journey when ordering blocks</li>
              <li>Test your layout on different screen sizes</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default LayoutFieldHelper
