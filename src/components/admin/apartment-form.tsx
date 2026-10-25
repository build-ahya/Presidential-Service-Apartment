'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { emptyMedia } from '@/lib/schemas';
import type { Apartment, ApartmentInput, Room } from '@/models/apartment';
import type { Property } from '@/models/property';
import { api } from './api';
import { FormSection, ListField, NumberInput } from './fields';
import { FormBar } from './form-bar';
import { GalleryField, MediaField } from './media/media-picker';
import { RichTextEditor } from './rich-text';

const AMENITY_SUGGESTIONS = [
  'Air conditioning in every room',
  'Fully equipped kitchen',
  'High-speed fibre Wi-Fi',
  '24/7 electricity',
  'Smart TV',
  'Washing machine',
  'Hot water',
  'Wardrobes',
  'Dining area',
  'Refrigerator',
  'Iron & ironing board',
  'Secure parking',
];

const BED_TYPES = ['King', 'Queen', 'Double', 'Twin', 'Single'];

const newRoom = (n: number): Room => ({
  id: `room-${Date.now()}-${n}`,
  name: n === 1 ? 'Master bedroom' : `Bedroom ${n}`,
  bedType: n === 1 ? 'King' : 'Queen',
  capacity: 2,
  ensuite: n === 1,
  media: [],
});

const blank = (propertyId: string): ApartmentInput => ({
  propertyId,
  name: '',
  slug: '',
  status: 'draft',
  summary: '',
  description: '',
  bedrooms: 2,
  bathrooms: 2,
  maxGuests: 4,
  rooms: [newRoom(1), newRoom(2)],
  amenities: [],
  featuredMedia: emptyMedia,
  gallery: [],
  rate: { currency: 'NGN', baseRate: 0, cleaningFee: 0, securityDeposit: 0, taxesIncluded: true },
  tags: [],
});

