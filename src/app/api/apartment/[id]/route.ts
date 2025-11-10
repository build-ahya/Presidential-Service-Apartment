import { NextRequest, NextResponse } from 'next/server';
import { ApartmentService } from '@/services/apartment.service';

// GET /api/apartment/[id] - fetch by id
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const apt = await ApartmentService.getApartmentById(id);
    if (!apt) {
      return NextResponse.json({ error: 'Apartment not found' }, { status: 404 });
    }
    return NextResponse.json(apt);
  } catch (error) {
    console.error('Failed to fetch apartment by id', error);
    return NextResponse.json({ error: 'Failed to fetch apartment' }, { status: 500 });
  }
}

// PUT /api/apartment/[id] - update
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const payload = await request.json();
    await ApartmentService.updateApartment(id, payload);
    return NextResponse.json({ message: 'Apartment updated successfully' });
  } catch (error) {
    console.error('Failed to update apartment', error);
    return NextResponse.json({ error: 'Failed to update apartment' }, { status: 500 });
  }
}

// DELETE /api/apartment/[id] - delete
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await ApartmentService.deleteApartment(id);
    return NextResponse.json({ message: 'Apartment deleted successfully' });
  } catch (error) {
    console.error('Failed to delete apartment', error);
    return NextResponse.json({ error: 'Failed to delete apartment' }, { status: 500 });
  }
}