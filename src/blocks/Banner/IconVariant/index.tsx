import React from 'react'
import { cn } from '@/utilities/ui'
import { ShieldCheck, Shield } from 'lucide-react'
import { Card } from '@/components/ui/card'
import RichText from '@/components/RichText'
import type { BannerBlock as BannerBlockProps } from 'src/payload-types'

type Props = {
  className?: string
} & BannerBlockProps

export const IconVariant: React.FC<Props> = ({
  className,
  content,
}) => {
  return (
    <section className={cn('max-w-7xl mx-auto px-8 py-8', className)}>
      <Card className="bg-black text-white rounded-3xl px-12 py-16 text-center relative overflow-hidden border-none">
        {/* Background Icon */}
        <div className="absolute top-0 right-0 opacity-10 p-8 text-8xl pointer-events-none">
          <Shield className="w-32 h-32" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="flex justify-center mb-4">
            <ShieldCheck className="w-12 h-12 text-white" />
          </div>

          <div className="text-xl text-gray-300 leading-relaxed">
            {content && <RichText data={content} enableGutter={false} enableProse={true} />}
          </div>
        </div>
      </Card>
    </section>
  )
}
