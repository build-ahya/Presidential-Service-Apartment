'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ICON_OPTIONS, type ItemField, type PageSchema, type SectionField, type SectionSchema } from '@/content/schema';
import type { Button as CmsButton, Item, PageContent, Section } from '@/models/content';
import { api } from './api';
import { FormBar } from './form-bar';
import { ImageField, MediaPickerDialog } from './media/media-picker';
import { RichTextEditor } from './rich-text';
import { ImagePlus, X } from 'lucide-react';
import Image from 'next/image';

const FIELD_LABELS: Record<SectionField, string> = {
  overline: 'Small heading above title',
  title: 'Title',
  subtitle: 'Subtitle',
  body: 'Text',
  image: 'Image',
  images: 'Images',
  video: 'Video URL',
  buttons: 'Buttons',
};

const ITEM_LABELS: Record<ItemField, string> = {
  title: 'Title',
  subtitle: 'Subtitle',
  body: 'Text',
  image: 'Image',
  icon: 'Icon',
  href: 'Link',
};

export function PageEditor({ schema, initial }: { schema: PageSchema; initial: PageContent }) {
  const router = useRouter();
  const [sections, setSections] = useState<PageContent>(initial);
  const [saving, setSaving] = useState(false);

  const update = (key: string, patch: Partial<Section>) =>
    setSections((s) => ({ ...s, [key]: { ...s[key], ...patch } }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api(`/api/admin/content/${schema.key}`, { method: 'PUT', body: sections });
      toast.success('Page saved — changes are live');
      router.refresh();
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <Accordion type='multiple' defaultValue={[schema.sections[0]?.key]} className='rounded-xl border bg-card'>
        {schema.sections.map((sec) => (
          <AccordionItem key={sec.key} value={sec.key} className='px-5 last:border-b-0'>
            <AccordionTrigger className='text-base font-semibold hover:no-underline'>
              <span className='flex flex-col items-start gap-0.5 text-left'>
                {sec.label}
                {sec.hint && <span className='text-xs font-normal text-muted-foreground'>{sec.hint}</span>}
              </span>
            </AccordionTrigger>
            <AccordionContent className='pb-6'>
              <SectionFields
                schema={sec}
                value={sections[sec.key] ?? { title: '', body: '' }}
                onChange={(patch) => update(sec.key, patch)}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <FormBar saving={saving} cancelHref='/admin/content' saveLabel='Save & publish' />
    </form>
  );
}

function SectionFields({
  schema,
  value,
  onChange,
}: {
  schema: SectionSchema;
  value: Section;
  onChange: (patch: Partial<Section>) => void;
}) {
  const has = (f: SectionField) => schema.fields.includes(f);
  const label = (f: SectionField) => schema.labels?.[f] ?? FIELD_LABELS[f];
  const id = (f: string) => `${schema.key}-${f}`;

  return (
    <FieldGroup>
      {has('overline') && (
        <Field>
          <FieldLabel htmlFor={id('overline')}>{label('overline')}</FieldLabel>
          <Input id={id('overline')} value={value.overline ?? ''} onChange={(e) => onChange({ overline: e.target.value })} />
        </Field>
      )}
      {has('title') && (
        <Field>
          <FieldLabel htmlFor={id('title')}>{label('title')}</FieldLabel>
          <Input id={id('title')} value={value.title ?? ''} onChange={(e) => onChange({ title: e.target.value })} />
        </Field>
      )}
      {has('subtitle') && (
        <Field>
          <FieldLabel htmlFor={id('subtitle')}>{label('subtitle')}</FieldLabel>
          <Input id={id('subtitle')} value={value.subtitle ?? ''} onChange={(e) => onChange({ subtitle: e.target.value })} />
        </Field>
      )}
      {has('body') &&
        (schema.bodyFormat === 'html' ? (
          <Field>
            <FieldLabel>{label('body')}</FieldLabel>
            <RichTextEditor value={value.body ?? ''} onChange={(body) => onChange({ body })} />
          </Field>
        ) : (
          <Field>
            <FieldLabel htmlFor={id('body')}>{label('body')}</FieldLabel>
            <Textarea id={id('body')} rows={schema.bodyFormat === 'text' ? 6 : 3} value={value.body ?? ''} onChange={(e) => onChange({ body: e.target.value })} />
            {schema.bodyFormat === 'text' && <FieldDescription>Leave a blank line between paragraphs.</FieldDescription>}
          </Field>
        ))}
      {has('image') && (
        <ImageField label={label('image')} value={value.image} onChange={(image) => onChange({ image })} />
      )}
      {has('images') && <ImagesField label={label('images')} value={value.images ?? []} onChange={(images) => onChange({ images })} />}
      {has('video') && (
        <Field>
          <FieldLabel htmlFor={id('video')}>{label('video')}</FieldLabel>
          <Input id={id('video')} value={value.video ?? ''} onChange={(e) => onChange({ video: e.target.value })} placeholder='https://youtube.com/…' />
        </Field>
      )}
      {has('buttons') && <ButtonsField value={value.buttons ?? []} onChange={(buttons) => onChange({ buttons })} />}
      {schema.items && (
        <ItemsField
          schema={schema.items}
          value={value.items ?? []}
          onChange={(items) => onChange({ items })}
        />
      )}
    </FieldGroup>
  );
}

function ImagesField({ label, value, onChange }: { label: string; value: string[]; onChange: (v: string[]) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className='flex flex-col gap-2'>
      <span className='text-sm font-medium'>{label}</span>
      <div className='flex flex-wrap gap-3'>
        {value.map((url, i) => (
          <div key={`${url}-${i}`} className='relative size-24 overflow-hidden rounded-lg border bg-muted'>
            <Image src={url} alt='' fill sizes='96px' className='object-cover' />
            <Button type='button' size='icon-xs' variant='secondary' className='absolute top-1 right-1' onClick={() => onChange(value.filter((_, j) => j !== i))} aria-label='Remove'>
              <X />
            </Button>
          </div>
        ))}
        <button
          type='button'
          onClick={() => setOpen(true)}
          className='flex size-24 flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-xs text-muted-foreground hover:bg-accent'
        >
          <ImagePlus className='size-5' /> Add
        </button>
      </div>
      <MediaPickerDialog open={open} onOpenChange={setOpen} multiple onPick={(assets) => onChange([...value, ...assets.map((a) => a.url)])} />
    </div>
  );
}

function ButtonsField({ value, onChange }: { value: CmsButton[]; onChange: (v: CmsButton[]) => void }) {
  return (
    <div className='flex flex-col gap-2'>
      <span className='text-sm font-medium'>Buttons</span>
      {value.map((b, i) => (
        <div key={i} className='grid gap-2 sm:grid-cols-[1fr_1fr_auto]'>
          <Input aria-label='Button label' value={b.title} placeholder='Label' onChange={(e) => onChange(value.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))} />
          <Input aria-label='Button link' value={b.href} placeholder='/apartments' onChange={(e) => onChange(value.map((x, j) => (j === i ? { ...x, href: e.target.value } : x)))} />
          <Button type='button' variant='ghost' size='icon' aria-label='Remove button' onClick={() => onChange(value.filter((_, j) => j !== i))}>
            <Trash2 />
          </Button>
        </div>
      ))}
      {value.length < 3 && (
        <Button type='button' variant='outline' size='sm' className='w-fit' onClick={() => onChange([...value, { title: '', href: '/' }])}>
          <Plus /> Add button
        </Button>
      )}
    </div>
  );
}

function ItemsField({
  schema,
  value,
  onChange,
}: {
  schema: NonNullable<SectionSchema['items']>;
  value: Item[];
  onChange: (v: Item[]) => void;
}) {
  const label = (f: ItemField) => schema.labels?.[f] ?? ITEM_LABELS[f];
  const patch = (i: number, p: Partial<Item>) => onChange(value.map((x, j) => (j === i ? { ...x, ...p } : x)));
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className='flex flex-col gap-3'>
      <span className='text-sm font-medium capitalize'>{schema.singular}s</span>
      {value.map((item, i) => (
        <div key={i} className='flex gap-3 rounded-lg border bg-muted/30 p-3'>
          <div className='flex flex-1 flex-col gap-3'>
            {schema.fields.map((f) => {
              if (f === 'icon')
                return (
                  <Select key={f} value={item.icon ?? ''} onValueChange={(icon) => patch(i, { icon })}>
                    <SelectTrigger aria-label='Icon' className='w-48 bg-background'>
                      <SelectValue placeholder='Choose icon' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {ICON_OPTIONS.map((o) => (
                          <SelectItem key={o} value={o} className='capitalize'>
                            {o}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                );
              if (f === 'image')
                return <ImageField key={f} aspect='aspect-video' value={item.image} onChange={(image) => patch(i, { image })} />;
              if (f === 'body')
                return (
                  <Textarea key={f} aria-label={label(f)} placeholder={label(f)} rows={2} className='bg-background' value={item.body ?? ''} onChange={(e) => patch(i, { body: e.target.value })} />
                );
              return (
                <Input
                  key={f}
                  aria-label={label(f)}
                  placeholder={label(f)}
                  className='bg-background'
                  value={(item[f] as string | undefined) ?? ''}
                  onChange={(e) => patch(i, { [f]: e.target.value })}
                />
              );
            })}
          </div>
          <div className='flex flex-col gap-1'>
            <Button type='button' variant='ghost' size='icon-sm' aria-label='Move up' onClick={() => move(i, -1)} disabled={i === 0}>
              <ArrowUp />
            </Button>
            <Button type='button' variant='ghost' size='icon-sm' aria-label='Move down' onClick={() => move(i, 1)} disabled={i === value.length - 1}>
              <ArrowDown />
            </Button>
            <Button type='button' variant='ghost' size='icon-sm' aria-label='Remove' onClick={() => onChange(value.filter((_, j) => j !== i))}>
              <Trash2 />
            </Button>
          </div>
        </div>
      ))}
      <Button type='button' variant='outline' size='sm' className='w-fit' onClick={() => onChange([...value, { title: '', body: '' }])}>
        <Plus /> Add {schema.singular}
      </Button>
    </div>
  );
}
