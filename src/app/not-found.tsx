import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <section className="min-h-screen w-full flex items-center justify-center px-4 py-16 bg-white text-black">
      <div className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-xl">

        <div className="relative z-10 p-8 sm:p-10 text-center">
          <div className="flex items-center justify-center gap-3">
            <Image
              src="/images/presidential-service-colored-logo.svg"
              alt="Presidential Service Apartment"
              width={40}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </div>

          <h1 className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900">404</h1>
          <p className="mt-2 text-lg text-neutral-800">Page not found</p>
          <p className="mt-3 text-sm text-neutral-600">
            The page you’re looking for doesn’t exist or may have been moved.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild className="w-full sm:w-auto bg-black text-white hover:bg-black/80">
              <Link href="/">Go back home</Link>
            </Button>
            <Button variant="outline" asChild className="w-full sm:w-auto text-black border-neutral-300 hover:bg-black/5">
              <Link href="/contact">Contact support</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
