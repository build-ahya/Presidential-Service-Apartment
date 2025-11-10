'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import type { Apartment } from '@/models/apartment';
import { MapPin, CalendarDays, Users } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ReservationForm from '@/components/forms/reservation-form';
import { toast } from 'sonner';

type Props = {
  apartments?: Apartment[];
  showApartmentSelect?: boolean;
  className?: string;
  layout?: 'auto' | 'horizontal' | 'vertical';
};

export function CheckAvailabilityForm({ apartments = [], showApartmentSelect = true, className, layout = 'auto' }: Props) {
  const [apartmentId, setApartmentId] = useState<string>(
    apartments[0]?.id || ''
  );
  const [checkIn, setCheckIn] = useState<string>('');
  const [checkOut, setCheckOut] = useState<string>('');
  const [guests, setGuests] = useState<number>(1);
  const [status, setStatus] = useState<{
    available: boolean;
    message: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [openReservation, setOpenReservation] = useState(false);
  const [preCheckedAvailable, setPreCheckedAvailable] = useState<boolean | null>(null);

  const aptOptions = useMemo(() => apartments.map((a) => ({ id: a.id, name: a.name })), [apartments]);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const isApartmentsList = pathname === '/apartments';
  const isApartmentDetails = pathname?.startsWith('/apartments/') && pathname !== '/apartments';
  const isOutsideApartments = !pathname?.startsWith('/apartments');

  useEffect(() => {
    const q = searchParams.get('q');
    if (!q) return;
    try {
      const data = JSON.parse(decodeURIComponent(q));
      if (data?.apartmentId) setApartmentId(String(data.apartmentId));
      if (data?.checkIn) setCheckIn(String(data.checkIn));
      if (data?.checkOut) setCheckOut(String(data.checkOut));
      if (data?.guests) setGuests(Number(data.guests));
      if (isApartmentDetails && (data?.checkIn && data?.checkOut)) {
        (async () => {
          try {
            const res = await fetch('/api/reservation/check', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                apartmentId: apartments[0]?.id || data?.apartmentId,
                checkIn: String(data.checkIn),
                checkOut: String(data.checkOut),
              }),
            });
            const json = await res.json();
            setPreCheckedAvailable(!!json?.available);
          } catch {
            setPreCheckedAvailable(null);
          }
        })();
      }
    } catch {
      // ignore invalid q
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, isApartmentDetails]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    try {
      const qData = {
        apartmentId: apartmentId || undefined,
        checkIn,
        checkOut,
        guests,
      };
      const qStr = encodeURIComponent(JSON.stringify(qData));

      if (isOutsideApartments) {
        router.push(`/apartments?q=${qStr}`);
        return;
      }

      const res = await fetch(`/api/reservation/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(qData),
      });
      const json = await res.json();
      const ok = res.ok && !!json;
      const available = ok ? !!json.available : false;
      setStatus({
        available,
        message: ok
          ? (available ? 'Available for selected dates' : 'Not available for selected dates')
          : (json?.error || 'Failed to check availability'),
      });

      if (isApartmentDetails && available) {
        setOpenReservation(true);
      }
    } catch (err: any) {
      setStatus({ available: false, message: err?.message || 'Network error' });
    } finally {
      setSubmitting(false);
    }
  }

  const containerLayoutClasses =
    layout === 'vertical'
      ? 'flex flex-col items-stretch'
      : layout === 'horizontal'
      ? 'flex flex-row items-center flex-nowrap'
      : 'flex flex-col md:flex-row md:flex-nowrap items-stretch md:items-center';

  const itemBasisClass =
    layout === 'vertical'
      ? 'w-full'
      : layout === 'horizontal'
      ? 'flex-[1_1_180px]'
      : 'w-full md:flex-[1_1_180px]';
  const guestsBasisClass =
    layout === 'vertical'
      ? 'w-full'
      : layout === 'horizontal'
      ? 'flex-[1_1_160px]'
      : 'w-full md:flex-[1_1_160px]';
  const separatorClasses =
    layout === 'vertical' ? 'hidden' : layout === 'horizontal' ? 'block' : 'hidden md:block';

  return (
    <div className={cn('w-full max-w-5xl bg-white rounded-2xl md:rounded-full shadow-2xl px-4 py-3 md:px-6 md:py-4', className || '')}>
      <form onSubmit={onSubmit} className={`${containerLayoutClasses} gap-2 md:gap-4`}>
        {showApartmentSelect && aptOptions.length > 0 && (
          <div className={`flex items-center gap-2 ${itemBasisClass}`}>
            <MapPin className='h-5 w-5 text-gray-600' />
            <Select value={apartmentId} onValueChange={setApartmentId}>
              <SelectTrigger className='border-0 shadow-none focus:ring-0 bg-transparent text-sm h-9 px-0'>
                <SelectValue placeholder='Apartment' />
              </SelectTrigger>
              <SelectContent>
                {aptOptions.map((opt) => (
                  <SelectItem key={opt.id} value={opt.id}>
                    {opt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {showApartmentSelect && aptOptions.length > 0 && (
          <div className={`h-8 w-px bg-gray-200 ${separatorClasses}`} />
        )}

        <div className={`flex items-center gap-2 ${itemBasisClass}`}>
          <CalendarDays className='h-5 w-5 text-gray-600' />
          <input
            type='date'
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className='border-0 shadow-none focus:ring-0 bg-transparent text-sm h-9 px-0'
            required
          />
        </div>

        <div className={`h-8 w-px bg-gray-200 ${separatorClasses}`} />

        <div className={`flex items-center gap-2 ${itemBasisClass}`}>
          <CalendarDays className='h-5 w-5 text-gray-600' />
          <input
            type='date'
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className='border-0 shadow-none focus:ring-0 bg-transparent text-sm h-9 px-0'
            required
          />
        </div>

        <div className={`h-8 w-px bg-gray-200 ${separatorClasses}`} />

        <div className={`flex items-center gap-2 ${guestsBasisClass}`}>
          <Users className='h-5 w-5 text-gray-600' />
          <Select value={String(guests)} onValueChange={(v) => setGuests(Number(v))}>
            <SelectTrigger className='border-0 shadow-none focus:ring-0 bg-transparent text-sm h-9 px-0'>
              <SelectValue placeholder='Guests' />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 6 }, (_, i) => i + 1).map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n} {n === 1 ? 'Guest' : 'Guests'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button size='lg' type='submit' disabled={submitting}>
          {submitting
            ? 'Checking...'
            : (isApartmentDetails && ((preCheckedAvailable && (checkIn && checkOut)) || status?.available)
                ? 'Book Now'
                : (isOutsideApartments ? 'Search Apartments' : 'Check Availability'))}
        </Button>
      </form>

      {status && (
        <div className='mt-2 text-sm'>
          <span className={status.available ? 'text-green-600' : 'text-red-600'}>{status.message}</span>
        </div>
      )}

      {isApartmentDetails && (
        <Dialog open={openReservation} onOpenChange={setOpenReservation}>
          <DialogContent className='sm:max-w-lg'>
            <DialogHeader>
              <DialogTitle>Complete Reservation</DialogTitle>
            </DialogHeader>
            <ReservationForm
              initial={{
                apartmentId: apartmentId || apartments[0]?.id || '',
                checkIn,
                checkOut,
                guestsCount: guests,
              }}
              onSuccess={() => {
                toast.success('Reservation submitted successfully');
                setOpenReservation(false);
              }}
              onCancel={() => setOpenReservation(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
