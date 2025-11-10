import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import ApartmentDetailsPage from '@/components/pages/apartment/apartment-details-page';
import Loading from '@/components/ui/loading';
import { Apartment } from '@/models/apartment';
import { API_URL } from '@/lib/utils';

// Helper function to fetch blog post via API
async function fetchApartment(slug: string): Promise<Apartment | null> {
  try {
    const response = await fetch(
      `${API_URL}/apartment/slug/${slug}`,
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
    console.error('Error fetching apartment:', error);
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
  const apartment = await fetchApartment(slug);

  if (!apartment) {
    return {
      title: 'apartment Not Found',
      description: 'The requested apartment could not be found',
    };
  }

  return {
    title: `${apartment.name}`,
    description: apartment.summary,
    keywords: apartment?.tags || ['apartment', 'Presidential Service Apartment'],
    openGraph: {
      title: `${apartment.name}`,
      description: apartment.summary,
      images: [
        {
          url: apartment.featuredMedia.url,
          width: apartment.featuredMedia.width,
          height: apartment.featuredMedia.height,
          alt: apartment.featuredMedia.alt,
        },
      ],
    },
    twitter: {
      title: `${apartment.name}`,
      description: apartment.summary,
      images: [
        {
          url: apartment.featuredMedia.url,
          width: apartment.featuredMedia.width,
          height: apartment.featuredMedia.height,
          alt: apartment.featuredMedia.alt,
        },
      ],
    },
  };
}

export default async function ApartmentDetails({ params }: { params: tParams }) {
  const { slug } = await params;
  // Use API endpoint to increment view count
  const apartment = await fetchApartment(slug);

  if (!apartment) return notFound();
  return (
    <Suspense fallback={<Loading />}>
      <ApartmentDetailsPage apartment={apartment} />
    </Suspense>
  );
}
