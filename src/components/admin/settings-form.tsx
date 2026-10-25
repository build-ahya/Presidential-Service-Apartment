'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import type { Link, SystemSettings } from '@/models/settings';
import { api } from './api';
import { ListField } from './fields';
import { FormBar } from './form-bar';
import { ImageField } from './media/media-picker';

export function SettingsForm({ initial }: { initial: SystemSettings }) {
  const router = useRouter();
  const [s, setS] = useState<SystemSettings>(initial);
  const [saving, setSaving] = useState(false);
  const set = <K extends keyof SystemSettings>(key: K, value: SystemSettings[K]) => setS((p) => ({ ...p, [key]: value }));
  const setContact = (patch: Partial<SystemSettings['contact']>) => set('contact', { ...s.contact, ...patch });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api('/api/admin/settings', { method: 'PUT', body: s });
      toast.success('Settings saved');
      router.refresh();
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setSaving(false);
    }
  }

  const text = (id: string, label: string, key: keyof SystemSettings, description?: string) => (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input id={id} value={(s[key] as string) ?? ''} onChange={(e) => set(key, e.target.value as never)} />
      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  );

  return (
    <form onSubmit={onSubmit}>
      <Tabs defaultValue='general'>
        <TabsList className='mb-6 flex-wrap'>
          <TabsTrigger value='general'>General</TabsTrigger>
          <TabsTrigger value='contact'>Contact</TabsTrigger>
          <TabsTrigger value='navigation'>Navigation</TabsTrigger>
          <TabsTrigger value='seo'>SEO & sharing</TabsTrigger>
        </TabsList>

        <TabsContent value='general' className='max-w-2xl'>
          <FieldGroup>
            {text('siteName', 'Site name', 'siteName')}
            {text('siteSlogan', 'Slogan', 'siteSlogan')}
            {text('siteUrl', 'Website address', 'siteUrl', 'Used for links in emails and the sitemap.')}
            <ImageField label='Browser icon (favicon)' value={s.siteIcon} onChange={(v) => set('siteIcon', v)} aspect='aspect-square' className='[&>div]:max-w-24' />
          </FieldGroup>
        </TabsContent>

        <TabsContent value='contact' className='max-w-2xl'>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor='c-email'>Public email</FieldLabel>
              <Input id='c-email' type='email' value={s.contact.email} onChange={(e) => setContact({ email: e.target.value })} />
              <FieldDescription>Also receives new-reservation notifications.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel>Phone numbers</FieldLabel>
              <ListField value={s.contact.phones} onChange={(phones) => setContact({ phones })} placeholder='+234…' />
            </Field>
            <Field>
              <FieldLabel htmlFor='c-wa'>WhatsApp number</FieldLabel>
              <Input id='c-wa' value={s.contact.whatsappPhone} onChange={(e) => setContact({ whatsappPhone: e.target.value })} placeholder='+234…' />
            </Field>
            <Field>
              <FieldLabel htmlFor='c-addr'>Office address</FieldLabel>
              <Textarea
                id='c-addr'
                rows={2}
                value={s.contact.addresses[0]?.address ?? ''}
                onChange={(e) =>
                  setContact({
                    addresses: [
                      { country: s.contact.addresses[0]?.country ?? 'Nigeria', phone: s.contact.addresses[0]?.phone ?? s.contact.phones[0] ?? '', address: e.target.value },
                    ],
                  })
                }
              />
            </Field>
            <Field>
              <FieldLabel htmlFor='c-map'>Map embed URL (optional)</FieldLabel>
              <Input id='c-map' value={s.contact.map} onChange={(e) => setContact({ map: e.target.value })} placeholder='https://www.google.com/maps/embed?…' />
            </Field>
            <LinkList title='Social links' value={s.socialLinks} onChange={(v) => set('socialLinks', v)} labelPlaceholder='Instagram' hrefPlaceholder='https://…' />
          </FieldGroup>
        </TabsContent>

        <TabsContent value='navigation' className='max-w-3xl'>
          <FieldGroup>
            <LinkList
              title='Header menu'
              description='Tick “button” for the highlighted call-to-action on the right.'
              value={s.headerLinks}
              onChange={(v) => set('headerLinks', v)}
              allowButton
            />
            <div className='flex flex-col gap-4'>
              <span className='text-sm font-medium'>Footer columns</span>
              {s.footerLinks.map((col, i) => (
                <div key={i} className='flex flex-col gap-3 rounded-lg border p-4'>
                  <div className='flex gap-2'>
                    <Input
                      aria-label='Column title'
                      value={col.section}
                      onChange={(e) => set('footerLinks', s.footerLinks.map((c, j) => (j === i ? { ...c, section: e.target.value } : c)))}
                    />
                    <Button type='button' variant='ghost' size='icon' aria-label='Remove column' onClick={() => set('footerLinks', s.footerLinks.filter((_, j) => j !== i))}>
                      <Trash2 />
                    </Button>
                  </div>
                  <LinkList
                    value={col.links}
                    onChange={(links) => set('footerLinks', s.footerLinks.map((c, j) => (j === i ? { ...c, links } : c)))}
                  />
                </div>
              ))}
              <Button type='button' variant='outline' size='sm' className='w-fit' onClick={() => set('footerLinks', [...s.footerLinks, { section: 'New column', links: [] }])}>
                <Plus /> Add column
              </Button>
            </div>
          </FieldGroup>
        </TabsContent>

        <TabsContent value='seo' className='max-w-2xl'>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor='desc'>Site description</FieldLabel>
              <Textarea id='desc' rows={3} value={s.siteDescription} onChange={(e) => set('siteDescription', e.target.value)} />
              <FieldDescription>Shown in search results. Aim for under 160 characters.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel>Keywords</FieldLabel>
              <ListField value={s.siteKeywords} onChange={(v) => set('siteKeywords', v)} placeholder='Add a keyword' />
            </Field>
            {text('ogTitle', 'Share title', 'ogTitle', 'Title when the link is shared on social media.')}
            <Field>
              <FieldLabel htmlFor='ogDesc'>Share description</FieldLabel>
              <Textarea id='ogDesc' rows={2} value={s.ogDescription} onChange={(e) => set('ogDescription', e.target.value)} />
            </Field>
            <ImageField
              label='Share image'
              value={s.ogImage}
              onChange={(v) => setS((p) => ({ ...p, ogImage: v, twitterImage: v, siteGraphImage: v }))}
            />
            {text('ogImageAlt', 'Share image description', 'ogImageAlt')}
            <div className='grid gap-4 sm:grid-cols-2'>
              {text('twitterSite', 'X / Twitter handle', 'twitterSite')}
              {text('siteAuthor', 'Author / company', 'siteAuthor')}
            </div>
          </FieldGroup>
        </TabsContent>
      </Tabs>
      <FormBar saving={saving} saveLabel='Save settings' />
    </form>
  );
}

