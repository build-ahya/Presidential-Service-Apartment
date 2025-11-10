'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function AboutPage() {
  const aboutIntro = {
    title: 'Presidential Service Apartments',
    slogan: 'A Slice of Paradise',
    paragraphs: [
      'It is right between your hands. Cool nature. Find yourself in a harmonious blend of 5 stars’ standard hospitality, attention to detail and international know‑how.',
      'At Presidential Service Apartments, we love making our guests feel comfortable, energized and productive when they stay with us. We do this by combining premium accommodations with great services.',
      "As one of our guests, we know how busy you are. And, we know the importance of a good night's sleep. That's why we have the Swiss Sleep Advantage — helping you fall asleep and rest well, waking up to take on the day.",
    ],
  };

  const features = [
    'Fully equipped kitchen with utensils',
    'In‑house laundry services',
    'Flat‑screen LED TV',
    'High‑speed fiber optic internet',
    '24 hours electricity',
  ];

  const facilities = [
    'Informal meeting spaces',
    'Small to medium‑sized group facilities',
    'Concierge support',
    'Secure, serene neighborhoods',
  ];

  const faqs = [
    {
      q: 'What amenities are included?',
      a: 'Apartments include fully furnished rooms, reliable power, high-speed internet, 24/7 security, housekeeping, and concierge services.'
    },
    {
      q: 'Do you offer short and long stays?',
      a: 'Yes. We support short-let stays and long-term rentals. Contact us for tailored rates based on duration.'
    },
    {
      q: 'Where are you located?',
      a: 'We are based in Port Harcourt, Nigeria, with properties situated in prime, secure neighborhoods.'
    },
    {
      q: 'How do I book?',
      a: 'Use the Check Availability form or contact our concierge. We will confirm availability and rates.'
    },
  ];

  const testimonials = [
    {
      name: 'Adaeze O.',
      role: 'Guest — Business Stay',
      quote:
        'Immaculate rooms and seamless service. The internet was fast, and the staff were always helpful.'
    },
    {
      name: 'Kunle A.',
      role: 'Guest — Holiday',
      quote:
        'Perfect for family trips. Secure, quiet, and comfortable. It felt like a boutique hotel with the privacy of home.'
    },
    {
      name: 'Chinedu M.',
      role: 'Corporate Client',
      quote:
        'Our team stayed for 3 weeks. Great location and amenities. We will definitely book again.'
    },
  ];

  return (
    <div className='min-h-screen bg-white'>
      {/* Hero */}
      <section className='w-full bg-neutral-50 my-24'>
        <div className='container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center'>
          <div>
            <h1 className='text-3xl md:text-4xl font-bold text-neutral-900'>{aboutIntro.title}</h1>
            <p className='mt-2 text-lg text-neutral-700'>{aboutIntro.slogan}</p>
            <div className='mt-4 space-y-3'>
              {aboutIntro.paragraphs.map((p, i) => (
                <p key={i} className='text-neutral-700'>{p}</p>
              ))}
            </div>
            <div className='mt-6'>
              <Link href='/apartments'>
                <Button>Explore Apartments</Button>
              </Link>
            </div>
          </div>
          <div className='relative w-full h-[280px] md:h-[360px] rounded-2xl overflow-hidden border border-neutral-200'>
            <Image
              src='/images/presidential-service-apartments.jpg'
              alt='Presidential Service Apartments — exterior view'
              fill
              className='object-cover'
              priority
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className='w-full bg-white'>
        <div className='container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div>
            <h2 className='text-2xl md:text-3xl font-bold text-neutral-900'>Signature Comforts</h2>
            <p className='mt-2 text-neutral-700'>Premium in‑apartment amenities designed for rest and productivity.</p>
            <ul className='mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3'>
              {features.map((f) => (
                <li key={f} className='rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-800'>{f}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className='relative w-full h-[260px] rounded-2xl overflow-hidden border border-neutral-200'>
              <Image
                src='/images/presidential-service-apartments-room.jpg'
                alt='Apartment interior — living space'
                fill
                className='object-cover'
              />
            </div>
            <div className='mt-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-4'>
              <h3 className='text-base font-semibold text-neutral-900'>Facilities</h3>
              <ul className='mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2'>
                {facilities.map((f) => (
                  <li key={f} className='text-neutral-700'>{f}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CEO Quote */}
      <section className='w-full bg-secondary text-white'>
        <div className='container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 items-center'>
          <div className='flex md:block items-center justify-center'>
            <div className='relative h-24 w-24 md:h-32 md:w-32 rounded-full overflow-hidden ring-2 ring-white/20 shadow-lg'>
              <Image
                src='/images/psa-avatar-ceo.jpg'
                alt='CEO portrait'
                fill
                className='object-cover'
                sizes='128px'
                priority
              />
            </div>
          </div>
          <blockquote className='rounded-xl border border-white/15 bg-white/5 p-6'>
            <p className='text-xl md:text-3xl font-semibold leading-relaxed'>
              “Stay in the heart of Port Harcourt. Contemporary, convenient and perfectly positioned, the upscale Presidential Apartments PH is ideal for business travelers. Just 30 minutes from the Airport, centrally located on Eagle Island.”
            </p>
            <footer className='mt-4 text-white/80'>
              <span className='font-semibold'>Chief Executive Officer</span>
              <span className='mx-2'>•</span>
              Presidential Service Apartments
            </footer>
          </blockquote>
        </div>
      </section>

      {/* FAQs */}
      <section className='w-full bg-white'>
        <div className='container mx-auto px-6 py-12'>
          <div className='flex flex-col gap-2 mb-6'>
            <h2 className='text-2xl md:text-3xl font-bold text-neutral-900'>Frequently Asked Questions</h2>
            <p className='text-neutral-700'>Answers to common questions about our apartments and services.</p>
          </div>
          <Accordion type='single' collapsible className='w-full'>
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className='text-neutral-900'>{f.q}</AccordionTrigger>
                <AccordionContent>
                  <p className='text-neutral-700'>{f.a}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Testimonials */}
      <section className='w-full bg-neutral-50'>
        <div className='container mx-auto px-6 py-12'>
          <div className='flex flex-col gap-2 mb-8'>
            <h2 className='text-2xl md:text-3xl font-bold text-neutral-900'>What Our Guests Say</h2>
            <p className='text-neutral-700'>Real experiences from guests and corporate partners.</p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {testimonials.map((t, i) => (
              <Card key={i} className='h-full pt-6'>
                <CardHeader>
                  <CardTitle className='text-neutral-900'>{t.name}</CardTitle>
                  <CardDescription>{t.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className='text-neutral-700'>{t.quote}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className='w-full bg-[#005eac] text-white'>
        <div className='relative container mx-auto px-6 py-16 overflow-hidden'>
          <div className='absolute inset-0 pointer-events-none'>
            <Image
              src='/icons/halftone-circle-pattern.svg'
              alt=''
              fill
              className='object-cover object-left opacity-8'
              sizes='300vw'
            />
          </div>
          <div className='relative z-10 flex flex-col md:flex-row items-center justify-between gap-8'>
            <div>
              <h3 className='text-3xl md:text-4xl font-extrabold tracking-tight'>Plan your next getaway</h3>
              <p className='mt-3 text-lg text-white/85'>Exclusive offers, packages and discounts on furnished apartments.</p>
            </div>
            <div className='flex items-center gap-4'>
              <Link href='/apartments'>
                <Button className='bg-white text-black hover:bg-white/90'>
                  Browse Apartments
                  <ArrowRight className='ml-2 h-5 w-5' />
                </Button>
              </Link>
              <Link href='/contact'>
                <Button>
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
