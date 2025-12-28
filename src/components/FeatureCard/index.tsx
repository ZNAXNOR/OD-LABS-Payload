'use client'
import React from 'react'
import { Divider } from '../Divider'

// The `FeatureCard` component is wrapped in `React.memo` to prevent unnecessary re-renders.
// This is a performance optimization that is especially beneficial when this component is
// used in lists, as it will only re-render if its own props have changed, not when
// the parent list component re-renders.
export const FeatureCard: React.FC<{
  title: string
  description: string
}> = React.memo(({ title, description }) => {
  return (
    <li className="group mt-10 first:mt-0">
      <div className="pt-10 group-first:pt-0">
        <div className="hidden group-[&:not(:first-child)]:block mb-10">
          <Divider />
        </div>
        <div>
          <strong className="font-semibold text-neutral-950 dark:text-white">{title}. </strong>
          <span className="text-neutral-600 dark:text-neutral-400">{description}</span>
        </div>
      </div>
    </li>
  )
})

FeatureCard.displayName = 'FeatureCard'
