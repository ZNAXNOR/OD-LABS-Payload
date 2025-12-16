'use client'
import React from 'react'

export const FeatureCard: React.FC<{
  title: string
  description: string
}> = ({ title, description }) => {
  return (
    <li className="group mt-10 first:mt-0">
      <div className="pt-10 group-first:pt-0 group-first:before:hidden group-first:after:hidden relative before:absolute after:absolute before:bg-od-brand-primary after:bg-border before:top-0 before:left-0 before:h-px before:w-6 after:top-0 after:right-0 after:left-8 after:h-px text-gray-700 dark:text-gray-300">
        <strong className="font-semibold text-foreground">{title} </strong>
        {description}
      </div>
    </li>
  )
}