function LinkList({
  title,
  description,
  value,
  onChange,
  allowButton,
  labelPlaceholder = 'Label',
  hrefPlaceholder = '/page',
}: {
  title?: string;
  description?: string;
  value: Link[];
  onChange: (v: Link[]) => void;
  allowButton?: boolean;
  labelPlaceholder?: string;
  hrefPlaceholder?: string;
}) {
  const patch = (i: number, p: Partial<Link>) => onChange(value.map((l, j) => (j === i ? { ...l, ...p } : l)));
  return (
    <div className='flex flex-col gap-2'>
      {title && <span className='text-sm font-medium'>{title}</span>}
      {description && <p className='text-xs text-muted-foreground'>{description}</p>}
      {value.map((l, i) => (
        <div key={i} className='flex items-center gap-2'>
          <Input aria-label='Label' className='w-40' placeholder={labelPlaceholder} value={l.label} onChange={(e) => patch(i, { label: e.target.value })} />
          <Input aria-label='Link' className='flex-1' placeholder={hrefPlaceholder} value={l.href} onChange={(e) => patch(i, { href: e.target.value })} />
          {allowButton && (
            <label className='flex items-center gap-1.5 text-xs whitespace-nowrap'>
              <Switch checked={!!l.isButton} onCheckedChange={(c) => patch(i, { isButton: c })} /> Button
            </label>
          )}
          <Button type='button' variant='ghost' size='icon' aria-label='Remove link' onClick={() => onChange(value.filter((_, j) => j !== i))}>
            <Trash2 />
          </Button>
        </div>
      ))}
      <Button type='button' variant='outline' size='sm' className='w-fit' onClick={() => onChange([...value, { label: '', href: '' }])}>
        <Plus /> Add link
      </Button>
    </div>
  );
}
