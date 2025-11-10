'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchPosts,
  setFilters,
  setCurrentPage,
  setSortBy,
  setSortOrder,
} from '@/store/slices/blog-slice';
import { PostCard } from '@/components/ui/post-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PostSortBy } from '@/models/post';
import { ArrowRight } from 'lucide-react';

export default function BlogPage() {
  const dispatch = useAppDispatch();
  const { posts, isLoading, error, pagination, filters, sortBy, sortOrder } =
    useAppSelector((s) => s.blog);

  const [search, setSearch] = useState(filters?.searchQuery || '');

  useEffect(() => {
    dispatch(
      fetchPosts({
        filters,
        page: pagination.page,
        limit: pagination.limit,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, pagination.page, pagination.limit, filters, sortBy, sortOrder]);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const nextFilters = {
      ...filters,
      searchQuery: search.trim() || undefined,
    };
    dispatch(setFilters(nextFilters));
    dispatch(setCurrentPage(1));
    dispatch(
      fetchPosts({ filters: nextFilters, page: 1, limit: pagination.limit })
    );
  };

  const canPrev = useMemo(() => pagination.page > 1, [pagination.page]);
  const canNext = useMemo(
    () => pagination.page < pagination.totalPages,
    [pagination.page, pagination.totalPages]
  );

  const goPrev = () => {
    if (!canPrev) return;
    const nextPage = pagination.page - 1;
    dispatch(setCurrentPage(nextPage));
    dispatch(fetchPosts({ filters, page: nextPage, limit: pagination.limit }));
  };

  const goNext = () => {
    if (!canNext) return;
    const nextPage = pagination.page + 1;
    dispatch(setCurrentPage(nextPage));
    dispatch(fetchPosts({ filters, page: nextPage, limit: pagination.limit }));
  };

  return (
    <section className='min-h-screen bg-white my-24'>
      <div className='container mx-auto px-4 md:px-0 py-10'>
        <div className='flex flex-col gap-4 mb-8'>
          <h1 className='text-3xl md:text-4xl font-bold tracking-tight text-neutral-900'>
            Blog
          </h1>
          <p className='text-neutral-700'>
            Insights and stories from Presidential Service Apartment
          </p>

          <div className='flex flex-col md:flex-row items-center gap-3'>
            <form onSubmit={onSearch} className='flex w-full max-w-xl gap-2'>
              <Input
                placeholder='Search posts...'
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}
              />
              <Button type='submit' className='shrink-0'>
                Search
              </Button>
            </form>
            <div className='flex items-center gap-2 ml-auto'>
              <Button
                variant='outline'
                onClick={() => dispatch(setSortBy(PostSortBy.publishedAt))}
                aria-pressed={sortBy === PostSortBy.publishedAt}
              >
                Newest
              </Button>
              <Button
                variant='outline'
                onClick={() => dispatch(setSortBy(PostSortBy.views))}
                aria-pressed={sortBy === PostSortBy.views}
              >
                Most Viewed
              </Button>
              <Button
                variant='outline'
                onClick={() => dispatch(setSortBy(PostSortBy.likes))}
                aria-pressed={sortBy === PostSortBy.likes}
              >
                Most Liked
              </Button>
              <Button
                variant='outline'
                onClick={() =>
                  dispatch(setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'))
                }
              >
                {sortOrder === 'asc' ? 'Asc' : 'Desc'}
              </Button>
            </div>
          </div>

          {error && <div className='text-sm text-red-600'>{error}</div>}
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {isLoading &&
            posts.length === 0 &&
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className='rounded-xl border bg-gray-200 shadow-sm h-64 animate-pulse'
              />
            ))}

          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        <div className='mt-10 flex items-center justify-between'>
          <div className='text-sm text-neutral-600'>
            Page {pagination.page} of {Math.max(1, pagination.totalPages || 1)}
          </div>
          <div className='flex items-center gap-2'>
            <Button variant='outline' onClick={goPrev} disabled={!canPrev}>
              Previous
            </Button>
            <Button variant='outline' onClick={goNext} disabled={!canNext}>
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className='mt-12 mx-auto container'>
        <section className='w-full bg-[#005eac] text-white rounded-2xl overflow-hidden'>
          <div className='relative container mx-auto px-6 py-12'>
            <div className='absolute inset-0 pointer-events-none'>
              <Image
                src='/icons/halftone-circle-pattern.svg'
                alt=''
                fill
                className='object-cover object-left opacity-8'
                sizes='300vw'
              />
            </div>
            <div className='relative z-10 flex flex-col md:flex-row items-center justify-between gap-8'>
              <div>
                <h3 className='text-3xl md:text-4xl font-extrabold tracking-tight'>
                  Plan your next getaway
                </h3>
                <p className='mt-3 text-lg text-white/85'>
                  Exclusive offers, packages and discounts on furnished
                  apartments.
                </p>
              </div>
              <div className='flex items-center gap-4'>
                <Link href='/apartments'>
                  <Button className='bg-white text-black hover:bg-white/90'>
                    Browse Apartments
                    <ArrowRight className='ml-2 h-5 w-5' />
                  </Button>
                </Link>
                <Link href='/contact'>
                  <Button>Contact Support</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
