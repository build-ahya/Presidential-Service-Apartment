import { z } from 'zod';
import { handler } from '@/lib/api';
import { json, parseBody } from '@/lib/http';
import { ReservationService } from '@/services/reservation.service';

const schema = z.object({
  propertyId: z.string().optional(),
  checkIn: z.string().min(1),
  checkOut: z.string().min(1),
});

/** Which apartments are free for the given dates (optionally within one property). */
export const POST = handler(async (request: Request) => {
  const input = await parseBody(request, schema);
  const availableApartmentIds = await ReservationService.availableApartmentIds(input);
  return json({ availableApartmentIds });
});