export function ApartmentForm({ apartment, properties }: { apartment?: Apartment; properties: Property[] }) {
  const router = useRouter();
  const [v, setV] = useState<ApartmentInput>(() => {
    if (!apartment) return blank(properties[0]?.id ?? '');
    const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = apartment;
    return { ...blank(apartment.propertyId), ...rest };
  });
  const [saving, setSaving] = useState(false);
  const set = <K extends keyof ApartmentInput>(key: K, value: ApartmentInput[K]) => setV((s) => ({ ...s, [key]: value }));
  const setRate = (patch: Partial<ApartmentInput['rate']>) => set('rate', { ...v.rate, ...patch });
  const setRoom = (i: number, patch: Partial<Room>) =>
    set('rooms', v.rooms.map((r, j) => (j === i ? { ...r, ...patch } : r)));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (apartment) {
        await api(`/api/admin/apartments/${apartment.id}`, { method: 'PUT', body: v });
        toast.success('Apartment saved');
        router.refresh();
      } else {
        await api('/api/admin/apartments', { method: 'POST', body: v });
        toast.success('Apartment created');
        router.push('/admin/apartments');
        router.refresh();
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <FormSection title='Basics' description='How the apartment is named and listed.'>
        <FieldGroup>
          <Field>
            <FieldLabel>Property</FieldLabel>
            <Select value={v.propertyId} onValueChange={(id) => set('propertyId', id)}>
              <SelectTrigger className='w-full max-w-md'>
                <SelectValue placeholder='Choose a property' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {properties.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <div className='grid gap-4 sm:grid-cols-2'>
            <Field>
              <FieldLabel htmlFor='a-name'>Apartment name</FieldLabel>
              <Input id='a-name' value={v.name} onChange={(e) => set('name', e.target.value)} required />
            </Field>
            <Field>
              <FieldLabel htmlFor='a-slug'>URL slug</FieldLabel>
              <Input id='a-slug' value={v.slug} onChange={(e) => set('slug', e.target.value)} placeholder='generated from the name' />
            </Field>
          </div>
          <Field>
            <FieldLabel htmlFor='a-summary'>Summary</FieldLabel>
            <Textarea id='a-summary' rows={2} value={v.summary} onChange={(e) => set('summary', e.target.value)} />
            <FieldDescription>One or two sentences shown in search results.</FieldDescription>
          </Field>
          <div className='flex flex-wrap gap-x-10 gap-y-3'>
            <Field orientation='horizontal' className='w-auto'>
              <Switch id='a-status' checked={v.status === 'published'} onCheckedChange={(c) => set('status', c ? 'published' : 'draft')} />
              <FieldLabel htmlFor='a-status'>Published</FieldLabel>
            </Field>
            <Field orientation='horizontal' className='w-auto'>
              <Switch id='a-featured' checked={!!v.featured} onCheckedChange={(c) => set('featured', c)} />
              <FieldLabel htmlFor='a-featured'>Feature on home page</FieldLabel>
            </Field>
          </div>
        </FieldGroup>
      </FormSection>

      <FormSection title='Rates' description='Nightly rate and one-off fees. Guests see the total before reserving.'>
        <FieldGroup>
          <div className='grid gap-4 sm:grid-cols-2'>
            <Field>
              <FieldLabel htmlFor='r-base'>Base rate (per night)</FieldLabel>
              <NumberInput id='r-base' min={0} value={v.rate.baseRate} onChange={(n) => setRate({ baseRate: n ?? 0 })} required />
            </Field>
            <Field>
              <FieldLabel htmlFor='r-cur'>Currency</FieldLabel>
              <Input id='r-cur' value={v.rate.currency} onChange={(e) => setRate({ currency: e.target.value.toUpperCase() })} maxLength={3} className='max-w-24' />
            </Field>
            <Field>
              <FieldLabel htmlFor='r-clean'>Cleaning fee</FieldLabel>
              <NumberInput id='r-clean' min={0} value={v.rate.cleaningFee} onChange={(n) => setRate({ cleaningFee: n })} />
            </Field>
            <Field>
              <FieldLabel htmlFor='r-dep'>Security deposit</FieldLabel>
              <NumberInput id='r-dep' min={0} value={v.rate.securityDeposit} onChange={(n) => setRate({ securityDeposit: n })} />
              <FieldDescription>Shown as refundable; not added to the total.</FieldDescription>
            </Field>
          </div>
          <Field orientation='horizontal'>
            <Switch id='r-tax' checked={!!v.rate.taxesIncluded} onCheckedChange={(c) => setRate({ taxesIncluded: c })} />
            <FieldLabel htmlFor='r-tax'>Taxes included in rate</FieldLabel>
          </Field>
        </FieldGroup>
      </FormSection>

      <FormSection title='Space' description='Capacity and layout.'>
        <FieldGroup>
          <div className='grid gap-4 sm:grid-cols-4'>
            <Field>
              <FieldLabel htmlFor='s-bed'>Bedrooms</FieldLabel>
              <NumberInput id='s-bed' min={0} value={v.bedrooms} onChange={(n) => set('bedrooms', n ?? 0)} />
            </Field>
            <Field>
              <FieldLabel htmlFor='s-bath'>Bathrooms</FieldLabel>
              <NumberInput id='s-bath' min={0} step={0.5} value={v.bathrooms} onChange={(n) => set('bathrooms', n ?? 0)} />
            </Field>
            <Field>
              <FieldLabel htmlFor='s-guests'>Max guests</FieldLabel>
              <NumberInput id='s-guests' min={1} value={v.maxGuests} onChange={(n) => set('maxGuests', n ?? 1)} />
            </Field>
            <Field>
              <FieldLabel htmlFor='s-size'>Size (m²)</FieldLabel>
              <NumberInput id='s-size' min={0} value={v.sizeSqm} onChange={(n) => set('sizeSqm', n)} />
            </Field>
          </div>
          <Field className='max-w-xs'>
            <FieldLabel htmlFor='s-floor'>Floor / location in building</FieldLabel>
            <Input id='s-floor' value={v.floor ?? ''} onChange={(e) => set('floor', e.target.value)} placeholder='e.g. Ground floor' />
          </Field>

          <div className='flex flex-col gap-3'>
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium'>Bedrooms</span>
              <Button type='button' variant='outline' size='sm' onClick={() => set('rooms', [...v.rooms, newRoom(v.rooms.length + 1)])}>
                <Plus /> Add bedroom
              </Button>
            </div>
            {v.rooms.map((room, i) => (
              <div key={room.id} className='grid gap-3 rounded-lg border p-4 sm:grid-cols-[1fr_140px_100px_auto]'>
                <Input aria-label='Bedroom name' value={room.name} onChange={(e) => setRoom(i, { name: e.target.value })} />
                <Select value={room.bedType ?? ''} onValueChange={(b) => setRoom(i, { bedType: b })}>
                  <SelectTrigger aria-label='Bed type'>
                    <SelectValue placeholder='Bed type' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {BED_TYPES.map((b) => (
                        <SelectItem key={b} value={b}>
                          {b}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <NumberInput aria-label='Sleeps' min={1} value={room.capacity} onChange={(n) => setRoom(i, { capacity: n })} placeholder='Sleeps' />
                <div className='flex items-center gap-3'>
                  <label className='flex items-center gap-2 text-sm'>
                    <Switch checked={!!room.ensuite} onCheckedChange={(c) => setRoom(i, { ensuite: c })} /> En-suite
                  </label>
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon-sm'
                    aria-label='Remove bedroom'
                    onClick={() => set('rooms', v.rooms.filter((_, j) => j !== i))}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </FieldGroup>
      </FormSection>

      <FormSection title='Description' description='Tell guests what makes this apartment special.'>
        <RichTextEditor value={v.description} onChange={(html) => set('description', html)} />
      </FormSection>

      <FormSection title='Amenities & features' description='Shown with icons on the apartment page.'>
        <ListField value={v.amenities ?? []} onChange={(a) => set('amenities', a)} suggestions={AMENITY_SUGGESTIONS} placeholder='Add an amenity or feature' />
      </FormSection>

      <FormSection title='Photos & video' description='The featured photo is used in cards and search results.'>
        <MediaField label='Featured photo' value={v.featuredMedia?.url ? v.featuredMedia : undefined} onChange={(m) => set('featuredMedia', m ?? emptyMedia)} />
        <GalleryField label='Gallery' value={v.gallery ?? []} onChange={(g) => set('gallery', g)} />
      </FormSection>

      <FormSection title='Ordering & tags'>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor='a-sort'>Sort order</FieldLabel>
            <NumberInput id='a-sort' className='max-w-32' value={v.sortOrder} onChange={(n) => set('sortOrder', n)} />
            <FieldDescription>Lower numbers appear first.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel>Tags</FieldLabel>
            <ListField value={v.tags ?? []} onChange={(t) => set('tags', t)} placeholder='Add a tag' />
          </Field>
        </FieldGroup>
      </FormSection>

      <FormBar saving={saving} cancelHref='/admin/apartments' saveLabel={apartment ? 'Save apartment' : 'Create apartment'} />
    </form>
  );
}
