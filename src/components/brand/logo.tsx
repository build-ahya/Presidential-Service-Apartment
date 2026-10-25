import Image from 'next/image';
import { cn } from '@/lib/utils';

const LOGOS = {
  dark: '/images/presidential-service-colored-logo.svg', // for light backgrounds
  light: '/images/presidential-service-logo.svg', // white, for dark backgrounds
};

/** The brand logo only — the artwork already contains the name. */
export function Logo({
  name,
  tone = 'dark',
  className,
}: {
  name: string;
  tone?: 'light' | 'dark';
  className?: string;
}) {
  return (
    <Image
      src={LOGOS[tone]}
      alt={name}
      width={813}
      height={211}
      unoptimized
      priority
      className={cn('h-11 w-auto', className)}
    />
  );
}
