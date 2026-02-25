'use client'

import * as React from 'react'

import { cn } from '@/utilities/ui'

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)}
      {...props}
    />
  ),
)
Card.displayName = 'Card'

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  ),
)
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  ),
)
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
  ),
)
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  ),
)
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
  ),
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import type { Post, Page, Media } from '@/payload-types'

export const ArchiveImageCard: React.FC<{
  post: Post | Page
  className?: string
  relationTo?: 'posts' | 'pages'
}> = ({ post, className, relationTo = 'posts' }) => {
  const image = post.meta?.image as Media
  const href = `/${relationTo}/${post.slug}`

  return (
    <motion.a
      href={href}
      whileHover={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'group relative block overflow-hidden rounded-3xl border bg-muted w-full h-full',
        className,
      )}
    >
      {image?.url && (
        <img
          src={image.url}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

      <CardContent className="absolute inset-0 flex flex-col justify-end p-6">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            {/* @ts-ignore */}
            {post.categories && post.categories.length > 0 && (
              <div className="flex gap-2">
                {/* @ts-ignore */}
                {post.categories.map((cat, i) =>
                  typeof cat === 'object' ? (
                    <span key={i} className="text-[10px] uppercase tracking-wider text-white/70">
                      {cat.title}
                    </span>
                  ) : null,
                )}
              </div>
            )}
            <h3 className="text-xl font-bold text-white leading-tight">{post.title}</h3>
          </div>
          <div className="rounded-full bg-white/10 backdrop-blur-md p-2 text-white group-hover:bg-white group-hover:text-black transition-colors">
            <ArrowUpRight className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </motion.a>
  )
}
