import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { CheckCircle2, TriangleAlert, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { authOptions } from '@/lib/auth';
import { CatalogService } from '@/services/catalog.service';
import { EmailService } from '@/services/mail.service';
import { ContentService } from '@/services/content.service';
import { ReservationService } from '@/services/reservation.service';
import { reservationStatusEmail } from '@/lib/reservation-emails';

export const metadata: Metadata = { title: 'Reservation', robots: { index: false } };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/**
 * Target of the Confirm / Cancel buttons in the new-reservation email.
 * Staff must be signed in; the change is applied on the server.
 */
export default async function ReservationAction({ searchParams }: { searchParams: SearchParams }) {
  const raw = await searchParams;
  const get = (k: string) => (typeof raw[k] === 'string' ? (raw[k] as string) : '');
  const action = get('action');
  const id = get('reservationId') || get('id');

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    const here = `/reservation?${new URLSearchParams({ action, reservationId: id })}`;
    redirect(`/admin/login?callbackUrl=${encodeURIComponent(here)}`);
  }

  let outcome: { ok: boolean; title: string; message: string };
  if ((action !== 'confirmed' && action !== 'cancelled') || !id) {
    outcome = { ok: false, title: 'Invalid link', message: 'This reservation link is missing information.' };
  } else {
    const reservation = await ReservationService.getById(id);
    if (!reservation) {
      outcome = { ok: false, title: 'Not found', message: 'We couldn’t find that reservation.' };
    } else if (reservation.status === action) {
      outcome = { ok: true, title: 'Already done', message: `This reservation is already ${action}.` };
    } else {
      const conflict =
        action === 'confirmed' && reservation.apartmentId
          ? (await ReservationService.checkAvailability({
              apartmentId: reservation.apartmentId,
              checkIn: reservation.checkIn,
              checkOut: reservation.checkOut,
            })).conflicts.some((c) => c.id !== id)
          : false;

      if (conflict) {
        outcome = {
          ok: false,
          title: 'Dates unavailable',
          message: 'Those dates are already confirmed for another guest, so this reservation can’t be confirmed.',
        };
      } else {
        const updated = await ReservationService.update(id, { status: action });
        outcome = {
          ok: true,
          title: action === 'confirmed' ? 'Reservation confirmed' : 'Reservation cancelled',
          message: `${updated?.guest.name ?? 'The guest'} has been notified by email.`,
        };
        try {
          const apartment = updated?.apartmentId ? await CatalogService.getApartmentById(updated.apartmentId) : null;
          if (updated?.guest.email && apartment) {
            const { systemSettings } = await ContentService.getContent();
            await EmailService.sendEmail({
              to: updated.guest.email,
              ...reservationStatusEmail({ siteName: systemSettings.siteName, reservation: updated, apartment, status: action }),
            });
          }
        } catch (error) {
          console.error('Status email failed:', error);
          outcome.message = 'Updated, but the guest email could not be sent.';
        }
      }
    }
  }

  const Icon = outcome.ok ? (action === 'cancelled' ? XCircle : CheckCircle2) : TriangleAlert;
  return (
    <section className='grid min-h-[70vh] place-items-center px-4 pt-28 pb-16'>
      <div className='flex max-w-md flex-col items-center gap-4 text-center'>
        <Icon className={`size-14 ${outcome.ok ? 'text-primary' : 'text-destructive'}`} />
        <h1 className='font-display text-3xl font-semibold text-secondary'>{outcome.title}</h1>
        <p className='text-muted-foreground'>{outcome.message}</p>
        <div className='mt-2 flex gap-3'>
          <Button asChild>
            <Link href='/admin/reservations'>Open reservations</Link>
          </Button>
          <Button asChild variant='outline'>
            <Link href='/'>Go home</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
