import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { CtaBand } from '@/components/shared/cta-band';
import { FaqList } from '@/components/shared/faq-list';
import { SectionHeading } from '@/components/shared/section-heading';
import { Button } from '@/components/ui/button';
import { paragraphs } from '@/lib/html';
import { ContentService } from '@/services/content.service';

export const metadata: Metadata = {
  title: 'About',
  description: 'About Presidential Service Apartments',
};

export default async function About() {
  const { siteContent } = await ContentService.getContent();
  const { hero, comforts, facilities, quote, cta } = siteContent.about;
  const faqs = siteContent.home.faqs;

  return (
    <>
      <section className='bg-muted/50 pt-28 pb-16 md:pt-36 md:pb-24'>
        <div className='container mx-auto grid items-center gap-10 px-4 lg:grid-cols-2 lg:gap-16'>
          <div className='flex flex-col items-start gap-5'>
            {hero.overline && (
              <p className='text-xs font-semibold tracking-[0.2em] text-primary uppercase'>{hero.overline}</p>
            )}
            <h1 className='font-display text-4xl font-semibold text-secondary md:text-6xl'>{hero.title}</h1>
            {hero.subtitle && <p className='text-xl text-muted-foreground'>{hero.subtitle}</p>}
            {paragraphs(hero.body).map((p, i) => (
              <p key={i} className='leading-relaxed text-muted-foreground'>
                {p}
              </p>
            ))}
            {hero.buttons?.[0] && (
              <Button asChild size='lg'>
                <Link href={hero.buttons[0].href}>
                  {hero.buttons[0].title} <ArrowRight />
                </Link>
              </Button>
            )}
          </div>
          {hero.image && (
            <div className='relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl'>
              <Image src={hero.image} alt={hero.title} fill priority sizes='(max-width: 1024px) 100vw, 50vw' className='object-cover' />
            </div>
          )}
        </div>
      </section>

      <section className='py-16 md:py-24'>
        <div className='container mx-auto grid gap-10 px-4 lg:grid-cols-2 lg:gap-16'>
          <div>
            <SectionHeading title={comforts.title} subtitle={comforts.subtitle} align='left' className='mb-8 md:mb-8' />
            <ul className='grid gap-3 sm:grid-cols-2'>
              {comforts.items?.map((c) => (
                <li key={c.title} className='flex items-start gap-3 rounded-xl border bg-card p-4'>
                  <Check className='mt-0.5 size-5 shrink-0 text-primary' />
                  <span>{c.title}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className='flex flex-col gap-6'>
            {comforts.image && (
              <div className='relative aspect-[16/10] overflow-hidden rounded-2xl'>
                <Image src={comforts.image} alt='' fill sizes='(max-width: 1024px) 100vw, 50vw' className='object-cover' />
              </div>
            )}
            {facilities.items?.length ? (
              <div className='rounded-2xl border bg-muted/50 p-6'>
                <h3 className='font-display mb-3 text-xl font-semibold'>{facilities.title}</h3>
                <ul className='grid gap-2 sm:grid-cols-2'>
                  {facilities.items.map((f) => (
                    <li key={f.title} className='flex gap-2 text-muted-foreground'>
                      <Check className='mt-0.5 size-4 shrink-0 text-primary' /> {f.title}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {quote.body && (
        <section className='bg-secondary py-16 text-secondary-foreground md:py-20'>
          <div className='container mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 text-center'>
            {quote.image && (
              <div className='relative size-24 overflow-hidden rounded-full ring-2 ring-primary'>
                <Image src={quote.image} alt={quote.title} fill sizes='96px' className='object-cover' />
              </div>
            )}
            <blockquote className='font-display text-2xl leading-relaxed md:text-4xl'>“{quote.body}”</blockquote>
            <p className='text-white/75'>
              <span className='font-semibold text-white'>{quote.title}</span>
              {quote.subtitle && ` · ${quote.subtitle}`}
            </p>
          </div>
        </section>
      )}

      {faqs.items?.length ? (
        <section className='py-16 md:py-24'>
          <div className='container mx-auto max-w-3xl px-4'>
            <SectionHeading title={faqs.title} subtitle={faqs.subtitle} />
            <FaqList items={faqs.items} />
          </div>
        </section>
      ) : null}

      <CtaBand section={cta} />
    </>
  );
}
