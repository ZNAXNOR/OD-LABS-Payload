import React from 'react'
import {
  Rocket,
  Settings,
  Check,
  Users,
  Zap,
  Shield,
} from 'lucide-react'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import type { FeatureBlock as FeatureBlockProps } from '@/payload-types'
import RichText from '@/components/RichText'

const iconMap = {
  Rocket,
  Settings,
  Check,
  Users,
  Zap,
  Shield,
}

export const DefaultFeatureBlock: React.FC<FeatureBlockProps> = ({
  heading,
  subheading,
  items,
  columns = '3',
}) => {
  return (
    <section className="max-w-7xl mx-auto px-8 py-24">
      <div className="bg-muted rounded-3xl p-12">
        {(heading || subheading) && (
          <div className="text-center mb-10">
            {heading && (
              <h2 className="text-2xl font-bold uppercase tracking-widest text-muted-foreground">
                {heading}
              </h2>
            )}

            {subheading && (
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                {subheading}
              </p>
            )}
          </div>
        )}

        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-8`}
        >
          {items?.map((item, index) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap]

            return (
              <Card
                key={index}
                className="border-none shadow-sm rounded-2xl bg-white p-2"
              >
                <CardHeader className="pb-3 p-6">
                  <div className="text-primary mb-2">
                    {Icon && <Icon size={32} />}
                  </div>

                  <CardTitle className="text-lg font-bold">
                    {item.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-6 pt-0">
                  {item.description && (
                    <RichText
                      data={item.description}
                      enableGutter={false}
                      enableProse={false}
                      className="prose prose-sm max-w-none text-muted-foreground"
                    />
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
