'use client';

import { useAppSelector } from '@/store/hooks';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { ArrowRight } from 'lucide-react';

export default function ContactPage() {
  const { content } = useAppSelector((state) => state.content);

  const { siteName, contact, socialLinks } = content.systemSettings;

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'Facebook':
        return (
          <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
            <path d='M22 12a10 10 0 1 0-11.5 9.9v-7H8v-3h2.5V9.5a3.5 3.5 0 0 1 3.8-3.8h2.7v3h-2c-.6 0-1 .4-1 1V12h3l-.5 3h-2.5v7A10 10 0 0 0 22 12Z' />
          </svg>
        );
      case 'Instagram':
        return (
          <svg
            className='w-5 h-5'
            fill='currentColor'
            viewBox='0 0 32 32'
            xmlns='http://www.w3.org/2000/svg'
          >
            <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
            <g
              id='SVGRepo_tracerCarrier'
              strokeLinecap='round'
              strokeLinejoin='round'
            ></g>
            <g id='SVGRepo_iconCarrier'>
              <path d='M20.445 5h-8.891A6.559 6.559 0 0 0 5 11.554v8.891A6.559 6.559 0 0 0 11.554 27h8.891a6.56 6.56 0 0 0 6.554-6.555v-8.891A6.557 6.557 0 0 0 20.445 5zm4.342 15.445a4.343 4.343 0 0 1-4.342 4.342h-8.891a4.341 4.341 0 0 1-4.341-4.342v-8.891a4.34 4.34 0 0 1 4.341-4.341h8.891a4.342 4.342 0 0 1 4.341 4.341l.001 8.891z'></path>
              <path d='M16 10.312c-3.138 0-5.688 2.551-5.688 5.688s2.551 5.688 5.688 5.688 5.688-2.551 5.688-5.688-2.55-5.688-5.688-5.688zm0 9.163a3.475 3.475 0 1 1-.001-6.95 3.475 3.475 0 0 1 .001 6.95zM21.7 8.991a1.363 1.363 0 1 1-1.364 1.364c0-.752.51-1.364 1.364-1.364z'></path>
            </g>
          </svg>
        );
      case 'Tiktok':
        return (
          <svg
            className='w-5 h-5'
            fill='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
            <g
              id='SVGRepo_tracerCarrier'
              strokeLinecap='round'
              strokeLinejoin='round'
            ></g>
            <g id='SVGRepo_iconCarrier'>
              <path d='M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z'></path>
            </g>
          </svg>
        );
      case 'X':
        return (
          <svg
            className='w-5 h-5'
            fill='currentColor'
            xmlns='http://www.w3.org/2000/svg'
            x='0px'
            y='0px'
            viewBox='0 0 30 30'
          >
            <path d='M26.37,26l-8.795-12.822l0.015,0.012L25.52,4h-2.65l-6.46,7.48L11.28,4H4.33l8.211,11.971L12.54,15.97L3.88,26h2.65 l7.182-8.322L19.42,26H26.37z M10.23,6l12.34,18h-2.1L8.12,6H10.23z'></path>
          </svg>
        );
      case 'Whatsapp':
        return (
          <svg
            className='w-5 h-5'
            viewBox='0 0 24 24'
            fill='currentColor'
            xmlns='http://www.w3.org/2000/svg'
          >
            <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
            <g
              id='SVGRepo_tracerCarrier'
              strokeLinecap='round'
              strokeLinejoin='round'
            ></g>
            <g id='SVGRepo_iconCarrier'>
              {' '}
              <path d='M6.014 8.00613C6.12827 7.1024 7.30277 5.87414 8.23488 6.01043L8.23339 6.00894C9.14051 6.18132 9.85859 7.74261 10.2635 8.44465C10.5504 8.95402 10.3641 9.4701 10.0965 9.68787C9.7355 9.97883 9.17099 10.3803 9.28943 10.7834C9.5 11.5 12 14 13.2296 14.7107C13.695 14.9797 14.0325 14.2702 14.3207 13.9067C14.5301 13.6271 15.0466 13.46 15.5548 13.736C16.3138 14.178 17.0288 14.6917 17.69 15.27C18.0202 15.546 18.0977 15.9539 17.8689 16.385C17.4659 17.1443 16.3003 18.1456 15.4542 17.9421C13.9764 17.5868 8 15.27 6.08033 8.55801C5.97237 8.24048 5.99955 8.12044 6.014 8.00613Z'></path>{' '}
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M12 23C10.7764 23 10.0994 22.8687 9 22.5L6.89443 23.5528C5.56462 24.2177 4 23.2507 4 21.7639V19.5C1.84655 17.492 1 15.1767 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23ZM6 18.6303L5.36395 18.0372C3.69087 16.4772 3 14.7331 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C11.0143 21 10.552 20.911 9.63595 20.6038L8.84847 20.3397L6 21.7639V18.6303Z'
              ></path>{' '}
            </g>
          </svg>
        );
      default:
        return '';
    }
  };

  const telHref = (phone?: string) =>
    phone ? `tel:${phone.replace(/\s+/g, '')}` : '#';

  const whatsappHref = (phone?: string) => {
    if (!phone) return '#';
    const digits = phone.replace(/\D/g, '');
    return `https://wa.me/${digits}`;
  };

  const faqs = [
    {
      q: 'How do I make a reservation?',
      a: 'Browse apartments, select your dates, and submit the reservation form. Our team will confirm availability and follow up promptly.'
    },
    {
      q: 'Can I contact support via WhatsApp?',
      a: 'Yes. Use the WhatsApp “Chat” button to reach us directly for quick assistance, changes, or questions.'
    },
    {
      q: 'What is your response time?',
      a: 'We typically respond within minutes on WhatsApp and within 24 hours via email.'
    },
    {
      q: 'Where are you located?',
      a: 'Our main office is on Eagle Island, Port Harcourt, Nigeria. See addresses below for full details and phone numbers.'
    }
  ];

  return (
    <section className='min-h-screen bg-white text-black my-24'>
      <div className='container mx-auto px-6 py-12'>
        <div className='flex flex-col gap-2 mb-8'>
          <h1 className='text-3xl md:text-4xl font-bold tracking-tight'>
            Contact {siteName}
          </h1>
          <p className='text-neutral-700'>
            We’re here to help with bookings, support, and enquiries.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <Card className='border-neutral-200 pt-6'>
            <CardHeader>
              <CardTitle>Call Us</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              {(contact?.phones || []).map((p, idx) => (
                <div
                  key={idx}
                  className='flex items-center justify-between gap-3'
                >
                  <span className='text-neutral-800'>{p}</span>
                  <Link href={telHref(p)}>
                    <Button variant='outline' className='h-9'>
                      Call
                    </Button>
                  </Link>
                </div>
              ))}
              {(!contact?.phones || contact?.phones.length === 0) && (
                <div className='text-neutral-600'>
                  No phone number available
                </div>
              )}
            </CardContent>
          </Card>

          <Card className='border-neutral-200 pt-6'>
            <CardHeader>
              <CardTitle>WhatsApp</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              <div className='flex items-center justify-between gap-3'>
                <span className='text-neutral-800'>
                  {contact?.whatsappPhone || '—'}
                </span>
                <Link
                  href={whatsappHref(contact?.whatsappPhone)}
                  target='_blank'
                >
                  <Button className='bg-green-600 hover:bg-green-700 text-white h-9'>
                    Chat
                  </Button>
                </Link>
              </div>
              <p className='text-sm text-neutral-600'>
                We typically respond within minutes.
              </p>
            </CardContent>
          </Card>

          <Card className='border-neutral-200 pt-6'>
            <CardHeader>
              <CardTitle>Email Us</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              <div className='flex items-center justify-between gap-3'>
                <span className='text-neutral-800'>
                  {contact?.email || '—'}
                </span>
                <Link href={contact?.email ? `mailto:${contact.email}` : '#'}>
                  <Button variant='outline' className='h-9'>
                    Email
                  </Button>
                </Link>
              </div>
              <p className='text-sm text-neutral-600'>
                We’ll get back to you within 24 hours.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className='mt-8 grid grid-cols-1 gap-6'>
          <Card className='border-neutral-200 pt-6'>
            <CardHeader>
              <CardTitle>Office Address</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {(contact?.addresses || []).map((addr, idx) => (
                <div
                  key={idx}
                  className='rounded-xl border border-neutral-200 p-4'
                >
                  <div className='font-semibold text-neutral-900'>
                    {addr.country}
                  </div>
                  <div className='mt-1 text-neutral-800'>{addr.address}</div>
                  <div className='mt-1 text-neutral-700'>
                    Phone: {addr.phone}
                  </div>
                  <div className='mt-2'>
                    <Link href={telHref(addr.phone)}>
                      <Button variant='outline' size='sm'>
                        Call Office
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
              {(!contact?.addresses || contact?.addresses.length === 0) && (
                <div className='text-neutral-600'>No address provided</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* FAQs */}
        <div className='mt-10'>
          <div className='flex flex-col gap-2 mb-6'>
            <h2 className='text-2xl md:text-3xl font-bold text-neutral-900'>Frequently Asked Questions</h2>
            <p className='text-neutral-700'>Answers to common questions about reservations and support.</p>
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

        {/* CTA */}
        <div className='mt-12'>
          <section className='w-full bg-[#005eac] text-white rounded-2xl overflow-hidden'>
            <div className='relative container mx-auto px-6 py-12'>
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

        <div className='mt-10'>
          <h2 className='text-xl font-semibold'>Connect with us</h2>
          <div className='mt-4 flex flex-wrap items-center gap-3'>
            {(socialLinks || []).map((s, idx) => (
              <Link key={idx} href={s.href} target='_blank' className='group'>
                <span className='inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-200 bg-neutral-50 group-hover:bg-neutral-100 text-neutral-900'>
                  {getSocialIcon(s.label)}
                  <span className='text-sm font-medium'>{s.label}</span>
                </span>
              </Link>
            ))}
            {(!socialLinks || socialLinks.length === 0) && (
              <div className='text-neutral-600'>No social links available</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
