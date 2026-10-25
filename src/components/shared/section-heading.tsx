import { cn } from '@/lib/utils';

export function SectionHeading({
  overline,
  title,
  subtitle,
  align = 'center',
  tone = 'default',
  className,
}: {
  overline?: string;
  title?: string;
  subtitle?: string;
  align?: 'left' | 'center';
  tone?: 'default' | 'light';
  className?: string;
}) {
  if (!title && !overline && !subtitle) return null;
  return (
    <div className={cn('mb-10 flex flex-col gap-3 md:mb-14', align === 'center' && 'items-center text-center', className)}>
      {overline && (
        <p className='text-xs font-semibold tracking-[0.2em] text-primary uppercase'>{overline}</p>
      )}
      {title && (
        <h2
          className={cn(
            'font-display max-w-3xl text-3xl font-semibold md:text-4xl lg:text-5xl',
            tone === 'light' ? 'text-white' : 'text-secondary'
          )}
        >
          {title}
        </h2>
      )}
      {subtitle && (
        <p className={cn('max-w-2xl text-base md:text-lg', tone === 'light' ? 'text-white/75' : 'text-muted-foreground')}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
