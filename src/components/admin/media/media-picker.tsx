'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImagePlus, Link2, MoveLeft, MoveRight, Trash2, X, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { getYouTubeId, youTubeThumbnail } from '@/lib/video';
import { cn } from '@/lib/utils';
import type { Media, MediaAsset } from '@/models/media';
import { MediaLibrary } from './media-library';

export const assetToMedia = (a: MediaAsset): Media => ({
  url: a.url,
  alt: a.alt,
  caption: a.caption,
  type: 'image',
  width: a.width,
  height: a.height,
});

/** Modal wrapper around the media library for choosing one or many files. */
export function MediaPickerDialog({
  open,
  onOpenChange,
  multiple = false,
  onPick,
  title = 'Choose from media library',
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  multiple?: boolean;
  onPick: (assets: MediaAsset[]) => void;
  title?: string;
}) {
  const [chosen, setChosen] = useState<MediaAsset[]>([]);

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) setChosen([]);
        onOpenChange(o);
      }}
    >
      <DialogContent className='flex h-[85vh] flex-col gap-4 sm:max-w-5xl'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {multiple ? 'Select one or more images.' : 'Select an image.'} Upload new files without leaving this window.
          </DialogDescription>
        </DialogHeader>
        <MediaLibrary mode='select' multiple={multiple} onSelectionChange={setChosen} className='flex-1' />
        <DialogFooter>
          <Button variant='ghost' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={chosen.length === 0}
            onClick={() => {
              onPick(chosen);
              setChosen([]);
              onOpenChange(false);
            }}
          >
            {chosen.length > 1 ? `Use ${chosen.length} images` : 'Use image'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** One image URL (CMS fields, logos). */
export function ImageField({
  value,
  onChange,
  label,
  className,
  aspect = 'aspect-video',
}: {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
  aspect?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && <span className='text-sm font-medium'>{label}</span>}
      <div className={cn('relative overflow-hidden rounded-lg border bg-muted', aspect, 'max-w-sm')}>
        {value ? (
          <>
            <Image src={value} alt='' fill sizes='384px' className='object-cover' />
            <Button
              type='button'
              size='icon-sm'
              variant='secondary'
              className='absolute top-2 right-2'
              onClick={() => onChange('')}
              aria-label='Remove image'
            >
              <X />
            </Button>
          </>
        ) : (
          <button
            type='button'
            onClick={() => setOpen(true)}
            className='flex size-full flex-col items-center justify-center gap-1 text-sm text-muted-foreground hover:bg-accent'
          >
            <ImagePlus className='size-6' /> Choose image
          </button>
        )}
      </div>
      {value && (
        <Button type='button' variant='outline' size='sm' className='w-fit' onClick={() => setOpen(true)}>
          Change image
        </Button>
      )}
      <MediaPickerDialog open={open} onOpenChange={setOpen} onPick={([a]) => a && onChange(a.url)} />
    </div>
  );
}

/** A single Media object (featured image). */
export function MediaField({
  value,
  onChange,
  label,
}: {
  value?: Media;
  onChange: (media: Media | undefined) => void;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className='flex flex-col gap-2'>
      {label && <span className='text-sm font-medium'>{label}</span>}
      <div className='relative aspect-video max-w-sm overflow-hidden rounded-lg border bg-muted'>
        {value?.url ? (
          <>
            <Image src={value.url} alt={value.alt} fill sizes='384px' className='object-cover' />
            <Button
              type='button'
              size='icon-sm'
              variant='secondary'
              className='absolute top-2 right-2'
              onClick={() => onChange(undefined)}
              aria-label='Remove image'
            >
              <X />
            </Button>
          </>
        ) : (
          <button
            type='button'
            onClick={() => setOpen(true)}
            className='flex size-full flex-col items-center justify-center gap-1 text-sm text-muted-foreground hover:bg-accent'
          >
            <ImagePlus className='size-6' /> Choose image
          </button>
        )}
      </div>
      {value?.url && (
        <div className='flex max-w-sm gap-2'>
          <Input
            value={value.alt}
            onChange={(e) => onChange({ ...value, alt: e.target.value })}
            placeholder='Alt text'
            aria-label='Alt text'
          />
          <Button type='button' variant='outline' onClick={() => setOpen(true)}>
            Change
          </Button>
        </div>
      )}
      <MediaPickerDialog open={open} onOpenChange={setOpen} onPick={([a]) => a && onChange(assetToMedia(a))} />
    </div>
  );
}

