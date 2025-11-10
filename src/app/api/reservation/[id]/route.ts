import { NextResponse } from 'next/server';
import { ReservationService } from '@/services/reservation.service';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const item = await ReservationService.getById(id);
    if (!item)
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ reservation: item });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch reservation' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const patch = await req.json();
    const updated = await ReservationService.update(id, patch);
    if (!updated)
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ reservation: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to update reservation' },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const ok = await ReservationService.delete(id);
    return NextResponse.json({ deleted: ok });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to delete reservation' },
      { status: 500 }
    );
  }
}
