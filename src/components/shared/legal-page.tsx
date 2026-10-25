import { safeHtml } from '@/lib/html';
import type { Section } from '@/models/content';

export function LegalPage({ section }: { section: Section }) {
  return (
    <article className='container mx-auto max-w-3xl px-4 pt-32 pb-20'>
      {section.overline && (
        <p className='mb-3 text-xs font-semibold tracking-[0.2em] text-primary uppercase'>{section.overline}</p>
      )}
      <h1 className='font-display text-4xl font-semibold text-secondary md:text-5xl'>{section.title}</h1>
      {section.subtitle && <p className='mt-3 text-lg text-muted-foreground'>{section.subtitle}</p>}
      <div
        className='prose mt-8 max-w-none prose-headings:font-display prose-headings:text-secondary prose-a:text-secondary'
        dangerouslySetInnerHTML={{ __html: safeHtml(section.body) }}
      />
    </article>
  );
}
