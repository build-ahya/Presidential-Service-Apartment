'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty';
import Loading from '@/components/ui/loading';
import { CheckAvailabilityForm } from '@/components/forms/check-availability-form';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchApartments } from '@/store/slices/apartment-slice';
import { useSearchParams } from 'next/navigation';

export default function ApartmentsPage() {
  const dispatch = useAppDispatch();
  const {
    apartments,
    isLoading: loading,
    error,
  } = useAppSelector((s) => s.apartment);
  const searchParams = useSearchParams();
  const [visibleApartments, setVisibleApartments] =
    useState<typeof apartments>(apartments);
  const q = searchParams.get('q');
  const qData = useMemo(() => {
    if (!q)
      return null as null | {
        apartmentId?: string;
        checkIn?: string;
        checkOut?: string;
        guests?: number;
      };
    try {
      return JSON.parse(decodeURIComponent(q));
    } catch {
      return null;
    }
  }, [q]);

  useEffect(() => {
    dispatch(fetchApartments());
  }, [dispatch]);

  useEffect(() => {
    // Rule 2: in /apartments only show available apartments based on q
    async function filterByAvailability() {
      if (!apartments || apartments.length === 0) return;
      if (!qData || !qData.checkIn || !qData.checkOut) {
        setVisibleApartments(apartments);
        return;
      }
      const results = await Promise.all(
        apartments.map(async (apt) => {
          try {
            const res = await fetch('/api/reservation/check', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                apartmentId: apt.id,
                checkIn: qData.checkIn,
                checkOut: qData.checkOut,
              }),
            });
            const json = await res.json();
            const hasConflicts = Array.isArray(json?.conflicts) && json.conflicts.length > 0;
            return hasConflicts ? null : apt;
          } catch {
            return null;
          }
        })
      );
      const filtered = results.filter(Boolean) as typeof apartments;
      setVisibleApartments(filtered);
    }
    filterByAvailability();
  }, [apartments, qData]);

  if (loading) {
    return <Loading />;
  }

  if (error || !apartments || apartments.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No apartments available</EmptyTitle>
          <EmptyDescription>
            {error || 'Please check back later or contact support.'}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mt-20 mb-12 space-y-4 text-center'>
        <div>
          <h1 className='text-2xl font-semibold'>Apartments</h1>
          <p className='text-muted-foreground'>
            Browse available serviced apartments
          </p>
        </div>

        {/* Check Availability Widget */}
        <CheckAvailabilityForm apartments={apartments} className='mx-auto' />

        {qData && qData.checkIn && qData.checkOut && (
          <p className='text-sm text-muted-foreground'>
            Showing available apartments for selected dates.
          </p>
        )}
      </div>

      {qData && qData.checkIn && qData.checkOut && visibleApartments && visibleApartments.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No apartments match these dates</EmptyTitle>
            <EmptyDescription>
              Try adjusting your check-in/check-out or browse all apartments below.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {((qData && qData.checkIn && qData.checkOut && visibleApartments && visibleApartments.length > 0)
            ? visibleApartments
            : apartments
          ).map((apt) => (
            <Link key={apt.id} href={`/apartments/${apt.slug}${q ? `?q=${q}` : ''}`}>
              <Card  className='overflow-hidden'>
              {apt.featuredMedia?.url && (
                <div className='relative w-full h-56 overflow-hidden group'>
                  <Image
                    src={apt.featuredMedia.url}
                    alt={apt.featuredMedia.alt || apt.name}
                    fill
                    className='object-cover transition-transform duration-300 ease-out group-hover:scale-105'
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                    priority={false}
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle>
                  <Link
                    href={`/apartments/${apt.slug}${q ? `?q=${q}` : ''}`}
                    className='hover:underline'
                  >
                    {apt.name}
                  </Link>
                </CardTitle>
                <CardDescription>
                  {apt.location?.address?.city}
                  {apt.location?.address?.state
                    ? ', ' + apt.location.address.state
                    : ''}
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-3'>
                {apt.summary && (
                  <p className='text-sm text-muted-foreground line-clamp-3'>
                    {apt.summary}
                  </p>
                )}
                <div className='flex flex-wrap gap-2'>
                  {(apt.tags || []).slice(0, 3).map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                  {(apt.amenities || []).slice(0, 3).map((am) => (
                    <Badge key={am} variant='secondary'>
                      {am}
                    </Badge>
                  ))}
                </div>
                {apt.rate?.basePricePerNight && (
                  <div className='text-sm'>
                    <span className='font-medium'>From </span>
                    <span>
                      {new Intl.NumberFormat(undefined, {
                        style: 'currency',
                        currency: apt.rate.currency || 'NGN',
                        maximumFractionDigits: 0,
                      }).format(apt.rate.basePricePerNight)}
                    </span>
                    <span className='text-muted-foreground'> / night</span>
                  </div>
                )}
              </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
