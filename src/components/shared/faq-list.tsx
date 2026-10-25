'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { Item } from '@/models/content';

export function FaqList({ items }: { items: Item[] }) {
  return (
    <Accordion type='single' collapsible className='w-full'>
      {items.map((f, i) => (
        <AccordionItem key={i} value={`item-${i}`}>
          <AccordionTrigger className='text-left text-base font-semibold'>{f.title}</AccordionTrigger>
          <AccordionContent className='text-base leading-relaxed text-muted-foreground'>
            {f.body}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
