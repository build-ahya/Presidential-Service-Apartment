'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';
import { Check, CheckCheck, Mail, MoreHorizontal, Phone, Search, Trash2, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatMoney } from '@/lib/booking';
import type { Reservation, ReservationStatus } from '@/models/reservation';
import { api } from './api';

const STATUS_STYLE: Record<ReservationStatus, string> = {
  pending: 'bg-amber-100 text-amber-900 hover:bg-amber-100 dark:bg-amber-500/20 dark:text-amber-200',
  confirmed: 'bg-emerald-100 text-emerald-900 hover:bg-emerald-100 dark:bg-emerald-500/20 dark:text-emerald-200',
  cancelled: 'bg-red-100 text-red-900 hover:bg-red-100 dark:bg-red-500/20 dark:text-red-200',
  completed: 'bg-slate-200 text-slate-900 hover:bg-slate-200 dark:bg-slate-500/30 dark:text-slate-200',
};

export function StatusBadge({ status }: { status: ReservationStatus }) {
  return (
    <Badge variant='secondary' className={`capitalize ${STATUS_STYLE[status]}`}>
      {status}
    </Badge>
  );
}

const day = (s: string) => format(parseISO(s), 'd MMM yyyy');

export function ReservationsTable({
  reservations,
  apartmentNames,
  canDelete,
}: {
  reservations: Reservation[];
  apartmentNames: Record<string, string>;
  canDelete: boolean;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<'all' | ReservationStatus>('all');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<Reservation | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const counts = useMemo(
    () =>
      reservations.reduce<Record<string, number>>(
        (acc, r) => ({ ...acc, [r.status]: (acc[r.status] ?? 0) + 1 }),
        {}
      ),
    [reservations]
  );

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return reservations.filter(
      (r) =>
        (status === 'all' || r.status === status) &&
        (!q || [r.guest.name, r.guest.email, r.guest.phone].some((v) => v?.toLowerCase().includes(q)))
    );
  }, [reservations, status, query]);

  async function setReservationStatus(r: Reservation, next: ReservationStatus) {
    setBusy(r.id);
    try {
      await api(`/api/admin/reservations/${r.id}`, { method: 'PUT', body: { status: next } });
      toast.success(`Reservation ${next}${next === 'confirmed' || next === 'cancelled' ? ' — guest notified' : ''}`);
      setOpen(null);
      router.refresh();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(null);
    }
  }

  async function remove(r: Reservation) {
    if (!window.confirm(`Delete the reservation for ${r.guest.name}? This cannot be undone.`)) return;
    setBusy(r.id);
    try {
      await api(`/api/admin/reservations/${r.id}`, { method: 'DELETE' });
      toast.success('Reservation deleted');
      setOpen(null);
      router.refresh();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(null);
    }
  }

  const aptName = (r: Reservation) =>
    (r.apartmentId && apartmentNames[r.apartmentId]) || (r.legacyApartmentId ? 'Whole property (legacy)' : '—');

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <Tabs value={status} onValueChange={(v) => setStatus(v as typeof status)}>
          <TabsList>
            <TabsTrigger value='all'>All ({reservations.length})</TabsTrigger>
            {(['pending', 'confirmed', 'completed', 'cancelled'] as const).map((s) => (
              <TabsTrigger key={s} value={s} className='capitalize'>
                {s} ({counts[s] ?? 0})
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className='relative w-full sm:w-72'>
          <Search className='absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground' />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder='Search guest…' className='pl-9' aria-label='Search reservations' />
        </div>
      </div>

      <div className='overflow-x-auto rounded-xl border bg-card'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Guest</TableHead>
              <TableHead>Apartment</TableHead>
              <TableHead>Stay</TableHead>
              <TableHead className='text-right'>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='w-10' />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className='py-12 text-center text-muted-foreground'>
                  No reservations found.
                </TableCell>
              </TableRow>
            )}
            {rows.map((r) => (
              <TableRow key={r.id} className='cursor-pointer' onClick={() => setOpen(r)}>
                <TableCell>
                  <p className='font-medium'>{r.guest.name}</p>
                  <p className='text-xs text-muted-foreground'>{r.guest.email}</p>
                </TableCell>
                <TableCell className='text-muted-foreground'>{aptName(r)}</TableCell>
                <TableCell className='whitespace-nowrap'>
                  {day(r.checkIn)} → {day(r.checkOut)}
                  <p className='text-xs text-muted-foreground'>
                    {r.nights ? `${r.nights} night${r.nights === 1 ? '' : 's'}` : ''}
                    {r.guestsCount ? ` · ${r.guestsCount} guest${r.guestsCount === 1 ? '' : 's'}` : ''}
                  </p>
                </TableCell>
                <TableCell className='text-right tabular-nums'>
                  {r.totalAmount != null ? formatMoney(r.totalAmount, r.currency) : '—'}
                </TableCell>
                <TableCell>
                  <StatusBadge status={r.status} />
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' size='icon-sm' aria-label='Actions' disabled={busy === r.id}>
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuGroup>
                        {r.status !== 'confirmed' && (
                          <DropdownMenuItem onClick={() => setReservationStatus(r, 'confirmed')}>
                            <Check /> Confirm
                          </DropdownMenuItem>
                        )}
                        {r.status === 'confirmed' && (
                          <DropdownMenuItem onClick={() => setReservationStatus(r, 'completed')}>
                            <CheckCheck /> Mark completed
                          </DropdownMenuItem>
                        )}
                        {r.status !== 'cancelled' && (
                          <DropdownMenuItem onClick={() => setReservationStatus(r, 'cancelled')}>
                            <X /> Cancel
                          </DropdownMenuItem>
                        )}
                        {canDelete && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant='destructive' onClick={() => remove(r)}>
                              <Trash2 /> Delete
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Sheet open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <SheetContent className='w-full gap-0 sm:max-w-md'>
          {open && (
            <>
              <SheetHeader>
                <SheetTitle>{open.guest.name}</SheetTitle>
                <SheetDescription>
                  Requested {open.createdAt ? format(parseISO(open.createdAt), 'd MMM yyyy, HH:mm') : ''}
                </SheetDescription>
              </SheetHeader>
              <div className='flex flex-col gap-5 overflow-y-auto px-4 pb-4'>
                <StatusBadge status={open.status} />
                <dl className='grid grid-cols-[110px_1fr] gap-x-4 gap-y-3 text-sm'>
                  <dt className='text-muted-foreground'>Apartment</dt>
                  <dd className='font-medium'>{aptName(open)}</dd>
                  <dt className='text-muted-foreground'>Check-in</dt>
                  <dd>{day(open.checkIn)}</dd>
                  <dt className='text-muted-foreground'>Check-out</dt>
                  <dd>{day(open.checkOut)}</dd>
                  <dt className='text-muted-foreground'>Guests</dt>
                  <dd>{open.guestsCount ?? '—'}</dd>
                  <dt className='text-muted-foreground'>Total</dt>
                  <dd className='font-semibold'>{open.totalAmount != null ? formatMoney(open.totalAmount, open.currency) : '—'}</dd>
                  <dt className='text-muted-foreground'>Email</dt>
                  <dd>
                    {open.guest.email && (
                      <a className='flex items-center gap-1.5 underline-offset-2 hover:underline' href={`mailto:${open.guest.email}`}>
                        <Mail className='size-4' /> {open.guest.email}
                      </a>
                    )}
                  </dd>
                  <dt className='text-muted-foreground'>Phone</dt>
                  <dd>
                    {open.guest.phone && (
                      <a className='flex items-center gap-1.5 underline-offset-2 hover:underline' href={`tel:${open.guest.phone}`}>
                        <Phone className='size-4' /> {open.guest.phone}
                      </a>
                    )}
                  </dd>
                </dl>
                {open.notes && (
                  <div className='rounded-lg border bg-muted/40 p-3 text-sm'>
                    <p className='mb-1 font-medium'>Notes</p>
                    <p className='whitespace-pre-wrap text-muted-foreground'>{open.notes}</p>
                  </div>
                )}
                <div className='flex flex-wrap gap-2'>
                  {open.status !== 'confirmed' && (
                    <Button onClick={() => setReservationStatus(open, 'confirmed')} loading={busy === open.id}>
                      <Check /> Confirm
                    </Button>
                  )}
                  {open.status === 'confirmed' && (
                    <Button variant='secondary' onClick={() => setReservationStatus(open, 'completed')} loading={busy === open.id}>
                      <CheckCheck /> Mark completed
                    </Button>
                  )}
                  {open.status !== 'cancelled' && (
                    <Button variant='outline' onClick={() => setReservationStatus(open, 'cancelled')} loading={busy === open.id}>
                      <X /> Cancel
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
