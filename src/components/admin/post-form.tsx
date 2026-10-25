'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { emptyMedia } from '@/lib/schemas';
import type { Post, PostCategory } from '@/models/post';
import { api } from './api';
import { FormSection } from './fields';
import { FormBar } from './form-bar';
import { MediaField } from './media/media-picker';
import { RichTextEditor } from './rich-text';

type Draft = {
  title: string;
  slug: string;
  subtitle: string;
  excerpt: string;
  content: string;
  status: Post['status'];
  isFeatured: boolean;
  categoryId: string;
  featuredMedia: Post['featuredMedia'];
};

export function PostForm({ post, categories }: { post?: Post; categories: PostCategory[] }) {
  const router = useRouter();
  const [v, setV] = useState<Draft>({
    title: post?.title ?? '',
    slug: post?.slug ?? '',
    subtitle: post?.subtitle ?? '',
    excerpt: post?.excerpt ?? '',
    content: post?.content ?? '',
    status: post?.status ?? 'draft',
    isFeatured: post?.isFeatured ?? false,
    categoryId: post?.category?.id ?? categories[0]?.id ?? '',
    featuredMedia: post?.featuredMedia?.url ? post.featuredMedia : emptyMedia,
  });
  const [saving, setSaving] = useState(false);
  const set = <K extends keyof Draft>(k: K, value: Draft[K]) => setV((s) => ({ ...s, [k]: value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const { categoryId, ...rest } = v;
      const category = categories.find((c) => c.id === categoryId);
      const body = {
        ...rest,
        slug: rest.slug || undefined,
        category,
        featuredMedia: rest.featuredMedia.url ? rest.featuredMedia : undefined,
        meta: undefined,
      };
      if (post) {
        await api(`/api/admin/blog/${post.id}`, { method: 'PUT', body });
        toast.success('Post saved');
        router.refresh();
      } else {
        await api('/api/admin/blog', { method: 'POST', body });
        toast.success('Post created');
        router.push('/admin/blog');
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
      <FormSection title='Post'>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor='title'>Title</FieldLabel>
            <Input id='title' value={v.title} onChange={(e) => set('title', e.target.value)} required />
          </Field>
          <Field>
            <FieldLabel htmlFor='subtitle'>Subtitle</FieldLabel>
            <Input id='subtitle' value={v.subtitle} onChange={(e) => set('subtitle', e.target.value)} />
          </Field>
          <Field>
            <FieldLabel htmlFor='slug'>URL slug</FieldLabel>
            <Input id='slug' value={v.slug} onChange={(e) => set('slug', e.target.value)} placeholder='generated from the title' />
          </Field>
          <Field>
            <FieldLabel htmlFor='excerpt'>Excerpt</FieldLabel>
            <Textarea id='excerpt' rows={2} value={v.excerpt} onChange={(e) => set('excerpt', e.target.value)} />
            <FieldDescription>Shown on cards and in search results.</FieldDescription>
          </Field>
        </FieldGroup>
      </FormSection>

      <FormSection title='Content'>
        <RichTextEditor value={v.content} onChange={(c) => set('content', c)} placeholder='Start writing…' />
      </FormSection>

      <FormSection title='Cover image'>
        <MediaField value={v.featuredMedia.url ? v.featuredMedia : undefined} onChange={(m) => set('featuredMedia', m ?? emptyMedia)} />
      </FormSection>

      <FormSection title='Publishing'>
        <FieldGroup>
          <Field>
            <FieldLabel>Status</FieldLabel>
            <Select value={v.status} onValueChange={(s) => set('status', s as Post['status'])}>
              <SelectTrigger className='w-48'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value='draft'>Draft</SelectItem>
                  <SelectItem value='published'>Published</SelectItem>
                  <SelectItem value='archived'>Archived</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          {categories.length > 0 && (
            <Field>
              <FieldLabel>Category</FieldLabel>
              <Select value={v.categoryId} onValueChange={(c) => set('categoryId', c)}>
                <SelectTrigger className='w-48'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          )}
          <Field orientation='horizontal'>
            <Switch id='featured' checked={v.isFeatured} onCheckedChange={(c) => set('isFeatured', c)} />
            <FieldLabel htmlFor='featured'>Featured post</FieldLabel>
          </Field>
        </FieldGroup>
      </FormSection>

      <FormBar saving={saving} cancelHref='/admin/blog' saveLabel={post ? 'Save post' : 'Create post'} />
    </form>
  );
}
