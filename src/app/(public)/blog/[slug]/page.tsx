import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import { PostCard } from '@/components/blog/post-card';
import { safeHtml } from '@/lib/html';
import { BlogService } from '@/services/blog.service';

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const post = await BlogService.getPublishedBySlug((await params).slug);
  if (!post) return { title: 'Post not found' };
  const image = post.featuredMedia?.url ? [{ url: post.featuredMedia.url, alt: post.featuredMedia.alt }] : undefined;
  return {
    title: post.meta?.title || post.title,
    description: post.meta?.description || post.excerpt,
    keywords: post.meta?.keywords,
    openGraph: { title: post.title, description: post.excerpt, images: image, type: 'article' },
  };
}

export default async function BlogPost({ params }: { params: Params }) {
  const post = await BlogService.getPublishedBySlug((await params).slug);
  if (!post) notFound();
  const related = await BlogService.related(post);

  return (
    <article className='pt-28 pb-16 md:pt-36'>
      <div className='container mx-auto max-w-3xl px-4'>
        <Link href='/blog' className='mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground'>
          <ArrowLeft className='size-4' /> All posts
        </Link>
        <p className='mb-3 text-sm text-muted-foreground'>
          {post.category?.name}
          {post.publishedAt && ` · ${format(parseISO(post.publishedAt), 'd MMMM yyyy')}`}
          {post.stats?.readingTime ? ` · ${post.stats.readingTime} min read` : ''}
        </p>
        <h1 className='font-display text-4xl font-semibold text-secondary md:text-5xl'>{post.title}</h1>
        {post.subtitle && <p className='mt-3 text-xl text-muted-foreground'>{post.subtitle}</p>}
        <p className='mt-4 text-sm text-muted-foreground'>By {post.author?.name || 'Admin'}</p>
      </div>

      {post.featuredMedia?.url && (
        <div className='container mx-auto my-8 max-w-5xl px-4'>
          <div className='relative aspect-[16/9] overflow-hidden rounded-3xl bg-muted'>
            <Image src={post.featuredMedia.url} alt={post.featuredMedia.alt || post.title} fill priority sizes='(max-width: 1024px) 100vw, 1024px' className='object-cover' />
          </div>
        </div>
      )}

      <div className='container mx-auto max-w-3xl px-4'>
        <div
          className='prose prose-lg max-w-none prose-headings:font-display prose-headings:text-secondary prose-a:text-secondary'
          dangerouslySetInnerHTML={{ __html: safeHtml(post.content) }}
        />
      </div>

      {related.length > 0 && (
        <section className='container mx-auto mt-16 px-4'>
          <h2 className='font-display mb-6 text-2xl font-semibold'>Keep reading</h2>
          <div className='grid gap-6 md:grid-cols-3'>
            {related.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
