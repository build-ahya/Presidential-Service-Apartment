import Link from 'next/link';
import { addDays, format, isAfter, isBefore, parseISO, startOfMonth, startOfToday } from 'date-fns';
import { ArrowRight, BedDouble, CalendarCheck, Clock, Wallet } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { PageHeader } from '@/components/admin/page-header';
import { StatusBadge } from '@/components/admin/reservations-table';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authOptions } from '@/lib/auth';
import { formatMoney } from '@/lib/booking';
import { CatalogService } from '@/services/catalog.service';
import { ReservationService } from '@/services/reservation.service';

export const metadata = { title: 'Overview' };
export const dynamic = 'force-dynamic';

export default async function AdminOverview() {
  const [session, { reservations }, apartments] = await Promise.all([
    getServerSession(authOptions),
    ReservationService.list({ limit: 1000 }),
    CatalogService.getApartments({ includeDrafts: true }),
  ]);

  const today = startOfToday();
  const names = Object.fromEntries(apartments.map((a) => [a.id, a.name]));
  const pending = reservations.filter((r) => r.status === 'pending');
  const confirmed = reservations.filter((r) => r.status === 'confirmed');
  const arriving = confirmed
    .filter((r) => !isBefore(parseISO(r.checkIn), today) && isBefore(parseISO(r.checkIn), addDays(today, 8)))
    .sort((a, b) => a.checkIn.localeCompare(b.checkIn));
  const staying = confirmed.filter((r) => !isAfter(parseISO(r.checkIn), today) && isAfter(parseISO(r.checkOut), today));
  const monthRevenue = confirmed
    .filter((r) => !isBefore(parseISO(r.checkIn), startOfMonth(today)) && r.totalAmount)
    .reduce((sum, r) => sum + (r.totalAmount ?? 0), 0);
  const recent = reservations.slice(0, 6);

  const stats = [
    { label: 'Awaiting confirmation', value: pending.length, icon: Clock, href: '/admin/reservations', hint: 'Pending requests' },
    { label: 'Arriving this week', value: arriving.length, icon: CalendarCheck, href: '/admin/reservations', hint: 'Confirmed check-ins' },
    { label: 'In house now', value: staying.length, icon: BedDouble, hint: `of ${apartments.filter((a) => a.status === 'published').length} apartments` },
    { label: 'Confirmed value', value: formatMoney(monthRevenue), icon: Wallet, hint: 'Stays from this month on' },
  ];

  return (
    <>
      <PageHeader title={`Welcome${session?.user.name ? `, ${session.user.name.split(' ')[0]}` : ''}`} description='Here’s what’s happening across your apartments.' />

      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        {stats.map(({ label, value, icon: Icon, hint, href }) => {
          const body = (
            <Card className='h-full transition-shadow hover:shadow-md'>
              <CardHeader>
                <CardDescription className='flex items-center justify-between'>
                  {label}
                  <Icon className='size-4' />
                </CardDescription>
                <CardTitle className='text-3xl tabular-nums'>{value}</CardTitle>
              </CardHeader>
              <CardContent className='text-xs text-muted-foreground'>{hint}</CardContent>
            </Card>
          );
          return href ? (
            <Link key={label} href={href}>
              {body}
            </Link>
          ) : (
            <div key={label}>{body}</div>
          );
        })}
      </div>

      <div className='mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]'>
        <Card>
          <CardHeader>
            <CardTitle>Recent requests</CardTitle>
            <CardDescription>Latest reservations from the website</CardDescription>
            <CardAction>
              <Button asChild variant='ghost' size='sm'>
                <Link href='/admin/reservations'>
                  View all <ArrowRight />
                </Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            {recent.length === 0 ? (
              <p className='py-6 text-center text-sm text-muted-foreground'>No reservations yet.</p>
            ) : (
              <ul className='divide-y'>
                {recent.map((r) => (
                  <li key={r.id} className='flex items-center justify-between gap-4 py-3'>
                    <div className='min-w-0'>
                      <p className='truncate font-medium'>{r.guest.name}</p>
                      <p className='truncate text-sm text-muted-foreground'>
                        {(r.apartmentId && names[r.apartmentId]) || 'Whole property'} · {format(parseISO(r.checkIn), 'd MMM')} –{' '}
                        {format(parseISO(r.checkOut), 'd MMM yyyy')}
                      </p>
                    </div>
                    <StatusBadge status={r.status} />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col gap-2'>
            <Button asChild variant='outline' className='justify-start'>
              <Link href='/admin/apartments/new'>Add an apartment</Link>
            </Button>
            <Button asChild variant='outline' className='justify-start'>
              <Link href='/admin/content/home'>Edit the home page</Link>
            </Button>
            <Button asChild variant='outline' className='justify-start'>
              <Link href='/admin/media'>Upload photos</Link>
            </Button>
            <Button asChild variant='outline' className='justify-start'>
              <Link href='/admin/blog/new'>Write a blog post</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
