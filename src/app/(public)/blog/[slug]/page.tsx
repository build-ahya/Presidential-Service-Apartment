import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import BlogDetailsPage from '@/components/pages/blog/blog-details-page';
import Loading from '@/components/ui/loading';
import { Post } from '@/models/post';
import { API_URL } from '@/lib/utils';

// Helper function to fetch blog post via API
async function fetchPost(slug: string): Promise<Post | null> {
  try {
    const response = await fetch(
      `${API_URL}/blog/slug/${slug}`,
      {
        cache: 'no-store', // Ensure fresh data and view count increment
      }
    );

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

type tParams = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: tParams;
}): Promise<Metadata> {
  const { slug } = await params;
  // Use direct service call for metadata to avoid incrementing view count
  const blog = await fetchPost(slug);

  if (!blog) {
    return {
      title: 'blog post Not Found',
      description: 'The requested blog post could not be found',
    };
  }

  return {
    title: `${blog.title}`,
    description: blog.excerpt,
    keywords: blog?.tags?.length ? blog.tags.map((tag) => tag.name) : [],
    openGraph: {
      title: `${blog.title}`,
      description: blog.excerpt,
      images: [
        {
          url: blog.featuredMedia.url,
          width: blog.featuredMedia.width,
          height: blog.featuredMedia.height,
          alt: blog.featuredMedia.alt,
        },
      ],
    },
    twitter: {
      title: `${blog.title}`,
      description: blog.excerpt,
      images: [
        {
          url: blog.featuredMedia.url,
          width: blog.featuredMedia.width,
          height: blog.featuredMedia.height,
          alt: blog.featuredMedia.alt,
        },
      ],
    },
  };
}

export default async function BlogDetails({ params }: { params: tParams }) {
  const { slug } = await params;
  // Use API endpoint to increment view count
  const blog = await fetchPost(slug);

  if (!blog) return notFound();
  return (
    <Suspense fallback={<Loading />}>
      <BlogDetailsPage post={blog} />
    </Suspense>
  );
}
