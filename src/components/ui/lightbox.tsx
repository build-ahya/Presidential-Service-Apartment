'use client';

import * as React from 'react';
import Image from 'next/image';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { ChevronLeft, ChevronRight, Play, X, ZoomIn, ZoomOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getYouTubeId, youTubeThumbnail } from '@/lib/video';

export interface LightboxItem {
  url: string;
  alt?: string;
  caption?: string;
  type?: 'image' | 'video';
}

/** Thumbnail to show for an item (YouTube videos use their poster frame). */
export function lightboxThumb(item: LightboxItem) {
  if (item.type === 'video') {
    const id = getYouTubeId(item.url);
    return id ? youTubeThumbnail(id) : '';
  }
  return item.url;
}

/** State helper: `const lb = useLightbox(); <Lightbox items={..} {...lb.props} />` and `lb.openAt(i)`. */
export function useLightbox() {
  const [index, setIndex] = React.useState<number | null>(null);
  return {
    openAt: (i: number) => setIndex(i),
    props: {
      index,
      onIndexChange: (i: number | null) => setIndex(i),
    },
  };
}

export function Lightbox({
  items,
  index,
  onIndexChange,
}: {
  items: LightboxItem[];
  index: number | null;
  onIndexChange: (index: number | null) => void;
}) {
  const open = index !== null && items.length > 0;
  const [zoomed, setZoomed] = React.useState(false);
  const thumbsRef = React.useRef<HTMLDivElement>(null);
  const touchStart = React.useRef<number | null>(null);
  const count = items.length;

  const go = React.useCallback(
    (delta: number) => {
      if (index === null || count === 0) return;
      setZoomed(false);
      onIndexChange((index + delta + count) % count);
    },
    [index, count, onIndexChange]
  );

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, go]);

  React.useEffect(() => {
    if (index === null) return;
    thumbsRef.current
      ?.querySelector<HTMLElement>(`[data-index="${index}"]`)
      ?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }, [index]);

  const item = index !== null ? items[index] : undefined;
  const ytId = item?.type === 'video' ? getYouTubeId(item.url) : null;
  const next = index !== null && count > 1 ? items[(index + 1) % count] : undefined;

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          setZoomed(false);
          onIndexChange(null);
        }
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className='fixed inset-0 z-50 bg-black data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0' />
        <DialogPrimitive.Content
          className='fixed inset-0 z-50 flex flex-col text-white outline-none'
          aria-describedby={undefined}
        >
          <DialogPrimitive.Title className='sr-only'>Photo gallery</DialogPrimitive.Title>

          <div className='flex items-center justify-between px-4 py-3'>
            <span className='text-sm font-medium tabular-nums text-white/80'>
              {index !== null ? index + 1 : 0} / {count}
            </span>
            <div className='flex items-center gap-1'>
              {item?.type !== 'video' && (
                <button
                  type='button'
                  onClick={() => setZoomed((z) => !z)}
                  className='grid size-10 place-items-center rounded-full hover:bg-white/10'
                  aria-label={zoomed ? 'Zoom out' : 'Zoom in'}
                >
                  {zoomed ? <ZoomOut className='size-5' /> : <ZoomIn className='size-5' />}
                </button>
              )}
              <DialogPrimitive.Close
                className='grid size-10 place-items-center rounded-full hover:bg-white/10'
                aria-label='Close'
              >
                <X className='size-5' />
              </DialogPrimitive.Close>
            </div>
          </div>

          <div
            className='relative min-h-0 flex-1'
            onTouchStart={(e) => (touchStart.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchStart.current === null || zoomed) return;
              const dx = e.changedTouches[0].clientX - touchStart.current;
              if (Math.abs(dx) > 50) go(dx > 0 ? -1 : 1);
              touchStart.current = null;
            }}
          >
            {item &&
              (item.type === 'video' ? (
                ytId ? (
                  <iframe
                    key={item.url}
                    className='absolute inset-0 m-auto h-full max-h-[80vh] w-full max-w-5xl'
                    src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
                    title={item.alt || item.caption || 'Video'}
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                    allowFullScreen
                  />
                ) : (
                  <video
                    key={item.url}
                    className='absolute inset-0 m-auto max-h-full max-w-full'
                    src={item.url}
                    controls
                    autoPlay
                  />
                )
              ) : (
                <div
                  className={cn(
                    'absolute inset-0 overflow-auto',
                    zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
                  )}
                  onClick={() => setZoomed((z) => !z)}
                >
                  <div
                    className={cn(
                      'relative transition-[width,height] duration-200',
                      zoomed ? 'h-[200%] w-[200%]' : 'h-full w-full'
                    )}
                  >
                    <Image
                      key={item.url}
                      src={item.url}
                      alt={item.alt || item.caption || 'Photo'}
                      fill
                      sizes='100vw'
                      className='object-contain'
                      priority
                    />
                  </div>
                </div>
              ))}

            {count > 1 && (
              <>
                <button
                  type='button'
                  onClick={() => go(-1)}
                  className='absolute top-1/2 left-3 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/50 backdrop-blur hover:bg-black/70'
                  aria-label='Previous'
                >
                  <ChevronLeft className='size-6' />
                </button>
                <button
                  type='button'
                  onClick={() => go(1)}
                  className='absolute top-1/2 right-3 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/50 backdrop-blur hover:bg-black/70'
                  aria-label='Next'
                >
                  <ChevronRight className='size-6' />
                </button>
              </>
            )}
          </div>

          {item?.caption && (
            <p className='px-4 pt-2 text-center text-sm text-white/80'>{item.caption}</p>
          )}

          {count > 1 && (
            <div
              ref={thumbsRef}
              className='scrollbar-none flex gap-2 overflow-x-auto px-4 py-3'
            >
              {items.map((it, i) => {
                const thumb = lightboxThumb(it);
                return (
                  <button
                    key={`${it.url}-${i}`}
                    type='button'
                    data-index={i}
                    onClick={() => {
                      setZoomed(false);
                      onIndexChange(i);
                    }}
                    className={cn(
                      'relative h-14 w-20 shrink-0 overflow-hidden rounded-md bg-white/10 ring-offset-2 ring-offset-black transition',
                      i === index ? 'opacity-100 ring-2 ring-primary' : 'opacity-60 hover:opacity-100'
                    )}
                    aria-label={`Show item ${i + 1}`}
                  >
                    {thumb && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={thumb} alt='' className='size-full object-cover' loading='lazy' />
                    )}
                    {it.type === 'video' && (
                      <span className='absolute inset-0 grid place-items-center bg-black/30'>
                        <Play className='size-4 fill-white' />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Warm the next image so arrow navigation feels instant. */}
          {next?.type !== 'video' && next && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={next.url} alt='' className='hidden' />
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
