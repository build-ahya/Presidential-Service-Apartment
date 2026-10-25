import { handler, requireStaff } from '@/lib/api';
import { json, parseBody } from '@/lib/http';
import { reservationPatchSchema } from '@/lib/schemas';
import { CatalogService } from '@/services/catalog.service';
import { ContentService } from '@/services/content.service';
import { EmailService } from '@/services/mail.service';
import { ReservationService } from '@/services/reservation.service';
import { reservationStatusEmail } from '@/lib/reservation-emails';

type Ctx = { params: Promise<{ id: string }> };

export const GET = handler(async (_req: Request, { params }: Ctx) => {
  await requireStaff();
  const item = await ReservationService.getById((await params).id);
  return item ? json({ reservation: item }) : json({ error: 'Reservation not found' }, 404);
});

export const PUT = handler(async (request: Request, { params }: Ctx) => {
  await requireStaff();
  const { id } = await params;
  const patch = await parseBody(request, reservationPatchSchema);

  const before = await ReservationService.getById(id);
  if (!before) return json({ error: 'Reservation not found' }, 404);

  // Never confirm over an already-confirmed overlapping stay.
  if (patch.status === 'confirmed' && before.status !== 'confirmed' && before.apartmentId) {
    const { conflicts } = await ReservationService.checkAvailability({
      apartmentId: before.apartmentId,
      checkIn: patch.checkIn ?? before.checkIn,
      checkOut: patch.checkOut ?? before.checkOut,
    });
    if (conflicts.some((c) => c.id !== id)) {
      return json({ error: 'Those dates are already confirmed for another guest' }, 409);
    }
  }

  const updated = await ReservationService.update(id, patch);

  const statusChanged = patch.status && patch.status !== before.status;
  if (
    updated &&
    statusChanged &&
    (patch.status === 'confirmed' || patch.status === 'cancelled') &&
    updated.guest.email &&
    updated.apartmentId
  ) {
    try {
      const [apartment, { systemSettings }] = await Promise.all([
        CatalogService.getApartmentById(updated.apartmentId),
        ContentService.getContent(),
      ]);
      if (apartment) {
        const mail = reservationStatusEmail({
          siteName: systemSettings.siteName,
          reservation: updated,
          apartment,
          status: patch.status,
        });
        await EmailService.sendEmail({ to: updated.guest.email, ...mail });
      }
    } catch (error) {
      console.error('Status email failed:', error);
    }
  }
  return json({ reservation: updated });
});

export const DELETE = handler(async (_req: Request, { params }: Ctx) => {
  await requireStaff(['admin']);
  await ReservationService.delete((await params).id);
  return json({ deleted: true });
});
