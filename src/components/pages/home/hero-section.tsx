'use client';
import { CheckAvailabilityForm } from '@/components/forms/check-availability-form';
import { useAppSelector } from '@/store/hooks';

export default function HeroSection() {
  const { apartments } = useAppSelector((s) => s.apartment);

  return (
    <section className='relative h-screen w-full overflow-hidden'>
      <div
        className='absolute inset-0 bg-cover bg-center bg-no-repeat'
        style={{
          backgroundImage:
            'url(/images/presidential-service-apartments-room.jpg)',
        }}
      >
        <div className='absolute inset-0 bg-black/40' />
      </div>

      {/* Header moved to shared component. */}

      <div className='relative z-10 flex h-[calc(100vh-18px)] flex-col items-center justify-center px-8 mt-24 text-center'>
        <h1 className='max-w-4xl text-3xl sm:text-5xl md:text-7xl font-bold text-white mb-6 md:mb-12'>
          A Better Life Starts with the Right Home
        </h1>
        <p className='max-w-2xl text-sm sm:text-lg md:text-xl text-white/90 mb-10'>
          Discover elevated living at Presidential Service Apartments
        </p>

        <CheckAvailabilityForm apartments={apartments} showApartmentSelect />
      </div>
    </section>
  );
}
