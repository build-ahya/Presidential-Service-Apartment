import type { Metadata } from 'next';
import { Suspense } from 'react';
import BlogPage from '@/components/pages/blog/blog-page';
import Loading from '@/components/ui/loading';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Latest news, updates, and articles from Presidential Service Apartment.',
};

export default function BlogListingPage() {
  return (
    <Suspense fallback={<Loading />}> 
      <BlogPage />
    </Suspense>
  );
}
