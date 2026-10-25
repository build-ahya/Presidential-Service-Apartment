'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import { getYouTubeId, youTubeThumbnail } from '@/lib/video';
import { SectionHeading } from '@/components/shared/section-heading';

export function VideoSection({ title, subtitle, url }: { title?: string; subtitle?: string; url?: string }) {
  const [playing, setPlaying] = useState(false);
  if (!url) return null;
  const id = getYouTubeId(url);

  return (
    <section className='bg-secondary py-16 md:py-24'>
      <div className='container mx-auto px-4'>
        <SectionHeading title={title} subtitle={subtitle} tone='light' />
        <div className='relative mx-auto aspect-video w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl'>
          {playing ? (
            id ? (
              <iframe
                title={title || 'Video'}
                src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`}
                className='absolute inset-0 size-full'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                allowFullScreen
              />
            ) : (
              <video src={url} className='absolute inset-0 size-full' controls autoPlay />
            )
          ) : (
            <button
              type='button'
              onClick={() => setPlaying(true)}
              className='group absolute inset-0 grid place-items-center'
              aria-label='Play video'
            >
              {id && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={youTubeThumbnail(id)} alt='' className='absolute inset-0 size-full object-cover opacity-80 transition-opacity group-hover:opacity-100' />
              )}
              <span className='relative grid size-20 place-items-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform group-hover:scale-110'>
                <Play className='ml-1 size-8 fill-current' />
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
