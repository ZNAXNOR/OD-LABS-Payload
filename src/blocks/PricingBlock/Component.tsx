import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { CircleCheck } from 'lucide-react'

export type PricingPlan = {
  title: string
  price: string
  description: string
  features?: { text: string; id?: string | null }[]
  highlighted?: boolean | null
  id?: string | null
}

export type PricingBlockProps = {
  blockType: 'pricing'
  heading: string
  subheading?: string | null
  note?: string | null
  plans?: PricingPlan[]
}

export const PricingBlockComponent: React.FC<PricingBlockProps> = (props) => {
  const { heading, subheading, note, plans } = props

  return (
    <section className="max-w-7xl mx-auto px-8 py-24">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>
        {subheading && (
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subheading}</p>
        )}
        {note && (
          <p className="text-xs font-bold text-red-600 uppercase mt-4">{note}</p>
        )}
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans?.map((plan, i) => (
          <Card
            key={plan.id ?? i}
            className={`relative rounded-xl p-0 transition-colors ${
              plan.highlighted
                ? 'border-2 border-black shadow-lg bg-white'
                : 'border border-gray-200 bg-gray-50/50 hover:bg-gray-50'
            }`}
          >
            {/* Most Popular Badge */}
            {plan.highlighted && (
              <div className="absolute top-0 right-6 -translate-y-1/2">
                <Badge className="bg-black text-white text-xs px-3 py-1 rounded-full hover:bg-black">
                  Most Popular
                </Badge>
              </div>
            )}

            <CardHeader className="p-8 pb-0">
              {/* Plan Title */}
              <h4 className="text-sm font-bold uppercase text-red-600 mb-2">
                {plan.title}
              </h4>

              {/* Price */}
              <div className="text-2xl font-extrabold mb-2">{plan.price}</div>

              {/* Description */}
              <p className="text-gray-600 text-sm">{plan.description}</p>
            </CardHeader>

            <CardContent className="p-8 pt-6">
              {/* Features */}
              {plan.features && plan.features.length > 0 && (
                <ul className="space-y-3 text-sm">
                  {plan.features.map((feature, fi) => (
                    <li key={fi} className="flex gap-3">
                      <CircleCheck className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
                      <span className="text-gray-700">{feature.text}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
