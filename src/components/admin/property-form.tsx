'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { emptyMedia } from '@/lib/schemas';
import type { Property, PropertyInput } from '@/models/property';
import { api } from './api';
import { FormSection, ListField, NumberInput } from './fields';
import { FormBar } from './form-bar';
import { GalleryField, MediaField } from './media/media-picker';
import { RichTextEditor } from './rich-text';

const AMENITY_SUGGESTIONS = ['24/7 Power', 'High-speed Wi-Fi', 'Secure parking', '24/7 Security', 'Daily housekeeping', 'In-house laundry', 'Concierge', 'CCTV'];

const blank: PropertyInput = {
  name: '',
  slug: '',
  status: 'draft',
  summary: '',
  description: '',
  location: { address: { city: '', state: '', country: 'Nigeria' } },
  amenities: [],
  featuredMedia: emptyMedia,
  gallery: [],
  contact: {},
  policies: { checkIn: '14:00', checkOut: '11:00', smoking: false, pets: false, children: true, houseRules: [] },
  tags: [],
};

export function PropertyForm({ property }: { property?: Property }) {
  const router = useRouter();
  const [v, setV] = useState<PropertyInput>(() => {
    if (!property) return blank;
    const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = property;
    return { ...blank, ...rest };
  });
  const [saving, setSaving] = useState(false);
  const set = <K extends keyof PropertyInput>(key: K, value: PropertyInput[K]) => setV((s) => ({ ...s, [key]: value }));
  const address = v.location.address;
  const setAddress = (patch: Partial<typeof address>) =>
    set('location', { ...v.location, address: { ...address, ...patch } });
  const policies = v.policies ?? {};
  const setPolicy = (patch: Partial<typeof policies>) => set('policies', { ...policies, ...patch });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (property) {
        await api(`/api/admin/properties/${property.id}`, { method: 'PUT', body: v });
        toast.success('Property saved');
        router.refresh();
      } else {
        await api('/api/admin/properties', { method: 'POST', body: v });
        toast.success('Property created');
        router.push('/admin/properties');
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
      <FormSection title='Basics' description='The name and short description shown on the website.'>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor='p-name'>Property name</FieldLabel>
            <Input id='p-name' value={v.name} onChange={(e) => set('name', e.target.value)} required />
          </Field>
          <Field>
            <FieldLabel htmlFor='p-slug'>URL slug</FieldLabel>
            <Input id='p-slug' value={v.slug} onChange={(e) => set('slug', e.target.value)} placeholder='generated from the name' />
          </Field>
          <Field>
            <FieldLabel htmlFor='p-summary'>Summary</FieldLabel>
            <Textarea id='p-summary' value={v.summary} onChange={(e) => set('summary', e.target.value)} rows={2} />
          </Field>
          <Field orientation='horizontal'>
            <Switch id='p-status' checked={v.status === 'published'} onCheckedChange={(c) => set('status', c ? 'published' : 'draft')} />
            <div>
              <FieldLabel htmlFor='p-status'>Published</FieldLabel>
              <FieldDescription>Drafts are hidden from the website.</FieldDescription>
            </div>
          </Field>
        </FieldGroup>
      </FormSection>

      <FormSection title='Description' description='Longer story about the building, facilities and neighbourhood.'>
        <RichTextEditor value={v.description} onChange={(html) => set('description', html)} />
      </FormSection>

      <FormSection title='Location'>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor='a-street'>Street address</FieldLabel>
            <Input id='a-street' value={address.street ?? ''} onChange={(e) => setAddress({ street: e.target.value })} />
          </Field>
          <div className='grid gap-4 sm:grid-cols-3'>
            <Field>
              <FieldLabel htmlFor='a-city'>City</FieldLabel>
              <Input id='a-city' value={address.city} onChange={(e) => setAddress({ city: e.target.value })} required />
            </Field>
            <Field>
              <FieldLabel htmlFor='a-state'>State</FieldLabel>
              <Input id='a-state' value={address.state ?? ''} onChange={(e) => setAddress({ state: e.target.value })} />
            </Field>
            <Field>
              <FieldLabel htmlFor='a-country'>Country</FieldLabel>
              <Input id='a-country' value={address.country ?? ''} onChange={(e) => setAddress({ country: e.target.value })} />
            </Field>
          </div>
          <div className='grid gap-4 sm:grid-cols-2'>
            <Field>
              <FieldLabel htmlFor='a-lat'>Latitude</FieldLabel>
              <NumberInput
                id='a-lat'
                step='any'
                value={v.location.coordinates?.lat}
                onChange={(lat) =>
                  set('location', {
                    ...v.location,
                    coordinates: lat === undefined ? undefined : { lat, lng: v.location.coordinates?.lng ?? 0 },
                  })
                }
              />
            </Field>
            <Field>
              <FieldLabel htmlFor='a-lng'>Longitude</FieldLabel>
              <NumberInput
                id='a-lng'
                step='any'
                value={v.location.coordinates?.lng}
                onChange={(lng) =>
                  set('location', {
                    ...v.location,
                    coordinates: lng === undefined ? undefined : { lat: v.location.coordinates?.lat ?? 0, lng },
                  })
                }
              />
            </Field>
          </div>
        </FieldGroup>
      </FormSection>

      <FormSection title='Photos' description='The featured photo leads the property; gallery photos and YouTube videos appear on its pages.'>
        <MediaField label='Featured photo' value={v.featuredMedia?.url ? v.featuredMedia : undefined} onChange={(m) => set('featuredMedia', m ?? emptyMedia)} />
        <GalleryField label='Gallery' value={v.gallery ?? []} onChange={(g) => set('gallery', g)} />
      </FormSection>

      <FormSection title='Amenities' description='Facilities shared by every apartment in this property.'>
        <ListField value={v.amenities ?? []} onChange={(a) => set('amenities', a)} suggestions={AMENITY_SUGGESTIONS} placeholder='Add an amenity' />
      </FormSection>

      <FormSection title='Contact'>
        <FieldGroup>
          <div className='grid gap-4 sm:grid-cols-2'>
            <Field>
              <FieldLabel htmlFor='c-phone'>Phone</FieldLabel>
              <Input id='c-phone' value={v.contact?.phone ?? ''} onChange={(e) => set('contact', { ...v.contact, phone: e.target.value })} />
            </Field>
            <Field>
              <FieldLabel htmlFor='c-email'>Email</FieldLabel>
              <Input id='c-email' type='email' value={v.contact?.email ?? ''} onChange={(e) => set('contact', { ...v.contact, email: e.target.value })} />
            </Field>
          </div>
        </FieldGroup>
      </FormSection>

      <FormSection title='House rules & policies'>
        <FieldGroup>
          <div className='grid gap-4 sm:grid-cols-4'>
            <Field>
              <FieldLabel htmlFor='pol-in'>Check-in from</FieldLabel>
              <Input id='pol-in' type='time' value={policies.checkIn ?? ''} onChange={(e) => setPolicy({ checkIn: e.target.value })} />
            </Field>
            <Field>
              <FieldLabel htmlFor='pol-out'>Check-out by</FieldLabel>
              <Input id='pol-out' type='time' value={policies.checkOut ?? ''} onChange={(e) => setPolicy({ checkOut: e.target.value })} />
            </Field>
            <Field>
              <FieldLabel htmlFor='pol-min'>Min. nights</FieldLabel>
              <NumberInput id='pol-min' min={1} value={policies.minStayNights} onChange={(n) => setPolicy({ minStayNights: n })} />
            </Field>
            <Field>
              <FieldLabel htmlFor='pol-max'>Max. nights</FieldLabel>
              <NumberInput id='pol-max' min={1} value={policies.maxStayNights} onChange={(n) => setPolicy({ maxStayNights: n })} />
            </Field>
          </div>
          <div className='flex flex-wrap gap-x-8 gap-y-3'>
            {(
              [
                ['smoking', 'Smoking allowed'],
                ['pets', 'Pets allowed'],
                ['children', 'Children welcome'],
              ] as const
            ).map(([key, label]) => (
              <Field key={key} orientation='horizontal' className='w-auto'>
                <Switch id={`pol-${key}`} checked={!!policies[key]} onCheckedChange={(c) => setPolicy({ [key]: c })} />
                <FieldLabel htmlFor={`pol-${key}`}>{label}</FieldLabel>
              </Field>
            ))}
          </div>
          <Field>
            <FieldLabel htmlFor='pol-cancel'>Cancellation policy</FieldLabel>
            <Textarea id='pol-cancel' rows={2} value={policies.cancellation ?? ''} onChange={(e) => setPolicy({ cancellation: e.target.value })} />
          </Field>
          <Field>
            <FieldLabel>House rules</FieldLabel>
            <ListField value={policies.houseRules ?? []} onChange={(r) => setPolicy({ houseRules: r })} placeholder='e.g. No parties' />
          </Field>
        </FieldGroup>
      </FormSection>

      <FormSection title='Ordering & tags'>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor='p-sort'>Sort order</FieldLabel>
            <NumberInput id='p-sort' className='max-w-32' value={v.sortOrder} onChange={(n) => set('sortOrder', n)} />
            <FieldDescription>Lower numbers appear first.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel>Tags</FieldLabel>
            <ListField value={v.tags ?? []} onChange={(t) => set('tags', t)} placeholder='Add a tag' />
          </Field>
        </FieldGroup>
      </FormSection>

      <FormBar saving={saving} cancelHref='/admin/properties' saveLabel={property ? 'Save property' : 'Create property'} />
    </form>
  );
}
