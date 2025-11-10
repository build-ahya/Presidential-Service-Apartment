import { NextResponse } from 'next/server';
import { ReservationService } from '@/services/reservation.service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { apartmentId, roomId, checkIn, checkOut } = body || {};
    if (!checkIn || !checkOut) {
      return NextResponse.json({ error: 'checkIn and checkOut are required' }, { status: 400 });
    }
    const result = await ReservationService.checkAvailability({ apartmentId, roomId, checkIn, checkOut });
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to check availability' }, { status: 500 });
  }
}