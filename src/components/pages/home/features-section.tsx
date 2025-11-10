'use client';
import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { MediaCarousel } from '@/components/ui/media-carousel';
import { Badge } from '@/components/ui/badge';
import { GalleryLightbox } from '@/components/ui/gallery-lightbox';

export default function FeaturesSection() {
  const {
    apartments,
    isLoading: loading,
    error,
  } = useAppSelector((s) => s.apartment);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [lightboxItems, setLightboxItems] = useState<
    Array<{
      url: string;
      alt: string;
      type: 'image' | 'video';
      caption?: string;
    }>
  >([]);

  // Safely derive a city/state label from the first apartment that has it
  const firstAddress = apartments.find(
    (a) => a?.location?.address?.city && a?.location?.address?.state
  )?.location?.address;
  const locationLabel = firstAddress
    ? `${firstAddress.city}, ${firstAddress.state}`
    : null;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % apartments.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + apartments.length) % apartments.length
    );
  };

  return (
    <section className='py-24 px-8 bg-gray-50'>
      <div className='container mx-auto'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
            Discover Your Next Home
          </h2>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto mb-6'>
            Find everything from cozy apartments to spacious family homes
            tailored to fit your lifestyle.
          </p>
          {locationLabel && (
            <div className='flex items-center justify-center gap-2 text-gray-700'>
              <MapPin className='h-5 w-5' />
              <span className='font-medium'>{locationLabel}</span>
            </div>
          )}
        </div>

        <div className='relative'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {apartments.slice(0, 3).map((apartment, index) => {
              return apartment.rooms.slice(0, 3).map((room, index) => (
                <Card key={room.id} className='overflow-hidden'>
                  {Array.isArray(room.media) && room.media.length > 0 && (
                    <MediaCarousel
                      items={room.media
                        .filter((m) => m.type === 'image' && m.url)
                        .map((m) => ({
                          url: m.url,
                          alt: m.alt || room.name,
                          caption: m.caption,
                        }))}
                      heightClass='h-40'
                      autoplay={true}
                      delayMs={3500 + index * 200}
                      onOpen={(idx: number) => {
                        const imgs = room.media
                          .filter((m) => m.type === 'image' && m.url)
                          .map((m) => ({
                            url: m.url,
                            alt: m.alt || room.name,
                            type: 'image' as const,
                            caption: m.caption,
                          }));
                        setLightboxItems(imgs);
                        setActiveIndex(idx);
                        setLightboxOpen(true);
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
              ));
            })}
          </div>

          <div className='flex items-center justify-center gap-4 mt-12'>
            <Button
              variant='outline'
              size='icon'
              onClick={prevSlide}
              className='rounded-full h-12 w-12'
            >
              <ChevronLeft className='h-6 w-6' />
            </Button>
            <div className='flex gap-2'>
              {apartments.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex ? 'w-8 bg-black' : 'w-2 bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <Button
              variant='outline'
              size='icon'
              onClick={nextSlide}
              className='rounded-full h-12 w-12'
            >
              <ChevronRight className='h-6 w-6' />
            </Button>
          </div>
        </div>
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
    </section>
  );
}
