'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useState } from 'react';
import { Apartment } from '@/models/apartment';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { CheckAvailabilityForm } from '@/components/forms/check-availability-form';
import { GalleryLightbox } from '@/components/ui/gallery-lightbox';
import { MediaCarousel } from '@/components/ui/media-carousel';
import { VideoWidget } from '@/components/ui/video-widget';

export default function ApartmentDetailsPage({
  apartment,
}: {
  apartment: Apartment;
}) {
  const street = apartment.location?.address?.street;
  const city = apartment.location?.address?.city;
  const state = apartment.location?.address?.state;
  const country = apartment.location?.address?.country;
  const addressLine = [street, city, state, country].filter(Boolean).join(', ');

  // Locally narrow gallery to a safe array to avoid optional chaining issues
  const gallery = Array.isArray(apartment.gallery) ? apartment.gallery : [];

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [lightboxItems, setLightboxItems] = useState<Array<{ url: string; alt: string; type: 'image' | 'video'; caption?: string }>>([]);

  return (
    <div className='container mx-auto px-4 py-8 space-y-8 my-20'>
      {/* Hero */}
      {apartment.featuredMedia?.url && (
        <div className='relative w-full h-64 md:h-96 rounded-xl overflow-hidden border'>
          <Image
            src={apartment.featuredMedia.url}
            alt={apartment.featuredMedia.alt || apartment.name}
            fill
            className='object-cover'
            priority
          />
          {/* Breadcrumb overlay */}
          <div className='absolute top-4 left-6 right-6 '>
            <Breadcrumb className='w-fit p-4 rounded-full border border-white/20 bg-white/10 backdrop-blur supports-[backdrop-filter]:bg-white/10 shadow-lg'>
              <BreadcrumbList className='text-white/85'>
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
                  <BreadcrumbPage className='text-primary'>{apartment.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
      )}

      {/* Header */}
      <div className='flex flex-col gap-3'>
        <h1 className='text-2xl md:text-3xl font-semibold'>{apartment.name}</h1>

        <div className='flex flex-wrap gap-2'>
          {(apartment.tags || []).map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      </div>

      {/* Summary & Description */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='md:col-span-1 flex flex-col gap-6'>
          <Card className='pt-6'>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
              <CardDescription>Overview</CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-muted-foreground'>
                {apartment.summary}
              </p>
            </CardContent>
          </Card>
          {/* Map widget */}
          <Card className='pt-6'>
            <CardHeader>
              <CardTitle>Map</CardTitle>
              <CardDescription>
                <div className='flex flex-wrap gap-2 items-center text-sm'>
                  {addressLine && (
                    <span className='text-muted-foreground'>{addressLine}</span>
                  )}
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {apartment.location?.coordinates ? (
                <div className='rounded-lg overflow-hidden border'>
                  <iframe
                    title='Map'
                    width='100%'
                    height='240'
                    loading='lazy'
                    referrerPolicy='no-referrer-when-downgrade'
                    src={`https://www.google.com/maps?q=${apartment.location.coordinates.lat},${apartment.location.coordinates.lng}&z=15&output=embed`}
                  />
                </div>
              ) : apartment.location?.mapUrl ? (
                <div className='rounded-lg overflow-hidden border'>
                  <iframe
                    title='Map'
                    width='100%'
                    height='240'
                    loading='lazy'
                    referrerPolicy='no-referrer-when-downgrade'
                    src={
                      /output=embed/.test(apartment.location.mapUrl)
                        ? apartment.location.mapUrl
                        : `${apartment.location.mapUrl}${
                            apartment.location.mapUrl.includes('?') ? '&' : '?'
                          }output=embed`
                    }
                  />
                </div>
              ) : (
                <div className='text-sm text-muted-foreground'>
                  Map is not available.
                </div>
              )}
            </CardContent>
          </Card>
          {/* Rate widget */}
          <Card className='sticky top-24 pt-6'>
            <CardHeader>
              <CardTitle>Rate</CardTitle>
              <CardDescription>Per-night pricing</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {apartment.rate?.basePricePerNight ? (
                <div className='text-xl font-semibold'>
                  {new Intl.NumberFormat(undefined, {
                    style: 'currency',
                    currency: apartment.rate.currency || 'NGN',
                    maximumFractionDigits: 0,
                  }).format(apartment.rate.basePricePerNight)}
                  <span className='text-sm text-muted-foreground'>
                    {' '}
                    / night
                  </span>
                </div>
              ) : (
                <div className='text-sm text-muted-foreground'>
                  Contact for pricing
                </div>
              )}
              <div className='text-sm space-y-1'>
                {typeof apartment.rate?.cleaningFee === 'number' && (
                  <div>
                    Cleaning fee:{' '}
                    {new Intl.NumberFormat(undefined, {
                      style: 'currency',
                      currency: apartment.rate?.currency || 'NGN',
                      maximumFractionDigits: 0,
                    }).format(apartment.rate.cleaningFee)}
                  </div>
                )}
                {typeof apartment.rate?.securityDeposit === 'number' && (
                  <div>
                    Security deposit:{' '}
                    {new Intl.NumberFormat(undefined, {
                      style: 'currency',
                      currency: apartment.rate?.currency || 'NGN',
                      maximumFractionDigits: 0,
                    }).format(apartment.rate.securityDeposit)}
                  </div>
                )}
                {typeof apartment.rate?.taxesIncluded === 'boolean' && (
                  <div>
                    Taxes{' '}
                    {apartment.rate.taxesIncluded ? 'included' : 'not included'}
                  </div>
                )}
              </div>

              {/* Inline availability checker bound to current apartment */}
              <CheckAvailabilityForm
                apartments={[apartment]}
                showApartmentSelect={false}
                layout='vertical'
                className='md:rounded-2xl'
              />
            </CardContent>
          </Card>
        </div>
        <Card className='md:col-span-2 pt-6'>
          <CardHeader>
            <CardTitle>Description</CardTitle>
            <CardDescription>About this apartment</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className='prose prose-sm max-w-none'
              dangerouslySetInnerHTML={{ __html: apartment.description || '' }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Amenities */}
      {apartment.amenities && apartment.amenities.length > 0 && (
        <Card className='pt-6'>
          <CardHeader>
            <CardTitle>Amenities</CardTitle>
            <CardDescription>What’s included</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex flex-wrap gap-2'>
              {apartment.amenities.map((am) => (
                <Badge key={am} variant='secondary'>
                  {am}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gallery */}
      {gallery.length > 0 && (
        <Card className='pt-6'>
          <CardHeader>
            <CardTitle>Gallery</CardTitle>
            <CardDescription>Photos & Videos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
              {gallery.map((media, idx) => (
                <div
                  key={idx}
                  className='relative w-full h-52 md:h-80 rounded-lg overflow-hidden border group'
                >
                  {media.type === 'image' ? (
                    <button
                      type='button'
                      className='absolute inset-0'
                      onClick={() => {
                        setLightboxItems(gallery)
                        setActiveIndex(idx);
                        setLightboxOpen(true);
                      }}
                    >
                      <Image
                        src={media.url}
                        alt={media.alt || media.caption || 'Photo'}
                        fill
                        className='object-cover transition-transform duration-300 ease-out group-hover:scale-105'
                        unoptimized={/^https?:/.test(media.url)}
                      />
                    </button>
                  ) : (
                    <VideoWidget
                      url={media.url}
                      alt={media.alt || media.caption}
                      onClick={() => {
                        setLightboxItems(gallery)
                        setActiveIndex(idx);
                        setLightboxOpen(true);
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rooms */}
      <Card className='pt-6'>
        <CardHeader>
          <CardTitle>Rooms</CardTitle>
          <CardDescription>Available suites</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {apartment.rooms.map((room, index) => (
              <Card key={room.id} className='overflow-hidden'>
                {Array.isArray(room.media) && room.media.length > 0 && (
                  <MediaCarousel
                    items={room.media.filter((m) => m.type === 'image' && m.url).map((m) => ({ url: m.url, alt: m.alt || room.name, caption: m.caption }))}
                    heightClass='h-40'
                    autoplay={true}
                    delayMs={3500 + index * 200}
                    onOpen={(idx: number) => {
                      const imgs = room.media
                        .filter((m) => m.type === 'image' && m.url)
                        .map((m) => ({ url: m.url, alt: m.alt || room.name, type: 'image' as const, caption: m.caption }))
                      setLightboxItems(imgs)
                      setActiveIndex(idx)
                      setLightboxOpen(true)
                    }}
                  />
                )}
                <CardHeader>
                  <CardTitle>{room.name}</CardTitle>
                  <CardDescription>
                    {room.bedType ? `${room.bedType} bed` : null}
                    {room.capacity ? ` • Sleeps ${room.capacity}` : null}
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-3'>
                  {room.description && (
                    <p className='text-sm text-muted-foreground'>
                      {room.description}
                    </p>
                  )}
                  {room.amenities && room.amenities.length > 0 && (
                    <div className='flex flex-wrap gap-2'>
                      {room.amenities.slice(0, 6).map((am) => (
                        <Badge key={am} variant='outline'>
                          {am}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact & Policies */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {(apartment.contact?.phone ||
          apartment.contact?.email ||
          apartment.contact?.website) && (
          <Card className='pt-6'>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
              <CardDescription>Get in touch</CardDescription>
            </CardHeader>
            <CardContent className='space-y-1 text-sm'>
              {apartment.contact?.phone && (
                <div>Phone: {apartment.contact.phone}</div>
              )}
              {apartment.contact?.email && (
                <div>Email: {apartment.contact.email}</div>
              )}
            </CardContent>
          </Card>
        )}
        {apartment.policies && (
          <Card className='pt-6'>
            <CardHeader>
              <CardTitle>Policies</CardTitle>
              <CardDescription>House rules</CardDescription>
            </CardHeader>
            <CardContent className='text-sm space-y-2'>
              <div>Check‑in: {apartment.policies.checkIn || 'Flexible'}</div>
              <div>Check‑out: {apartment.policies.checkOut || 'Flexible'}</div>
              {typeof apartment.policies.minStayNights === 'number' && (
                <div>
                  Minimum stay: {apartment.policies.minStayNights} night(s)
                </div>
              )}
              {typeof apartment.policies.maxStayNights === 'number' && (
                <div>
                  Maximum stay: {apartment.policies.maxStayNights} night(s)
                </div>
              )}
              {apartment.policies.cancellation && (
                <div>Cancellation: {apartment.policies.cancellation}</div>
              )}
              {apartment.policies.houseRules &&
                apartment.policies.houseRules.length > 0 && (
                  <ul className='list-disc pl-5'>
                    {apartment.policies.houseRules.map((rule, idx) => (
                      <li key={idx}>{rule}</li>
                    ))}
                  </ul>
                )}
            </CardContent>
          </Card>
        )}
      </div>
      {/* Lightbox */}
      {lightboxItems.length > 0 && (
        <GalleryLightbox
          items={lightboxItems}
          open={lightboxOpen}
          index={activeIndex}
          onOpenChange={(o) => {
            setLightboxOpen(o);
            if (!o) setActiveIndex(null);
          }}
          onPrev={() =>
            setActiveIndex((prev) => {
              const len = lightboxItems.length;
              const i = typeof prev === 'number' ? prev : 0;
              return (i - 1 + len) % len;
            })
          }
          onNext={() =>
            setActiveIndex((prev) => {
              const len = lightboxItems.length;
              const i = typeof prev === 'number' ? prev : 0;
              return (i + 1) % len;
            })
          }
        />
      )}
    </div>
  );
}
