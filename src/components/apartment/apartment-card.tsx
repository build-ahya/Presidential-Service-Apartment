import Image from 'next/image';
import Link from 'next/link';
import { Bath, BedDouble, MapPin, Maximize2, Star, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatMoney, priceFor } from '@/lib/booking';
import { cn } from '@/lib/utils';
import type { Apartment } from '@/models/apartment';
import type { Property } from '@/models/property';

function Specs({ apartment, className }: { apartment: Apartment; className?: string }) {
  return (
    <ul className={cn('flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground', className)}>
      <li className='flex items-center gap-1.5'>
        <BedDouble className='size-4' /> {apartment.bedrooms} bedroom{apartment.bedrooms === 1 ? '' : 's'}
      </li>
      <li className='flex items-center gap-1.5'>
        <Bath className='size-4' /> {apartment.bathrooms} bathroom{apartment.bathrooms === 1 ? '' : 's'}
      </li>
      <li className='flex items-center gap-1.5'>
        <Users className='size-4' /> Sleeps {apartment.maxGuests}
      </li>
      {apartment.sizeSqm ? (
        <li className='flex items-center gap-1.5'>
          <Maximize2 className='size-4' /> {apartment.sizeSqm} m²
        </li>
      ) : null}
    </ul>
  );
}

function Rating({ apartment }: { apartment: Apartment }) {
  if (!apartment.rating) return null;
  return (
    <span className='flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs font-semibold text-secondary-foreground'>
      <Star className='size-3 fill-primary text-primary' />
      {apartment.rating.toFixed(1)}
    </span>
  );
}

function Cover({ apartment, className, priority }: { apartment: Apartment; className?: string; priority?: boolean }) {
  const url = apartment.featuredMedia?.url;
  return (
    <div className={cn('relative overflow-hidden bg-muted', className)}>
      {url ? (
        <Image
          src={url}
          alt={apartment.featuredMedia.alt || apartment.name}
          fill
          priority={priority}
          sizes='(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw'
          className='object-cover transition-transform duration-500 group-hover:scale-105'
        />
      ) : null}
    </div>
  );
}

/** Vertical card for grids (home, related). */
export function ApartmentCard({
  apartment,
  property,
  href,
}: {
  apartment: Apartment;
  property?: Property;
  href?: string;
}) {
  const link = href ?? `/apartments/${apartment.slug}`;
  return (
    <Link
      href={link}
      className='group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-lg'
    >
      <Cover apartment={apartment} className='aspect-[4/3]' />
      <div className='flex flex-1 flex-col gap-3 p-5'>
        <div className='flex items-start justify-between gap-3'>
          <h3 className='font-display text-xl leading-snug font-semibold'>{apartment.name}</h3>
          <Rating apartment={apartment} />
        </div>
        {property?.location?.address?.city && (
          <p className='flex items-center gap-1.5 text-sm text-muted-foreground'>
            <MapPin className='size-4' />
            {[property.location.address.area ?? property.location.address.street?.split(',').pop()?.trim(), property.location.address.city]
              .filter(Boolean)
              .join(', ')}
          </p>
        )}
        <Specs apartment={apartment} />
        <div className='mt-auto flex items-end justify-between border-t pt-4'>
          <div>
            <span className='text-xs text-muted-foreground'>From</span>
            <p className='text-xl font-bold text-secondary'>
              {formatMoney(apartment.rate.baseRate, apartment.rate.currency)}
              <span className='text-sm font-normal text-muted-foreground'> / night</span>
            </p>
          </div>
          <span className='text-sm font-semibold text-secondary group-hover:underline'>View →</span>
        </div>
      </div>
    </Link>
  );
}

/** Horizontal result card for the search results page. */
export function ApartmentResultCard({
  apartment,
  property,
  href,
  nights,
}: {
  apartment: Apartment;
  property?: Property;
  href: string;
  nights: number;
}) {
  const price = priceFor(apartment, Math.max(nights, 1));
  return (
    <article className='group grid overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-lg md:grid-cols-[320px_1fr]'>
      <Link href={href} className='block'>
        <Cover apartment={apartment} className='aspect-[4/3] w-full md:aspect-auto md:h-full md:min-h-64' />
      </Link>
      <div className='flex flex-col gap-4 p-5 sm:flex-row sm:justify-between'>
        <div className='flex flex-1 flex-col gap-3'>
          <div>
            <Link href={href}>
              <h2 className='font-display text-2xl leading-snug font-semibold text-secondary group-hover:underline'>
                {apartment.name}
              </h2>
            </Link>
            {property && (
              <p className='mt-1 flex items-center gap-1.5 text-sm text-muted-foreground'>
                <MapPin className='size-4' />
                {property.name} · {property.location.address.city}
              </p>
            )}
          </div>
          <Specs apartment={apartment} />
          {apartment.summary && (
            <p className='line-clamp-2 text-sm text-muted-foreground'>{apartment.summary}</p>
          )}
          <div className='mt-auto flex flex-wrap gap-1.5'>
            {(apartment.amenities ?? []).slice(0, 5).map((a) => (
              <Badge key={a} variant='secondary' className='font-normal'>
                {a}
              </Badge>
            ))}
          </div>
        </div>

        <div className='flex shrink-0 flex-col justify-between gap-3 border-t pt-4 sm:w-48 sm:items-end sm:border-t-0 sm:border-l sm:pt-0 sm:pl-5 sm:text-right'>
          <Rating apartment={apartment} />
          <div>
            {nights > 0 ? (
              <>
                <p className='text-xs text-muted-foreground'>
                  {nights} night{nights === 1 ? '' : 's'}
                </p>
                <p className='text-2xl font-bold text-secondary'>
                  {formatMoney(price.total, apartment.rate.currency)}
                </p>
                <p className='text-xs text-muted-foreground'>
                  {formatMoney(apartment.rate.baseRate, apartment.rate.currency)} / night
                  {apartment.rate.cleaningFee ? ' + cleaning' : ''}
                </p>
              </>
            ) : (
              <>
                <p className='text-xs text-muted-foreground'>From</p>
                <p className='text-2xl font-bold text-secondary'>
                  {formatMoney(apartment.rate.baseRate, apartment.rate.currency)}
                </p>
                <p className='text-xs text-muted-foreground'>per night</p>
              </>
            )}
          </div>
          <Link
            href={href}
            className='inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90'
          >
            See availability
          </Link>
        </div>
      </div>
    </article>
  );
}

export { Specs as ApartmentSpecs };
