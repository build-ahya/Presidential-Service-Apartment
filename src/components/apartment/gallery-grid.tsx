'use client';

import Image from 'next/image';
import { Grid2x2, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Lightbox, lightboxThumb, useLightbox, type LightboxItem } from '@/components/ui/lightbox';
import { cn } from '@/lib/utils';

function Tile({
  item,
  index,
  onOpen,
  className,
  priority,
  sizes,
}: {
  item: LightboxItem;
  index: number;
  onOpen: (i: number) => void;
  className?: string;
  priority?: boolean;
  sizes: string;
}) {
  const thumb = lightboxThumb(item);
  return (
    <button
      type='button'
      onClick={() => onOpen(index)}
      className={cn('group relative block overflow-hidden bg-muted', className)}
      aria-label={`Open photo ${index + 1}`}
    >
      {thumb &&
        (item.type === 'video' ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb} alt={item.alt ?? ''} className='size-full object-cover transition-transform duration-500 group-hover:scale-105' />
        ) : (
          <Image
            src={thumb}
            alt={item.alt || item.caption || ''}
            fill
            priority={priority}
            sizes={sizes}
            className='object-cover transition-transform duration-500 group-hover:scale-105'
          />
        ))}
      {item.type === 'video' && (
        <span className='absolute inset-0 grid place-items-center bg-black/20'>
          <span className='grid size-12 place-items-center rounded-full bg-white/90 text-secondary'>
            <Play className='ml-0.5 size-5 fill-current' />
          </span>
        </span>
      )}
    </button>
  );
}

/** Booking-style gallery: one large photo and four small ones, with "show all" opening the lightbox. */
export function GalleryGrid({ items, name }: { items: LightboxItem[]; name: string }) {
  const lb = useLightbox();
  if (items.length === 0) {
    return <div className='aspect-[16/7] rounded-2xl bg-muted' aria-label={`${name} photos coming soon`} />;
  }
  const [main, ...rest] = items;
  const side = rest.slice(0, 4);

  return (
    <>
      {/* Desktop */}
      <div className='relative hidden h-[460px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-2xl md:grid'>
        <Tile
          item={main}
          index={0}
          onOpen={lb.openAt}
          priority
          sizes='50vw'
          className={cn('row-span-2', side.length ? 'col-span-2' : 'col-span-4')}
        />
        {side.map((item, i) => (
          <Tile key={item.url} item={item} index={i + 1} onOpen={lb.openAt} sizes='25vw' />
        ))}
        {items.length > 1 && (
          <Button
            variant='secondary'
            size='sm'
            className='absolute right-4 bottom-4 bg-white/95 text-secondary shadow-lg hover:bg-white'
            onClick={() => lb.openAt(0)}
          >
            <Grid2x2 /> Show all {items.length} photos
          </Button>
        )}
      </div>

      {/* Mobile */}
      <div className='scrollbar-none -mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 md:hidden'>
        {items.slice(0, 8).map((item, i) => (
          <Tile
            key={item.url}
            item={item}
            index={i}
            onOpen={lb.openAt}
            priority={i === 0}
            sizes='85vw'
            className='aspect-[4/3] w-[85%] shrink-0 snap-center rounded-xl'
          />
        ))}
      </div>

      <Lightbox items={items} {...lb.props} />
    </>
  );
}
