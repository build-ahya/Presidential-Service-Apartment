import { handler, requireStaff } from '@/lib/api';
import { json } from '@/lib/http';
import { ReservationService } from '@/services/reservation.service';
import type { ReservationStatus } from '@/models/reservation';

export const GET = handler(async (request: Request) => {
  await requireStaff();
  const p = new URL(request.url).searchParams;
  return json(
    await ReservationService.list({
      page: Number(p.get('page') || 1),
      limit: Number(p.get('limit') || 20),
      keyword: p.get('keyword') || undefined,
      status: (p.get('status') as ReservationStatus) || undefined,
      apartmentId: p.get('apartmentId') || undefined,
      propertyId: p.get('propertyId') || undefined,
    })
  );
});
