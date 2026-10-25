import Image from 'next/image';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import type { Post } from '@/models/post';

export function PostCard({ post }: { post: Post }) {
  const cover = post.featuredMedia?.url;
  return (
    <Link
      href={`/blog/${post.slug}`}
      className='group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-lg'
    >
      <div className='relative aspect-[16/10] overflow-hidden bg-muted'>
        {cover && (
          <Image
            src={cover}
            alt={post.featuredMedia.alt || post.title}
            fill
            sizes='(max-width: 768px) 100vw, 33vw'
            className='object-cover transition-transform duration-500 group-hover:scale-105'
          />
        )}
      </div>
      <div className='flex flex-1 flex-col gap-3 p-5'>
        <p className='text-xs font-medium text-muted-foreground'>
          {post.category?.name}
          {post.publishedAt && ` · ${format(parseISO(post.publishedAt), 'd MMM yyyy')}`}
        </p>
        <h3 className='font-display line-clamp-2 text-xl font-semibold group-hover:underline'>{post.title}</h3>
        {post.excerpt && <p className='line-clamp-3 text-sm text-muted-foreground'>{post.excerpt}</p>}
        <span className='mt-auto pt-2 text-sm font-semibold text-secondary'>Read more →</span>
      </div>
    </Link>
  );
}
