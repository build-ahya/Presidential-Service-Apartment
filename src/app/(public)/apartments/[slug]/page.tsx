import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Bath, BedDouble, Check, Clock, MapPin, Maximize2, Star, Users } from 'lucide-react';
import { ApartmentCard } from '@/components/apartment/apartment-card';
import { BookingCard, MobileBookBar } from '@/components/apartment/booking-card';
import { GalleryGrid } from '@/components/apartment/gallery-grid';
import { AmenityIcon } from '@/components/ui/amenity-icon';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { toLightboxItems } from '@/lib/gallery';
import { safeHtml } from '@/lib/html';
import { CatalogService } from '@/services/catalog.service';

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const apartment = await CatalogService.getApartmentBySlug((await params).slug);
  if (!apartment) return { title: 'Apartment not found' };
  const image = apartment.featuredMedia?.url
    ? [{ url: apartment.featuredMedia.url, alt: apartment.featuredMedia.alt || apartment.name }]
    : undefined;
  return {
    title: apartment.name,
    description: apartment.summary,
    keywords: apartment.tags,
    openGraph: { title: apartment.name, description: apartment.summary, images: image },
    twitter: { title: apartment.name, description: apartment.summary, images: image },
  };
}

export default async function ApartmentDetails({ params }: { params: Params }) {
  const apartment = await CatalogService.getApartmentBySlug((await params).slug);
  if (!apartment) notFound();

  const [property, all] = await Promise.all([
    CatalogService.getPropertyById(apartment.propertyId),
    CatalogService.getApartments({ propertyId: apartment.propertyId }),
  ]);
  const others = all.filter((a) => a.id !== apartment.id).slice(0, 3);
  const items = toLightboxItems(apartment.featuredMedia, apartment.gallery);
  const address = property?.location.address;
  const coords = property?.location.coordinates;
  const policies = property?.policies;
  const amenities = [...new Set([...(apartment.amenities ?? [])])];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Accommodation',
    name: apartment.name,
    description: apartment.summary,
    image: items.map((i) => i.url).slice(0, 5),
    numberOfBedrooms: apartment.bedrooms,
    numberOfBathroomsTotal: apartment.bathrooms,
    occupancy: { '@type': 'QuantitativeValue', maxValue: apartment.maxGuests },
    ...(address && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: address.street,
        addressLocality: address.city,
        addressRegion: address.state,
        addressCountry: address.country,
      },
    }),
  };

  return (
    <div className='pt-24 pb-24 lg:pb-16'>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className='container mx-auto px-4'>
        <Breadcrumb className='mb-4'>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href='/'>Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href='/apartments'>Apartments</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{apartment.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className='mb-5 flex flex-wrap items-start justify-between gap-4'>
          <div className='flex flex-col gap-2'>
            <h1 className='font-display text-3xl font-semibold text-secondary md:text-4xl'>{apartment.name}</h1>
            {property && (
              <p className='flex items-center gap-1.5 text-muted-foreground'>
                <MapPin className='size-4 text-primary' />
                {property.name} · {[address?.street, address?.city].filter(Boolean).join(', ')}
              </p>
            )}
          </div>
          {apartment.rating ? (
            <div className='flex items-center gap-2'>
              <span className='flex items-center gap-1 rounded-lg bg-secondary px-3 py-1.5 font-bold text-secondary-foreground'>
                <Star className='size-4 fill-primary text-primary' /> {apartment.rating.toFixed(1)}
              </span>
              {apartment.reviewsCount ? (
                <span className='text-sm text-muted-foreground'>{apartment.reviewsCount} reviews</span>
              ) : null}
            </div>
          ) : null}
        </div>

        <GalleryGrid items={items} name={apartment.name} />

        <div className='mt-8 grid gap-10 lg:grid-cols-[1fr_380px]'>
          <div className='flex min-w-0 flex-col gap-10'>
            {/* Key facts */}
            <ul className='grid grid-cols-2 gap-4 rounded-2xl border bg-muted/40 p-5 sm:grid-cols-4'>
              {[
                { icon: BedDouble, value: apartment.bedrooms, label: apartment.bedrooms === 1 ? 'Bedroom' : 'Bedrooms' },
                { icon: Bath, value: apartment.bathrooms, label: apartment.bathrooms === 1 ? 'Bathroom' : 'Bathrooms' },
                { icon: Users, value: apartment.maxGuests, label: 'Guests' },
                apartment.sizeSqm ? { icon: Maximize2, value: `${apartment.sizeSqm} m²`, label: 'Size' } : null,
              ]
                .filter((f): f is NonNullable<typeof f> => !!f)
                .map(({ icon: Icon, value, label }) => (
                  <li key={label} className='flex items-center gap-3'>
                    <Icon className='size-6 text-primary' />
                    <div>
                      <p className='text-lg leading-none font-bold'>{value}</p>
                      <p className='text-xs text-muted-foreground'>{label}</p>
                    </div>
                  </li>
                ))}
            </ul>

            {/* About */}
            <section>
              <h2 className='font-display mb-3 text-2xl font-semibold'>About this apartment</h2>
              {apartment.summary && <p className='mb-4 text-lg text-muted-foreground'>{apartment.summary}</p>}
              {apartment.description && (
                <div
                  className='prose max-w-none prose-headings:font-display prose-headings:text-secondary prose-a:text-secondary'
                  dangerouslySetInnerHTML={{ __html: safeHtml(apartment.description) }}
                />
              )}
            </section>

            {/* Bedrooms */}
            {apartment.rooms.length > 0 && (
              <section>
                <h2 className='font-display mb-4 text-2xl font-semibold'>Sleeping arrangements</h2>
                <div className='grid gap-4 sm:grid-cols-2'>
                  {apartment.rooms.map((room) => (
                    <div key={room.id} className='rounded-xl border p-5'>
                      <BedDouble className='mb-3 size-6 text-primary' />
                      <h3 className='font-semibold'>{room.name}</h3>
                      <p className='text-sm text-muted-foreground'>
                        {[room.bedType && `${room.bedType} bed`, room.ensuite && 'En-suite bathroom', room.capacity && `Sleeps ${room.capacity}`]
                          .filter(Boolean)
                          .join(' · ')}
                      </p>
                      {room.description && <p className='mt-2 text-sm'>{room.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Amenities */}
            {amenities.length > 0 && (
              <section>
                <h2 className='font-display mb-4 text-2xl font-semibold'>Amenities</h2>
                <ul className='grid gap-x-6 gap-y-3 sm:grid-cols-2'>
                  {amenities.map((a) => (
                    <li key={a} className='flex items-center gap-3'>
                      <AmenityIcon label={a} className='size-5 text-secondary' />
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Policies */}
            {policies && (
              <section>
                <h2 className='font-display mb-4 text-2xl font-semibold'>House rules</h2>
                <div className='grid gap-4 sm:grid-cols-2'>
                  <div className='flex items-start gap-3 rounded-xl border p-4'>
                    <Clock className='mt-0.5 size-5 text-primary' />
                    <div className='text-sm'>
                      <p>
                        <span className='font-semibold'>Check-in:</span> from {policies.checkIn ?? '14:00'}
                      </p>
                      <p>
                        <span className='font-semibold'>Check-out:</span> by {policies.checkOut ?? '11:00'}
                      </p>
                    </div>
                  </div>
                  {policies.cancellation && (
                    <div className='rounded-xl border p-4 text-sm'>
                      <p className='font-semibold'>Cancellation</p>
                      <p className='text-muted-foreground'>{policies.cancellation}</p>
                    </div>
                  )}
                </div>
                <ul className='mt-4 grid gap-2 text-sm sm:grid-cols-2'>
                  {policies.smoking === false && <li className='flex gap-2'><Check className='size-4 text-primary' /> No smoking</li>}
                  {policies.pets === false && <li className='flex gap-2'><Check className='size-4 text-primary' /> No pets</li>}
                  {policies.children && <li className='flex gap-2'><Check className='size-4 text-primary' /> Children welcome</li>}
                  {policies.houseRules?.map((r) => (
                    <li key={r} className='flex gap-2'><Check className='size-4 text-primary' /> {r}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* Map */}
            {(coords || property?.location.mapUrl) && (
              <section>
                <h2 className='font-display mb-4 text-2xl font-semibold'>Location</h2>
                <div className='overflow-hidden rounded-2xl border'>
                  <iframe
                    title={`Map of ${property?.name}`}
                    width='100%'
                    height='320'
                    loading='lazy'
                    referrerPolicy='no-referrer-when-downgrade'
                    src={
                      coords
                        ? `https://www.google.com/maps?q=${coords.lat},${coords.lng}&z=15&output=embed`
                        : `${property?.location.mapUrl}&output=embed`
                    }
                  />
                </div>
              </section>
            )}
          </div>

          <aside>
            <Suspense>
              <BookingCard apartment={apartment} />
            </Suspense>
          </aside>
        </div>

        {others.length > 0 && (
          <section className='mt-16'>
            <h2 className='font-display mb-6 text-2xl font-semibold'>More apartments at {property?.name}</h2>
            <div className='grid gap-6 md:grid-cols-3'>
              {others.map((a) => (
                <ApartmentCard key={a.id} apartment={a} property={property ?? undefined} />
              ))}
            </div>
          </section>
        )}
      </div>
      <MobileBookBar apartment={apartment} />
    </div>
  );
}
