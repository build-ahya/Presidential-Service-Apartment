'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { Check, Copy, DownloadCloud, ImageOff, Search, Trash2, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { MediaAsset } from '@/models/media';
import { api } from '../api';
import { prepareImage } from './resize';

const ALL = '__all__';
const kb = (n: number) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`);

interface Props {
  /** `select` turns the grid into a picker and hides destructive actions. */
  mode?: 'manage' | 'select';
  multiple?: boolean;
  selected?: string[];
  onSelectionChange?: (assets: MediaAsset[]) => void;
  className?: string;
}

export function MediaLibrary({ mode = 'manage', multiple = false, onSelectionChange, className }: Props) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [folders, setFolders] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [folder, setFolder] = useState(ALL);
  const [query, setQuery] = useState('');
  const [uploadFolder, setUploadFolder] = useState('uploads');
  const [uploading, setUploading] = useState<{ done: number; total: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [picked, setPicked] = useState<string[]>([]);
  const [detail, setDetail] = useState<MediaAsset | null>(null);
  const [importing, setImporting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      const data = await api<{ media: MediaAsset[]; folders: string[] }>('/api/admin/media');
      setAssets(data.media);
      setFolders(data.folders);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return assets.filter(
      (a) =>
        (folder === ALL || a.folder === folder) &&
        (!q || [a.name, a.alt, a.folder].some((v) => v?.toLowerCase().includes(q)))
    );
  }, [assets, folder, query]);

  const upload = async (files: FileList | File[]) => {
    const list = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (list.length === 0) return toast.error('Choose image files (JPEG, PNG, WebP, GIF)');
    setUploading({ done: 0, total: list.length });
    const added: MediaAsset[] = [];
    for (const file of list) {
      try {
        const { blob, width, height } = await prepareImage(file);
        const body = new FormData();
        body.append('file', new File([blob], file.name, { type: blob.type || file.type }));
        body.append('folder', uploadFolder);
        body.append('width', String(width));
        body.append('height', String(height));
        const res = await fetch('/api/admin/media', { method: 'POST', body });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Upload failed');
        added.push(data as MediaAsset);
      } catch (e) {
        toast.error(`${file.name}: ${(e as Error).message}`);
      }
      setUploading((u) => (u ? { ...u, done: u.done + 1 } : u));
    }
    setUploading(null);
    if (added.length) {
      setAssets((prev) => [...added, ...prev]);
      setFolders((prev) => [...new Set([...prev, ...added.map((a) => a.folder)])].sort());
      toast.success(`${added.length} file${added.length === 1 ? '' : 's'} uploaded`);
      if (mode === 'select') {
        const ids = multiple ? [...picked, ...added.map((a) => a.id)] : [added[0].id];
        setPicked(ids);
        onSelectionChange?.([...added, ...assets].filter((a) => ids.includes(a.id)));
      }
    }
  };

  const toggle = (asset: MediaAsset) => {
    if (mode === 'manage') return setDetail(asset);
    const next = multiple
      ? picked.includes(asset.id)
        ? picked.filter((id) => id !== asset.id)
        : [...picked, asset.id]
      : [asset.id];
    setPicked(next);
    onSelectionChange?.(assets.filter((a) => next.includes(a.id)));
  };

  const importExisting = async () => {
    setImporting(true);
    try {
      const { added } = await api<{ added: number }>('/api/admin/media/import', { method: 'POST', body: {} });
      toast.success(added ? `Imported ${added} existing file${added === 1 ? '' : 's'}` : 'Everything is already imported');
      await load();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div
      className={cn('flex min-h-0 flex-col gap-4', className)}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={(e) => e.currentTarget === e.target && setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        void upload(e.dataTransfer.files);
      }}
    >
      <div className='flex flex-wrap items-center gap-2'>
        <div className='relative min-w-48 flex-1'>
          <Search className='absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search files…'
            className='pl-9'
            aria-label='Search files'
          />
        </div>
        <Select value={folder} onValueChange={setFolder}>
          <SelectTrigger className='w-44' aria-label='Folder'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={ALL}>All folders</SelectItem>
              {folders.map((f) => (
                <SelectItem key={f} value={f}>
                  {f}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input
          value={uploadFolder}
          onChange={(e) => setUploadFolder(e.target.value)}
          className='w-36'
          aria-label='Upload folder'
          placeholder='Upload to folder'
          title='Folder new uploads go into'
        />
        <input
          ref={inputRef}
          type='file'
          accept='image/*'
          multiple
          hidden
          onChange={(e) => {
            if (e.target.files) void upload(e.target.files);
            e.target.value = '';
          }}
        />
        <Button onClick={() => inputRef.current?.click()} loading={!!uploading}>
          <UploadCloud /> {uploading ? `Uploading ${uploading.done}/${uploading.total}` : 'Upload'}
        </Button>
        {mode === 'manage' && (
          <Button variant='outline' onClick={importExisting} loading={importing} title='Add files already in your storage bucket'>
            <DownloadCloud /> Import existing
          </Button>
        )}
      </div>

      <div
        className={cn(
          'relative min-h-0 flex-1 overflow-y-auto rounded-xl border-2 border-dashed p-3 transition-colors',
          dragging ? 'border-primary bg-primary/5' : 'border-transparent'
        )}
      >
        {loading ? (
          <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className='aspect-square rounded-lg' />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className='flex flex-col items-center gap-3 py-16 text-center text-muted-foreground'>
            <ImageOff className='size-10' />
            <p>{assets.length === 0 ? 'No files yet. Drag images here or press Upload.' : 'No files match your search.'}</p>
          </div>
        ) : (
          <ul className='grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
            {visible.map((asset) => {
              const isPicked = picked.includes(asset.id);
              return (
                <li key={asset.id}>
                  <button
                    type='button'
                    onClick={() => toggle(asset)}
                    className={cn(
                      'group relative block aspect-square w-full overflow-hidden rounded-lg border bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      isPicked && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                    )}
                    aria-pressed={mode === 'select' ? isPicked : undefined}
                    aria-label={asset.name}
                  >
                    <Image
                      src={asset.url}
                      alt={asset.alt}
                      fill
                      sizes='(max-width: 768px) 50vw, 20vw'
                      className='object-cover transition-transform group-hover:scale-105'
                    />
                    {isPicked && (
                      <span className='absolute top-2 right-2 grid size-6 place-items-center rounded-full bg-primary text-primary-foreground'>
                        <Check className='size-4' />
                      </span>
                    )}
                    <span className='absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/70 to-transparent px-2 pt-6 pb-1.5 text-left text-xs text-white'>
                      {asset.name}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <MediaDetail
        asset={detail}
        onClose={() => setDetail(null)}
        onSaved={(a) => setAssets((prev) => prev.map((p) => (p.id === a.id ? a : p)))}
        onDeleted={(id) => {
          setAssets((prev) => prev.filter((p) => p.id !== id));
          setDetail(null);
        }}
      />
    </div>
  );
}

function MediaDetail({
  asset,
  onClose,
  onSaved,
  onDeleted,
}: {
  asset: MediaAsset | null;
  onClose: () => void;
  onSaved: (a: MediaAsset) => void;
  onDeleted: (id: string) => void;
}) {
  const [alt, setAlt] = useState('');
  const [caption, setCaption] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    setAlt(asset?.alt ?? '');
    setCaption(asset?.caption ?? '');
  }, [asset]);

  if (!asset) return null;

  const save = async () => {
    setSaving(true);
    try {
      const updated = await api<MediaAsset>(`/api/admin/media/${asset.id}`, { method: 'PUT', body: { alt, caption } });
      onSaved(updated);
      toast.success('Saved');
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    try {
      await api(`/api/admin/media/${asset.id}`, { method: 'DELETE' });
      toast.success('File deleted');
      onDeleted(asset.id);
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <>
      <Sheet open onOpenChange={(o) => !o && onClose()}>
        <SheetContent className='w-full gap-0 overflow-y-auto sm:max-w-md'>
          <SheetHeader>
            <SheetTitle className='truncate pr-8'>{asset.name}</SheetTitle>
            <SheetDescription>
              {kb(asset.size)} · {asset.width && asset.height ? `${asset.width}×${asset.height} · ` : ''}
              {asset.folder}
            </SheetDescription>
          </SheetHeader>
          <div className='flex flex-col gap-5 px-4 pb-4'>
            <div className='relative aspect-video overflow-hidden rounded-lg border bg-muted'>
              <Image src={asset.url} alt={asset.alt} fill sizes='448px' className='object-contain' />
            </div>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor='media-alt'>Alt text</FieldLabel>
                <Input id='media-alt' value={alt} onChange={(e) => setAlt(e.target.value)} placeholder='Describe the image for screen readers' />
              </Field>
              <Field>
                <FieldLabel htmlFor='media-caption'>Caption</FieldLabel>
                <Textarea id='media-caption' value={caption} onChange={(e) => setCaption(e.target.value)} rows={2} />
              </Field>
              <Field>
                <FieldLabel htmlFor='media-url'>URL</FieldLabel>
                <div className='flex gap-2'>
                  <Input id='media-url' readOnly value={asset.url} className='font-mono text-xs' />
                  <Button
                    variant='outline'
                    size='icon'
                    aria-label='Copy URL'
                    onClick={() => navigator.clipboard.writeText(asset.url).then(() => toast.success('URL copied'))}
                  >
                    <Copy />
                  </Button>
                </div>
              </Field>
            </FieldGroup>
          </div>
          <SheetFooter className='mt-auto flex-row justify-between'>
            <Button variant='ghost' className='text-destructive hover:text-destructive' onClick={() => setConfirm(true)}>
              <Trash2 /> Delete
            </Button>
            <Button onClick={save} loading={saving}>
              Save changes
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <AlertDialog open={confirm} onOpenChange={setConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this file?</AlertDialogTitle>
            <AlertDialogDescription>
              It will be removed from storage. Pages that still use it will show a broken image.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={remove}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
