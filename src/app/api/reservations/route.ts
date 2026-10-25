import { handler } from '@/lib/api';
import { json, parseBody } from '@/lib/http';
import { reservationRequestSchema } from '@/lib/schemas';
import { CatalogService } from '@/services/catalog.service';
import { ContentService } from '@/services/content.service';
import { EmailService } from '@/services/mail.service';
import { ReservationService } from '@/services/reservation.service';
import { adminReservationEmail, guestReservationEmail } from '@/lib/reservation-emails';

/** Public: submit a reservation request for an apartment. */
export const POST = handler(async (request: Request) => {
  const input = await parseBody(request, reservationRequestSchema);

  let reservation;
  try {
    reservation = await ReservationService.create({
      apartmentId: input.apartmentId,
      checkIn: input.checkIn,
      checkOut: input.checkOut,
      guestsCount: input.guestsCount,
      guest: { name: input.name, email: input.email, phone: input.phone },
      notes: input.notes,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not create reservation';
    return json({ error: message }, 400);
  }

  // Emails are best-effort: a mail outage must not lose the reservation.
  const [apartment, { systemSettings }] = await Promise.all([
    CatalogService.getApartmentById(reservation.apartmentId as string),
    ContentService.getContent(),
  ]);
  if (apartment) {
    const baseUrl = (process.env.NEXTAUTH_URL || systemSettings.siteUrl).replace(/\/$/, '');
    const notify =
      process.env.ADMIN_NOTIFY_EMAIL ||
      systemSettings.contact.email ||
      process.env.ADMIN_BOOTSTRAP_EMAIL;

    const sends: Promise<unknown>[] = [];
    if (notify) {
      const mail = adminReservationEmail({
        siteName: systemSettings.siteName,
        baseUrl,
        reservation,
        apartment,
      });
      sends.push(EmailService.sendEmail({ to: notify, ...mail }));
    }
    if (reservation.guest.email) {
      const mail = guestReservationEmail({
        siteName: systemSettings.siteName,
        reservation,
        apartment,
        contactEmail: systemSettings.contact.email,
      });
      sends.push(EmailService.sendEmail({ to: reservation.guest.email, ...mail }));
    }
    const results = await Promise.allSettled(sends);
    results.forEach((r) => r.status === 'rejected' && console.error('Reservation email failed:', r.reason));
  }

  return json({ reservation: { id: reservation.id, status: reservation.status } }, 201);
});
