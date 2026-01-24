'use client'

import type { PricingTableBlock as PricingTableBlockType } from '@/types/services-blocks'
import { cn } from '@/utilities/ui'
import { Check, Info, X } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'

interface PricingTableBlockProps {
  block: PricingTableBlockType
  className?: string
}

export const PricingTableBlock: React.FC<PricingTableBlockProps> = ({ block, className }) => {
  const { heading, description, billingPeriod = 'monthly', tiers, showComparison = false } = block
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'yearly'>('monthly')

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

  const formatPrice = (price: number, currency: string) => {
    const currencySymbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
    }
    const symbol = currencySymbols[currency] || currency
    return `${symbol}${price.toLocaleString()}`
  }

  const getPeriodLabel = (period: string) => {
    const labels: Record<string, string> = {
      month: '/mo',
      year: '/yr',
      project: '/project',
      hour: '/hr',
    }
    return labels[period] || `/${period}`
  }

  const renderPricingCard = (tier: any, index: number) => {
    const hasLink = tier.ctaLink && (tier.ctaLink.url || tier.ctaLink.reference)

    return (
      <div
        key={index}
        className={cn(
          'relative p-8 rounded-lg border-2 flex flex-col',
          tier.highlighted
            ? 'border-brand-primary bg-white dark:bg-zinc-900 shadow-xl scale-105'
            : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900',
        )}
      >
        {/* Badge */}
        {tier.highlighted && tier.badge && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <span className="px-4 py-1 rounded-full bg-brand-primary text-white text-sm font-medium">
              {tier.badge}
            </span>
          </div>
        )}

        {/* Tier Name */}
        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">{tier.name}</h3>

        {/* Description */}
        {tier.description && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">{tier.description}</p>
        )}

        {/* Price */}
        <div className="mb-6">
          <div className="flex items-baseline">
            <span className="text-4xl font-bold text-zinc-900 dark:text-white">
              {formatPrice(tier.price, tier.currency)}
            </span>
            <span className="text-zinc-600 dark:text-zinc-400 ml-2">
              {getPeriodLabel(tier.period)}
            </span>
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-3 mb-8 flex-1">
          {tier.features?.map((feature: any, featureIndex: number) => (
            <li key={featureIndex} className="flex items-start gap-3">
              {feature.included ? (
                <Check className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
              ) : (
                <X className="w-5 h-5 text-zinc-400 dark:text-zinc-600 flex-shrink-0 mt-0.5" />
              )}
              <span
                className={cn(
                  'text-sm',
                  feature.included
                    ? 'text-zinc-700 dark:text-zinc-300'
                    : 'text-zinc-500 dark:text-zinc-500 line-through',
                )}
              >
                {feature.text}
                {feature.tooltip && (
                  <button
                    className="ml-1 inline-flex"
                    title={feature.tooltip}
                    aria-label={feature.tooltip}
                  >
                    <Info className="w-4 h-4 text-zinc-400" />
                  </button>
                )}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        {hasLink ? (
          <Link
            href={getLinkHref(tier.ctaLink)}
            target={tier.ctaLink?.newTab ? '_blank' : undefined}
            rel={tier.ctaLink?.newTab ? 'noopener noreferrer' : undefined}
            className={cn(
              'w-full py-3 px-6 rounded-lg font-medium text-center transition-colors',
              tier.highlighted
                ? 'bg-brand-primary text-white hover:bg-brand-primary/90'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700',
            )}
          >
            {tier.ctaText}
          </Link>
        ) : (
          <button
            className={cn(
              'w-full py-3 px-6 rounded-lg font-medium text-center transition-colors',
              tier.highlighted
                ? 'bg-brand-primary text-white hover:bg-brand-primary/90'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700',
            )}
          >
            {tier.ctaText}
          </button>
        )}
      </div>
    )
  }

  const renderComparisonTable = () => {
    if (!showComparison || !tiers) return null

    // Get all unique features across all tiers
    const allFeatures = new Set<string>()
    tiers.forEach((tier) => {
      tier.features?.forEach((feature) => {
        allFeatures.add(feature.text)
      })
    })

    return (
      <div className="mt-16 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-zinc-200 dark:border-zinc-800">
              <th className="text-left p-4 font-semibold text-zinc-900 dark:text-white">
                Features
              </th>
              {tiers.map((tier, index) => (
                <th
                  key={index}
                  className="text-center p-4 font-semibold text-zinc-900 dark:text-white"
                >
                  {tier.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from(allFeatures).map((featureText, index) => (
              <tr key={index} className="border-b border-zinc-200 dark:border-zinc-800">
                <td className="p-4 text-zinc-700 dark:text-zinc-300">{featureText}</td>
                {tiers.map((tier, tierIndex) => {
                  const feature = tier.features?.find((f) => f.text === featureText)
                  return (
                    <td key={tierIndex} className="text-center p-4">
                      {feature?.included ? (
                        <Check className="w-5 h-5 text-brand-primary mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-zinc-400 dark:text-zinc-600 mx-auto" />
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
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

        {/* Billing Period Toggle */}
        {billingPeriod === 'both' && (
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-lg border border-zinc-200 dark:border-zinc-800 p-1">
              <button
                onClick={() => setSelectedPeriod('monthly')}
                className={cn(
                  'px-6 py-2 rounded-md font-medium transition-colors',
                  selectedPeriod === 'monthly'
                    ? 'bg-brand-primary text-white'
                    : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800',
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => setSelectedPeriod('yearly')}
                className={cn(
                  'px-6 py-2 rounded-md font-medium transition-colors',
                  selectedPeriod === 'yearly'
                    ? 'bg-brand-primary text-white'
                    : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800',
                )}
              >
                Yearly
              </button>
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        <div
          className={cn(
            'grid gap-8 mb-8',
            tiers && tiers.length === 1 && 'max-w-md mx-auto',
            tiers && tiers.length === 2 && 'md:grid-cols-2 max-w-4xl mx-auto',
            tiers && tiers.length === 3 && 'md:grid-cols-3',
            tiers && tiers.length >= 4 && 'md:grid-cols-2 lg:grid-cols-4',
          )}
        >
          {tiers?.map((tier, index) => renderPricingCard(tier, index))}
        </div>

        {/* Comparison Table */}
        {renderComparisonTable()}
      </div>
    </section>
  )
}

export default PricingTableBlock
