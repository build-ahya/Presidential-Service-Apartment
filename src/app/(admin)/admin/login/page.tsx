import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { LoginForm } from '@/components/admin/login-form';
import { authOptions } from '@/lib/auth';
import { ContentService } from '@/services/content.service';
import { Logo } from '@/components/brand/logo';

export const metadata = { title: 'Sign in' };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;
  // Only allow same-site redirects.
  const next = callbackUrl?.startsWith('/') && !callbackUrl.startsWith('//') ? callbackUrl : '/admin';
  const session = await getServerSession(authOptions);
  if (session?.user?.id) redirect(next);

  const { systemSettings } = await ContentService.getContent();

  return (
    <main className='grid min-h-screen lg:grid-cols-2'>
      <div className='relative hidden flex-col justify-between bg-secondary p-10 text-secondary-foreground lg:flex'>
        <Logo name={systemSettings.siteName} tone='light' className='h-14' />
        <div>
          <p className='font-display text-4xl leading-tight font-semibold'>
            Run your apartments,
            <br />
            your content and your bookings.
          </p>
          <p className='mt-4 max-w-md text-white/70'>
            Manage properties, rates, reservations, pages and photos from one place.
          </p>
        </div>
        <p className='text-sm text-white/50'>© {new Date().getFullYear()} {systemSettings.siteName}</p>
      </div>
      <div className='flex items-center justify-center p-6'>
        <div className='w-full max-w-sm'>
          <div className='mb-8 lg:hidden'>
            <Logo name={systemSettings.siteName} />
          </div>
          <h1 className='text-2xl font-semibold'>Sign in</h1>
          <p className='mt-1 mb-6 text-sm text-muted-foreground'>Use your staff account to continue.</p>
          <LoginForm callbackUrl={next} />
        </div>
      </div>
    </main>
  );
}
