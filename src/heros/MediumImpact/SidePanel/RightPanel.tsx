'use client'

import React from 'react'
import type { Page, Media } from '@/payload-types'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import Image from 'next/image'

interface RightPanelProps {
  activeWork: NonNullable<Page['hero']['activeWork']>
  availability: NonNullable<Page['hero']['availability']>
  media: Page['hero']['media']
}

export const RightPanel: React.FC<RightPanelProps> = ({ activeWork, availability, media }) => {
  return (
    <div className="lg:col-span-5 w-full">
      <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold text-lg">Active Client Work</h3>
        </div>

        {/* Projects List */}
        {activeWork.includeProject && Array.isArray(activeWork.projects) && activeWork.projects.length > 0 && (
          <div className="flex flex-col gap-4 mb-6">
            {activeWork.projects.slice(0, 2).map((project, i) => (
              <div
                key={i}
                className="bg-gray-50 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800/50 rounded-sm p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-500 dark:text-gray-400 font-medium text-sm">
                      {project.name}
                    </span>
                    {project.status && (
                      <Badge
                        variant="outline"
                        className="bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-100 dark:border-green-500/20 px-2 py-0 h-5 text-[10px] rounded-full flex items-center gap-1.5 w-fit"
                      >
                        <div className="size-1 rounded-full bg-green-500 animate-pulse" />
                        {project.status}
                      </Badge>
                    )}
                  </div>
                  <span className="font-bold text-sm">{project.progress}%</span>
                </div>

                <Progress value={project.progress ?? 0} className="h-1.5" />

                {project.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-1">
                    {project.description}
                  </p>
                )}
              </div>
            ))}

            {activeWork.projects.length > 2 && (
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center italic">
                + {activeWork.projects.length - 2} additional projects currently active
              </p>
            )}
          </div>
        )}

        {/* Availability Indicator (Image) */}
        {availability?.status === 'now' && media && (
          <div className="relative h-60 w-full aspect-4/1 rounded-sm overflow-hidden mt-4">
             {typeof media === 'object' && media?.url && (
                <Image
                  src={media.url}
                  alt="Client seat available now"
                  fill
                  className="object-cover"
                />
             )}
          </div>
        )}
      </div>
    </div>
  )
}
