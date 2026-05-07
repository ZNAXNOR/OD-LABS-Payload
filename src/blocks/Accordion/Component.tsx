import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type { AccordionBlock as AccordionBlockProps } from '@/payload-types'

type Props = {
  className?: string
} & AccordionBlockProps

export const AccordionBlock: React.FC<Props> = ({ heading, items }) => {
  return (
    <section className="px-8 py-24">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {items?.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-lg font-bold hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
