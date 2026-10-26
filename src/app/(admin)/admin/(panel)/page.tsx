import Link from 'next/link';
import {
  addDays,
  format,
  isAfter,
  isBefore,
  parseISO,
  startOfMonth,
  startOfToday,
  subMonths,
} from 'date-fns';
import { ArrowDownRight, ArrowRight, ArrowUpRight, BedDouble, CalendarCheck, Clock, Plus, Wallet } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { OverviewChartsClient } from '@/components/admin/overview-charts-client';
import { PageHeader } from '@/components/admin/page-header';
import { StatusBadge } from '@/components/admin/reservations-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { authOptions } from '@/lib/auth';
import { formatMoney } from '@/lib/booking';
import { CatalogService } from '@/services/catalog.service';
import { ReservationService } from '@/services/reservation.service';
import type { Reservation } from '@/models/reservation';

export const metadata = { title: 'Overview' };
export const dynamic = 'force-dynamic';

function Trend({ current, previous }: { current: number; previous: number }) {
  if (previous === 0 && current === 0) return null;
  const pct = previous === 0 ? 100 : Math.round(((current - previous) / previous) * 100);
  const up = pct >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <Badge variant='outline' className='gap-1 font-medium'>
      <Icon className='size-3' /> {up ? '+' : ''}
      {pct}%
    </Badge>
  );
}