/** Ordered photo / video gallery. */
export function GalleryField({
  value,
  onChange,
  label,
}: {
  value: Media[];
  onChange: (media: Media[]) => void;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [video, setVideo] = useState('');

  const move = (from: number, to: number) => {
    if (to < 0 || to >= value.length) return;
    const next = [...value];
    next.splice(to, 0, next.splice(from, 1)[0]);
    onChange(next);
  };

  const addVideo = () => {
    const url = video.trim();
    if (!url) return;
    onChange([...value, { url, alt: 'Video', type: 'video', width: 1080, height: 1920 }]);
    setVideo('');
  };

  return (
    <div className='flex flex-col gap-3'>
      {label && <span className='text-sm font-medium'>{label}</span>}
      {value.length > 0 && (
        <ul className='grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5'>
          {value.map((m, i) => {
            const thumb = m.type === 'video' ? (getYouTubeId(m.url) ? youTubeThumbnail(getYouTubeId(m.url)!) : '') : m.url;
            return (
              <li key={`${m.url}-${i}`} className='group relative aspect-square overflow-hidden rounded-lg border bg-muted'>
                {thumb &&
                  (m.type === 'video' ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumb} alt='' className='size-full object-cover' />
                  ) : (
                    <Image src={thumb} alt={m.alt} fill sizes='200px' className='object-cover' />
                  ))}
                {m.type === 'video' && (
                  <span className='absolute top-1.5 left-1.5 flex items-center gap-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] text-white'>
                    <Youtube className='size-3' /> Video
                  </span>
                )}
                {i === 0 && (
                  <span className='absolute bottom-1.5 left-1.5 rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground'>
                    First
                  </span>
                )}
                <div className='absolute inset-x-0 top-0 flex justify-end gap-1 bg-gradient-to-b from-black/60 to-transparent p-1.5 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100'>
                  <Button type='button' size='icon-xs' variant='secondary' onClick={() => move(i, i - 1)} disabled={i === 0} aria-label='Move earlier'>
                    <MoveLeft />
                  </Button>
                  <Button type='button' size='icon-xs' variant='secondary' onClick={() => move(i, i + 1)} disabled={i === value.length - 1} aria-label='Move later'>
                    <MoveRight />
                  </Button>
                  <Button type='button' size='icon-xs' variant='destructive' onClick={() => onChange(value.filter((_, j) => j !== i))} aria-label='Remove'>
                    <Trash2 />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <div className='flex flex-wrap items-center gap-2'>
        <Button type='button' variant='outline' onClick={() => setOpen(true)}>
          <ImagePlus /> Add photos
        </Button>
        <div className='flex min-w-64 flex-1 gap-2'>
          <div className='relative flex-1'>
            <Link2 className='absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground' />
            <Input
              value={video}
              onChange={(e) => setVideo(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addVideo();
                }
              }}
              placeholder='Paste a YouTube link to add a video'
              className='pl-9'
            />
          </div>
          <Button type='button' variant='secondary' onClick={addVideo} disabled={!video.trim()}>
            Add
          </Button>
        </div>
      </div>
      <MediaPickerDialog
        open={open}
        onOpenChange={setOpen}
        multiple
        title='Add photos'
        onPick={(assets) => onChange([...value, ...assets.map(assetToMedia)])}
      />
    </div>
  );
}
