import type { Metadata } from 'next';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { PostCard } from '@/components/blog/post-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BlogService } from '@/services/blog.service';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'News, travel tips and stories from Presidential Service Apartments.',
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function BlogListing({ searchParams }: { searchParams: SearchParams }) {
  const raw = await searchParams;
  const q = typeof raw.q === 'string' ? raw.q : '';
  const page = Math.max(1, Number(raw.page) || 1);
  const { posts, pagination } = await BlogService.listPublished({ q, page, limit: 9 });
  const href = (p: number) => `/blog?${new URLSearchParams({ ...(q && { q }), page: String(p) })}`;

  return (
    <>
      <section className='bg-secondary pt-28 pb-12 text-secondary-foreground md:pt-36'>
        <div className='container mx-auto px-4'>
          <h1 className='font-display text-4xl font-semibold md:text-6xl'>Blog</h1>
          <p className='mt-3 max-w-2xl text-lg text-white/75'>Stories, tips and news from our apartments.</p>
          <form className='mt-6 flex max-w-xl gap-2' action='/blog'>
            <Input
              name='q'
              defaultValue={q}
              placeholder='Search posts…'
              className='h-11 bg-background text-foreground'
              aria-label='Search posts'
            />
            <Button type='submit' size='lg' className='h-11'>
              <Search /> Search
            </Button>
          </form>
        </div>
      </section>

      <section className='container mx-auto px-4 py-12'>
        {posts.length === 0 ? (
          <p className='py-16 text-center text-muted-foreground'>
            {q ? `No posts match “${q}”.` : 'No posts yet — check back soon.'}
          </p>
        ) : (
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {posts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        )}

        {pagination.totalPages > 1 && (
          <nav className='mt-10 flex items-center justify-between' aria-label='Pagination'>
            <span className='text-sm text-muted-foreground'>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <div className='flex gap-2'>
              <Button asChild variant='outline' disabled={page <= 1}>
                <Link href={href(page - 1)} aria-disabled={page <= 1} className={page <= 1 ? 'pointer-events-none opacity-50' : ''}>
                  Previous
                </Link>
              </Button>
              <Button asChild variant='outline'>
                <Link href={href(page + 1)} aria-disabled={!pagination.hasMore} className={!pagination.hasMore ? 'pointer-events-none opacity-50' : ''}>
                  Next
                </Link>
              </Button>
            </div>
          </nav>
        )}
      </section>
    </>
  );
}
