import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Section } from '@/models/content';

export function CtaBand({ section }: { section: Section }) {
  const [primary, secondary] = section.buttons ?? [];
  return (
    <section className='relative isolate overflow-hidden bg-secondary py-16 text-secondary-foreground md:py-20'>
      <div className='pointer-events-none absolute -top-24 -right-24 -z-10 size-96 rounded-full bg-primary/20 blur-3xl' />
      <div className='container mx-auto flex flex-col items-start justify-between gap-8 px-4 md:flex-row md:items-center'>
        <div className='max-w-2xl'>
          <h2 className='font-display text-3xl font-semibold md:text-4xl'>{section.title}</h2>
          {section.body && <p className='mt-3 text-lg text-white/75'>{section.body}</p>}
        </div>
        <div className='flex flex-wrap gap-3'>
          {primary && (
            <Button asChild size='lg' className='h-12 px-6 text-base'>
              <Link href={primary.href}>
                {primary.title}
                <ArrowRight />
              </Link>
            </Button>
          )}
          {secondary && (
            <Button
              asChild
              size='lg'
              variant='outline'
              className='h-12 border-white/30 bg-transparent px-6 text-base text-white hover:bg-white/10 hover:text-white'
            >
              <Link href={secondary.href}>{secondary.title}</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
