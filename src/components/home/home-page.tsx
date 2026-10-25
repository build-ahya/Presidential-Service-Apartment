import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Quote } from 'lucide-react';
import { ApartmentCard } from '@/components/apartment/apartment-card';
import { CtaBand } from '@/components/shared/cta-band';
import { FaqList } from '@/components/shared/faq-list';
import { SectionHeading } from '@/components/shared/section-heading';
import { Button } from '@/components/ui/button';
import { CmsIcon } from '@/components/ui/amenity-icon';
import { SearchBar } from '@/components/search/search-bar';
import { paragraphs } from '@/lib/html';
import type { PageContent } from '@/models/content';
import type { Apartment } from '@/models/apartment';
import type { Post } from '@/models/post';
import type { Property } from '@/models/property';
import { Suspense } from 'react';
import { VideoSection } from './video-section';
import { PostCard } from '@/components/blog/post-card';

export default function HomePage({
  content,
  apartments,
  properties,
  posts,
}: {
  content: PageContent;
  apartments: Apartment[];
  properties: Property[];
  posts: Post[];
}) {
  const { hero, apartments: aptSection, highlights, about, stats, video, testimonials, faqs, blog, cta } = content;
  const featured = [...apartments].sort((a, b) => Number(!!b.featured) - Number(!!a.featured)).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className='relative isolate flex min-h-[640px] items-center justify-center overflow-hidden pt-24 pb-16 text-white md:min-h-[88vh]'>
        {hero.image && (
          <Image src={hero.image} alt='' fill priority sizes='100vw' className='-z-20 object-cover' />
        )}
        <div className='absolute inset-0 -z-10 bg-gradient-to-b from-black/60 via-black/35 to-black/70' />
        <div className='container mx-auto flex flex-col items-center gap-6 px-4 text-center'>
          {hero.overline && (
            <p className='rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] uppercase backdrop-blur'>
              {hero.overline}
            </p>
          )}
          <h1 className='font-display max-w-4xl text-4xl leading-tight font-semibold sm:text-5xl md:text-7xl'>
            {hero.title}
          </h1>
          {hero.subtitle && <p className='max-w-2xl text-base text-white/85 md:text-xl'>{hero.subtitle}</p>}
          <div className='mt-4 w-full max-w-5xl'>
            <Suspense>
              <SearchBar size='large' />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Featured apartments */}
      {featured.length > 0 && (
        <section className='py-16 md:py-24'>
          <div className='container mx-auto px-4'>
            <SectionHeading overline={aptSection.overline} title={aptSection.title} subtitle={aptSection.subtitle} />
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {featured.map((a) => (
                <ApartmentCard key={a.id} apartment={a} property={properties.find((p) => p.id === a.propertyId)} />
              ))}
            </div>
            {aptSection.buttons?.[0] && (
              <div className='mt-10 flex justify-center'>
                <Button asChild variant='outline' size='lg'>
                  <Link href={aptSection.buttons[0].href}>
                    {aptSection.buttons[0].title} <ArrowRight />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Highlights */}
      {highlights.items?.length ? (
        <section className='bg-muted/50 py-16 md:py-24'>
          <div className='container mx-auto px-4'>
            <SectionHeading overline={highlights.overline} title={highlights.title} subtitle={highlights.subtitle} />
            <div className='grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3'>
              {highlights.items.map((item, i) => (
                <div key={i} className='flex gap-4'>
                  <span className='grid size-12 shrink-0 place-items-center rounded-xl bg-primary/15 text-secondary'>
                    <CmsIcon name={item.icon} className='size-6' />
                  </span>
                  <div>
                    <h3 className='text-lg font-semibold'>{item.title}</h3>
                    <p className='mt-1 text-muted-foreground'>{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Introduction */}
      {about.title && (
        <section className='py-16 md:py-24'>
          <div className='container mx-auto grid items-center gap-10 px-4 lg:grid-cols-2 lg:gap-16'>
            <div className='flex flex-col items-start gap-5'>
              {about.overline && (
                <p className='text-xs font-semibold tracking-[0.2em] text-primary uppercase'>{about.overline}</p>
              )}
              <h2 className='font-display text-3xl font-semibold text-secondary md:text-5xl'>{about.title}</h2>
              {paragraphs(about.body).map((p, i) => (
                <p key={i} className='text-lg leading-relaxed text-muted-foreground'>
                  {p}
                </p>
              ))}
              {about.buttons?.[0] && (
                <Button asChild size='lg' variant='secondary'>
                  <Link href={about.buttons[0].href}>
                    {about.buttons[0].title} <ArrowRight />
                  </Link>
                </Button>
              )}
            </div>
            <div className='grid grid-cols-2 gap-4'>
              {(about.images?.length ? about.images : featured.map((a) => a.featuredMedia?.url).filter(Boolean))
                .slice(0, 2)
                .map((src, i) => (
                  <div
                    key={src}
                    className={`relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted ${i === 1 ? 'mt-10' : ''}`}
                  >
                    <Image src={src} alt='' fill sizes='(max-width: 1024px) 50vw, 25vw' className='object-cover' />
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats */}
      {stats.items?.length ? (
        <section className='bg-secondary py-16 text-secondary-foreground md:py-20'>
          <div className='container mx-auto px-4'>
            <SectionHeading overline={stats.overline} title={stats.title} subtitle={stats.subtitle} tone='light' />
            <div className='grid grid-cols-2 gap-8 lg:grid-cols-4'>
              {stats.items.map((s, i) => (
                <div key={i} className='flex flex-col gap-1 border-l-2 border-primary pl-5'>
                  <span className='font-display text-4xl font-semibold text-primary md:text-5xl'>{s.title}</span>
                  <span className='font-semibold'>{s.subtitle}</span>
                  <span className='text-sm text-white/65'>{s.body}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <VideoSection title={video.title} subtitle={video.subtitle} url={video.video} />

      {/* Testimonials */}
      {testimonials.items?.length ? (
        <section className='bg-muted/50 py-16 md:py-24'>
          <div className='container mx-auto px-4'>
            <SectionHeading title={testimonials.title} subtitle={testimonials.subtitle} />
            <div className='grid gap-6 md:grid-cols-3'>
              {testimonials.items.map((t, i) => (
                <figure key={i} className='flex flex-col gap-5 rounded-2xl border bg-card p-7 shadow-sm'>
                  <Quote className='size-8 text-primary' />
                  <blockquote className='flex-1 leading-relaxed'>{t.body}</blockquote>
                  <figcaption>
                    <p className='font-semibold'>{t.title}</p>
                    <p className='text-sm text-muted-foreground'>{t.subtitle}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* FAQs */}
      {faqs.items?.length ? (
        <section className='py-16 md:py-24'>
          <div className='container mx-auto grid gap-10 px-4 lg:grid-cols-[1fr_2fr] lg:gap-16'>
            <SectionHeading title={faqs.title} subtitle={faqs.subtitle} align='left' className='mb-0 md:mb-0' />
            <FaqList items={faqs.items} />
          </div>
        </section>
      ) : null}

      {/* Blog */}
      {posts.length > 0 && (
        <section className='bg-muted/50 py-16 md:py-24'>
          <div className='container mx-auto px-4'>
            <SectionHeading title={blog.title} subtitle={blog.subtitle} />
            <div className='grid gap-6 md:grid-cols-3'>
              {posts.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
            <div className='mt-10 flex justify-center'>
              <Button asChild variant='outline' size='lg'>
                <Link href='/blog'>
                  View all posts <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      <CtaBand section={cta} />
    </>
  );
}
