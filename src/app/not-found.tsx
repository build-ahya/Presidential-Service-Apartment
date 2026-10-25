import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <section className='grid min-h-screen place-items-center bg-muted/40 px-4 py-16'>
      <div className='flex max-w-md flex-col items-center gap-4 text-center'>
        <p className='font-display text-8xl font-semibold text-primary'>404</p>
        <h1 className='font-display text-3xl font-semibold text-secondary'>Page not found</h1>
        <p className='text-muted-foreground'>
          The page you’re looking for doesn’t exist or may have been moved.
        </p>
        <div className='mt-2 flex flex-wrap justify-center gap-3'>
          <Button asChild size='lg'>
            <Link href='/'>Back to home</Link>
          </Button>
          <Button asChild size='lg' variant='outline'>
            <Link href='/apartments'>Browse apartments</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
