'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { VideoWidget } from '@/components/ui/video-widget';

type VideoSectionProps = {
  url: string;
  ytId: string | null;
  shouldPlay: boolean;
  onPlay: () => void;
};

const VideoSection = forwardRef<HTMLDivElement, VideoSectionProps>(
  ({ url, ytId, shouldPlay, onPlay }, ref) => {
    return (
      <section className="w-full bg-black">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col gap-4 mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Experience the Lifestyle</h2>
            <p className="text-white/80">A glimpse into our spaces and services.</p>
          </div>

          <motion.div
            ref={ref}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
            className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10"
          >
            {shouldPlay && ytId ? (
              <iframe
                title="Presidential Service Apartments — video"
                src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&playsinline=1&rel=0`}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <VideoWidget
                url={url}
                alt="Intro video"
                className="absolute inset-0"
                onClick={onPlay}
              />
            )}
          </motion.div>
        </div>
      </section>
    );
  }
);

VideoSection.displayName = 'VideoSection';

export default VideoSection;