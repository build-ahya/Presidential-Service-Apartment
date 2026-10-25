'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, Loader2, ShieldCheck, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DateRangeField, GuestsField } from '@/components/search/fields';
import {
  formatDay,
  formatMoney,
  nightsBetween,
  parseSearch,
  priceFor,
  searchToQuery,
  type SearchState,
} from '@/lib/booking';
import type { Apartment } from '@/models/apartment';
import ReservationForm from './reservation-form';

type Availability = 'idle' | 'checking' | 'available' | 'unavailable' | 'error';

/** Sticky price + dates panel on the apartment page. Keeps the search in the URL. */
export function BookingCard({ apartment }: { apartment: Apartment }) {
  const router = useRouter();
  const params = useSearchParams();
  const [state, setState] = useState<SearchState>(() => parseSearch(params));
  const [availability, setAvailability] = useState<Availability>('idle');
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);

  const nights = nightsBetween(state.checkIn, state.checkOut);
  const price = priceFor(apartment, nights);
  const guests = state.adults + state.children;
  const { currency } = apartment.rate;

  const update = (patch: Partial<SearchState>) => {
    const next = { ...state, ...patch };
    setState(next);
    router.replace(`?${searchToQuery(next)}`, { scroll: false });
  };

  useEffect(() => {
    if (!state.checkIn || !state.checkOut) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAvailability('idle');
      return;
    }
    const controller = new AbortController();
    setAvailability('checking');
    fetch('/api/availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        propertyId: apartment.propertyId,
        checkIn: state.checkIn,
        checkOut: state.checkOut,
      }),
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((data: { availableApartmentIds?: string[] }) =>
        setAvailability(data.availableApartmentIds?.includes(apartment.id) ? 'available' : 'unavailable')
      )
      .catch((e) => e.name !== 'AbortError' && setAvailability('error'));
    return () => controller.abort();
  }, [state.checkIn, state.checkOut, apartment.id, apartment.propertyId]);

  const tooMany = guests > apartment.maxGuests;
  const canReserve = availability === 'available' && nights > 0 && !tooMany;

  return (
    <>
      <div
        id='booking'
        className='scroll-mt-28 overflow-hidden rounded-2xl border bg-card shadow-lg lg:sticky lg:top-24'
      >
        <div className='border-b bg-secondary p-5 text-secondary-foreground'>
          <p className='text-sm text-white/70'>From</p>
          <p className='text-3xl font-bold'>
            {formatMoney(apartment.rate.baseRate, currency)}
            <span className='text-base font-normal text-white/70'> / night</span>
          </p>
        </div>

        <div className='flex flex-col gap-4 p-5'>
          <div className='divide-y overflow-hidden rounded-xl border-2 border-primary'>
            <DateRangeField checkIn={state.checkIn} checkOut={state.checkOut} onChange={update} align='center' />
            <GuestsField
              adults={state.adults}
              kids={state.children}
              maxGuests={apartment.maxGuests}
              onChange={update}
              align='center'
            />
          </div>

          {tooMany && (
            <p className='flex items-center gap-2 text-sm text-destructive'>
              <TriangleAlert className='size-4' /> Sleeps up to {apartment.maxGuests} guests.
            </p>
          )}

          {availability === 'checking' && (
            <p className='flex items-center gap-2 text-sm text-muted-foreground'>
              <Loader2 className='size-4 animate-spin' /> Checking availability…
            </p>
          )}
          {availability === 'available' && !tooMany && (
            <p className='flex items-center gap-2 text-sm font-medium text-emerald-700'>
              <CheckCircle2 className='size-4' /> Available for your dates
            </p>
          )}
          {availability === 'unavailable' && (
            <p className='flex items-center gap-2 text-sm font-medium text-destructive'>
              <TriangleAlert className='size-4' /> Not available for these dates. Try different dates.
            </p>
          )}
          {availability === 'error' && (
            <p className='text-sm text-destructive'>Couldn’t check availability. Please try again.</p>
          )}

          {nights > 0 && (
            <dl className='flex flex-col gap-2 border-t pt-4 text-sm'>
              <div className='flex justify-between'>
                <dt className='text-muted-foreground'>
                  {formatMoney(price.baseRate, currency)} × {nights} night{nights === 1 ? '' : 's'}
                </dt>
                <dd>{formatMoney(price.subtotal, currency)}</dd>
              </div>
              {price.cleaningFee > 0 && (
                <div className='flex justify-between'>
                  <dt className='text-muted-foreground'>Cleaning fee</dt>
                  <dd>{formatMoney(price.cleaningFee, currency)}</dd>
                </div>
              )}
              <div className='flex justify-between border-t pt-3 text-base font-bold'>
                <dt>Total</dt>
                <dd>{formatMoney(price.total, currency)}</dd>
              </div>
              {apartment.rate.securityDeposit ? (
                <p className='text-xs text-muted-foreground'>
                  Refundable security deposit of {formatMoney(apartment.rate.securityDeposit, currency)} applies.
                </p>
              ) : null}
            </dl>
          )}

          <Button
            size='lg'
            className='h-12 w-full text-base font-semibold'
            disabled={!canReserve}
            onClick={() => {
              setSent(false);
              setOpen(true);
            }}
          >
            {nights === 0 ? 'Select dates to reserve' : 'Reserve'}
          </Button>
          <p className='flex items-center justify-center gap-1.5 text-xs text-muted-foreground'>
            <ShieldCheck className='size-3.5' /> You won’t be charged yet. We’ll confirm with you first.
          </p>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='max-h-[92vh] overflow-y-auto sm:max-w-lg'>
          {sent ? (
            <div className='flex flex-col items-center gap-4 py-6 text-center'>
              <span className='grid size-14 place-items-center rounded-full bg-emerald-100 text-emerald-700'>
                <CheckCircle2 className='size-8' />
              </span>
              <DialogTitle className='font-display text-2xl'>Request received</DialogTitle>
              <DialogDescription>
                Thank you! We’ve emailed you a summary and our team will confirm your stay at{' '}
                {apartment.name} shortly.
              </DialogDescription>
              <Button onClick={() => setOpen(false)}>Close</Button>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className='font-display text-2xl'>Complete your reservation</DialogTitle>
                <DialogDescription>
                  {apartment.name} · {formatDay(state.checkIn, 'd MMM')} – {formatDay(state.checkOut, 'd MMM yyyy')} ·{' '}
                  {nights} night{nights === 1 ? '' : 's'} · {formatMoney(price.total, currency)}
                </DialogDescription>
              </DialogHeader>
              <ReservationForm
                apartmentId={apartment.id}
                checkIn={state.checkIn as string}
                checkOut={state.checkOut as string}
                guestsCount={guests}
                onSuccess={() => setSent(true)}
                onCancel={() => setOpen(false)}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

/** Fixed bar on small screens that jumps to the booking panel. */
export function MobileBookBar({ apartment }: { apartment: Apartment }) {
  return (
    <div className='fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 border-t bg-background/95 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur lg:hidden'>
      <div>
        <p className='text-xs text-muted-foreground'>From</p>
        <p className='text-lg font-bold'>
          {formatMoney(apartment.rate.baseRate, apartment.rate.currency)}
          <span className='text-xs font-normal text-muted-foreground'> / night</span>
        </p>
      </div>
      <Button asChild size='lg'>
        <a href='#booking'>Check availability</a>
      </Button>
    </div>
  );
}
