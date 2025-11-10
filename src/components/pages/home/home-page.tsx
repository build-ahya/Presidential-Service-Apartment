'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchPosts } from '@/store/slices/blog-slice';
import { VideoWidget } from '@/components/ui/video-widget';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PostCard } from '@/components/ui/post-card';
import FeaturesSection from './features-section';
import HeroSection from './hero-section';
import StatsSection from './stats-section';
import VideoSection from './video-section';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { posts } = useAppSelector((s) => s.blog);

  // Blog: fetch first page (limit 3) for home preview
  useEffect(() => {
    if (!posts || posts.length === 0) {
      dispatch(fetchPosts({ page: 1, limit: 3 }));
    }
  }, [dispatch]);

  // Video: autoplay when in view
  const videoRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(videoRef, { once: true, margin: '-100px' });
  const [shouldPlay, setShouldPlay] = useState(false);
  useEffect(() => {
    if (isInView) setShouldPlay(true);
  }, [isInView]);

  const videoUrl = 'https://youtube.com/shorts/1vrzIrYEkH4';

  function getYouTubeId(url: string): string | null {
    try {
      const u = new URL(url);
      // Standard watch URLs
      const vParam = u.searchParams.get('v');
      if (vParam) return vParam;
      const path = u.pathname;
      // youtu.be short links
      const youtuBe = /^(\/)([A-Za-z0-9_-]{6,})/.exec(path);
      if (u.hostname.includes('youtu.be') && youtuBe?.[2]) return youtuBe[2];
      // embed URLs
      const embedMatch = /\/embed\/([A-Za-z0-9_-]{6,})/.exec(path);
      if (embedMatch?.[1]) return embedMatch[1];
      // shorts URLs
      const shortsMatch = /\/shorts\/([A-Za-z0-9_-]{6,})/.exec(path);
      if (shortsMatch?.[1]) return shortsMatch[1];
      return null;
    } catch {
      return null;
    }
  }

  const ytId = getYouTubeId(videoUrl);

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
      a: 'Use the Check Availability form above or contact our concierge. We will confirm availability and rates.'
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
      <HeroSection />
      <FeaturesSection />
      <StatsSection />

      {/* Video Section - full width, autoplay when in view */}
      <VideoSection
        ref={videoRef}
        url={videoUrl}
        ytId={ytId}
        shouldPlay={shouldPlay}
        onPlay={() => setShouldPlay(true)}
      />

      {/* FAQs Section */}
      <section className='w-full bg-white'>
        <div className='container mx-auto px-6 py-12'>
          <div className='flex flex-col gap-4 mb-6'>
            <h2 className='text-2xl md:text-3xl font-bold text-neutral-900'>Frequently Asked Questions</h2>
            <p className='text-neutral-600'>Answers to common questions about our apartments and services.</p>
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

      {/* Testimony Section */}
      <section className='w-full bg-neutral-50'>
        <div className='container mx-auto px-6 py-12'>
          <div className='flex flex-col gap-4 mb-8'>
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

      {/* Blog Section (at least 3 posts) */}
      <section className='w-full bg-white'>
        <div className='container mx-auto px-6 py-12'>
          <div className='flex flex-col gap-4 mb-8'>
            <h2 className='text-2xl md:text-3xl font-bold text-neutral-900'>Latest from Our Blog</h2>
            <p className='text-neutral-700'>Insights, tips, and updates from Presidential Service Apartment.</p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {(posts || []).slice(0, 3).map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
          <div className='flex justify-end mt-6'>
            <Link href='/blog'>
              <Button variant='ghost'>View all posts</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