export default async function AdminOverview() {
  const [session, { reservations }, apartments] = await Promise.all([
    getServerSession(authOptions),
    ReservationService.list({ limit: 2000 }),
    CatalogService.getApartments({ includeDrafts: true }),
  ]);

  const today = startOfToday();
  const thisMonth = startOfMonth(today);
  const lastMonth = subMonths(thisMonth, 1);
  const names = Object.fromEntries(apartments.map((a) => [a.id, a.name]));
  const created = (r: Reservation) => parseISO(r.createdAt ?? r.checkIn);

  const pending = reservations.filter((r) => r.status === 'pending');
  const confirmed = reservations.filter((r) => r.status === 'confirmed' || r.status === 'completed');
  const arriving = reservations
    .filter((r) => r.status === 'confirmed' && !isBefore(parseISO(r.checkIn), today) && isBefore(parseISO(r.checkIn), addDays(today, 15)))
    .sort((a, b) => a.checkIn.localeCompare(b.checkIn));
  const inHouse = reservations.filter(
    (r) => r.status === 'confirmed' && !isAfter(parseISO(r.checkIn), today) && isAfter(parseISO(r.checkOut), today)
  );

  const inMonth = (r: Reservation, start: Date, end: Date) => !isBefore(created(r), start) && isBefore(created(r), end);
  const requestsNow = reservations.filter((r) => inMonth(r, thisMonth, addDays(today, 1))).length;
  const requestsPrev = reservations.filter((r) => inMonth(r, lastMonth, thisMonth)).length;
  const valueOf = (rs: Reservation[]) => rs.reduce((sum, r) => sum + (r.totalAmount ?? 0), 0);
  const valueNow = valueOf(confirmed.filter((r) => inMonth(r, thisMonth, addDays(today, 1))));
  const valuePrev = valueOf(confirmed.filter((r) => inMonth(r, lastMonth, thisMonth)));

  const chart = Array.from({ length: 6 }, (_, i) => {
    const start = startOfMonth(subMonths(thisMonth, 5 - i));
    const end = startOfMonth(subMonths(thisMonth, 4 - i));
    const inRange = reservations.filter((r) => inMonth(r, start, end));
    return {
      month: format(start, 'MMM'),
      requests: inRange.length,
      confirmed: inRange.filter((r) => r.status === 'confirmed' || r.status === 'completed').length,
    };
  });

  const total = reservations.length || 1;
  const statusRows = (['pending', 'confirmed', 'completed', 'cancelled'] as const).map((s) => ({
    status: s,
    count: reservations.filter((r) => r.status === s).length,
  }));

  const stats = [
    { label: 'Awaiting confirmation', value: String(pending.length), icon: Clock, foot: 'Pending requests', href: '/admin/reservations' },
    { label: 'New requests', value: String(requestsNow), icon: CalendarCheck, foot: 'This month, vs last', trend: <Trend current={requestsNow} previous={requestsPrev} /> },
    { label: 'In house now', value: String(inHouse.length), icon: BedDouble, foot: `of ${apartments.filter((a) => a.status === 'published').length} published apartments` },
    { label: 'Booked value', value: formatMoney(valueNow), icon: Wallet, foot: 'This month, vs last', trend: <Trend current={valueNow} previous={valuePrev} /> },
  ];

  return (
    <>
      <PageHeader
        title={`Welcome back${session?.user.name ? `, ${session.user.name.split(' ')[0]}` : ''}`}
        description='Here’s what’s happening across your apartments.'
        actions={
          <Button asChild>
            <Link href='/admin/apartments/new'>
              <Plus /> New apartment
            </Link>
          </Button>
        }
      />

      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        {stats.map(({ label, value, icon: Icon, foot, trend, href }) => {
          const card = (
            <Card className='h-full'>
              <CardHeader>
                <CardDescription className='flex items-center gap-2'>
                  <Icon className='size-4' /> {label}
                </CardDescription>
                <CardTitle className='text-3xl font-semibold tabular-nums'>{value}</CardTitle>
                {trend && <CardAction>{trend}</CardAction>}
              </CardHeader>
              <CardFooter className='text-sm text-muted-foreground'>{foot}</CardFooter>
            </Card>
          );
          return href ? (
            <Link key={label} href={href} className='transition-opacity hover:opacity-90'>
              {card}
            </Link>
          ) : (
            <div key={label}>{card}</div>
          );
        })}
      </div>

      <div className='mt-4 grid gap-4 lg:grid-cols-3'>
        <Card className='lg:col-span-2'>
          <CardHeader>
            <CardTitle>Reservation requests</CardTitle>
            <CardDescription>Last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <OverviewChartsClient data={chart} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>By status</CardTitle>
            <CardDescription>{reservations.length} reservations in total</CardDescription>
          </CardHeader>
          <CardContent className='flex flex-col gap-4'>
            {statusRows.map(({ status, count }) => (
              <div key={status} className='flex flex-col gap-1.5'>
                <div className='flex items-center justify-between text-sm'>
                  <StatusBadge status={status} />
                  <span className='tabular-nums text-muted-foreground'>{count}</span>
                </div>
                <Progress value={(count / total) * 100} className='h-1.5' />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className='mt-4 grid gap-4 lg:grid-cols-3'>
        <Card className='lg:col-span-2'>
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
            {reservations.length === 0 ? (
              <p className='py-6 text-center text-sm text-muted-foreground'>No reservations yet.</p>
            ) : (
              <ul className='divide-y'>
                {reservations.slice(0, 6).map((r) => (
                  <li key={r.id} className='flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0'>
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
            <CardTitle>Arriving soon</CardTitle>
            <CardDescription>Confirmed check-ins, next 2 weeks</CardDescription>
          </CardHeader>
          <CardContent>
            {arriving.length === 0 ? (
              <p className='py-6 text-center text-sm text-muted-foreground'>No upcoming arrivals.</p>
            ) : (
              <ul className='flex flex-col gap-4'>
                {arriving.slice(0, 6).map((r) => (
                  <li key={r.id} className='flex items-center gap-3'>
                    <span className='flex size-11 shrink-0 flex-col items-center justify-center rounded-lg bg-primary/15 text-xs leading-tight font-semibold'>
                      <span>{format(parseISO(r.checkIn), 'd')}</span>
                      <span className='font-normal text-muted-foreground uppercase'>{format(parseISO(r.checkIn), 'MMM')}</span>
                    </span>
                    <div className='min-w-0'>
                      <p className='truncate text-sm font-medium'>{r.guest.name}</p>
                      <p className='truncate text-xs text-muted-foreground'>{(r.apartmentId && names[r.apartmentId]) || 'Whole property'}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
