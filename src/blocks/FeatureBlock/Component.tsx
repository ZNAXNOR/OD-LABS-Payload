import React from 'react'
import { Rocket, Settings, Check, Users, Zap, Shield } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { FeatureBlock as FeatureBlockProps } from '@/payload-types'

const iconMap = {
  Rocket: Rocket,
  Settings: Settings,
  Check: Check,
  Users: Users,
  Zap: Zap,
  Shield: Shield,
}

export const FeatureBlock: React.FC<FeatureBlockProps> = (props) => {
  const { heading, items } = props

  return (
    <section className="max-w-7xl mx-auto px-8 py-24">
      <div className="bg-muted rounded-3xl p-12">
        {heading && (
          <h2 className="text-2xl font-bold text-center uppercase tracking-widest text-muted-foreground mb-10">
            {heading}
          </h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items?.map((item, index) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap]

            return (
              <Card key={index} className="border-none shadow-sm rounded-2xl bg-white p-2">
                <CardHeader className="pb-3 p-6">
                  <div className="text-primary mb-2">
                    <Icon size={32} />
                  </div>
                  <CardTitle className="text-lg font-bold">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
