import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { SearchX } from 'lucide-react';
import { ApartmentResultCard } from '@/components/apartment/apartment-card';
import { SortSelect } from '@/components/apartment/sort-select';
import { SearchBar } from '@/components/search/search-bar';
import { Button } from '@/components/ui/button';
import { formatDay, nightsBetween, parseSearch, searchToQuery } from '@/lib/booking';
import { CatalogService } from '@/services/catalog.service';
import { ReservationService } from '@/services/reservation.service';

export const metadata: Metadata = {
  title: 'Apartments',
  description: 'Browse and book fully furnished serviced apartments in Port Harcourt.',
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ApartmentsPage({ searchParams }: { searchParams: SearchParams }) {
  const raw = await searchParams;
  const search = parseSearch(raw);
  const sort = typeof raw.sort === 'string' ? raw.sort : 'recommended';
  const nights = nightsBetween(search.checkIn, search.checkOut);
  const guests = search.adults + search.children;

  const [properties, all] = await Promise.all([
    CatalogService.getProperties(),
    CatalogService.getApartments({ propertyId: search.propertyId }),
  ]);

  let results = all.filter((a) => a.maxGuests >= guests);
  if (search.checkIn && search.checkOut) {
    const free = new Set(
      await ReservationService.availableApartmentIds({
        propertyId: search.propertyId,
        checkIn: search.checkIn,
        checkOut: search.checkOut,
      })
    );
    results = results.filter((a) => free.has(a.id));
  }

  results = [...results].sort((a, b) => {
    if (sort === 'price_asc') return a.rate.baseRate - b.rate.baseRate;
    if (sort === 'price_desc') return b.rate.baseRate - a.rate.baseRate;
    if (sort === 'guests') return b.maxGuests - a.maxGuests;
    return 0;
  });

  const query = searchToQuery(search);
  const hasDates = !!(search.checkIn && search.checkOut);

  return (
    <>
      <section className='bg-secondary pt-28 pb-10 text-secondary-foreground md:pt-32'>
        <div className='container mx-auto px-4'>
          <h1 className='font-display mb-6 text-3xl font-semibold md:text-5xl'>Find your apartment</h1>
          <Suspense>
            <SearchBar />
          </Suspense>
        </div>
      </section>

      <section className='container mx-auto px-4 py-10'>
        <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
          <div>
            <h2 className='text-xl font-semibold'>
              {results.length} apartment{results.length === 1 ? '' : 's'}
              {hasDates ? ' available' : ''}
            </h2>
            {hasDates && (
              <p className='text-sm text-muted-foreground'>
                {formatDay(search.checkIn, 'EEE, d MMM')} – {formatDay(search.checkOut, 'EEE, d MMM yyyy')} · {nights}{' '}
                night{nights === 1 ? '' : 's'} · {guests} guest{guests === 1 ? '' : 's'}
              </p>
            )}
          </div>
          <Suspense>
            <SortSelect value={sort} />
          </Suspense>
        </div>

        {results.length > 0 ? (
          <div className='flex flex-col gap-5'>
            {results.map((a) => (
              <ApartmentResultCard
                key={a.id}
                apartment={a}
                property={properties.find((p) => p.id === a.propertyId)}
                nights={nights}
                href={`/apartments/${a.slug}${query ? `?${query}` : ''}`}
              />
            ))}
          </div>
        ) : (
          <div className='flex flex-col items-center gap-4 rounded-2xl border border-dashed py-20 text-center'>
            <SearchX className='size-10 text-muted-foreground' />
            <div>
              <h3 className='text-lg font-semibold'>No apartments match your search</h3>
              <p className='mt-1 text-muted-foreground'>
                Try different dates or fewer guests — or clear the search to see every apartment.
              </p>
            </div>
            <Button asChild variant='outline'>
              <Link href='/apartments'>Clear search</Link>
            </Button>
          </div>
        )}
      </section>
    </>
  );
}
