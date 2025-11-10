import { NextRequest, NextResponse } from 'next/server';
import { ApartmentService } from '@/services/apartment.service';

// GET /api/apartment/slug/[slug] - fetch by slug
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const apt = await ApartmentService.getApartmentBySlug(slug);
    if (!apt) {
      return NextResponse.json({ error: 'Apartment not found' }, { status: 404 });
    }
    return NextResponse.json(apt);
  } catch (error) {
    console.error('Failed to fetch apartment by slug', error);
    return NextResponse.json({ error: 'Failed to fetch apartment' }, { status: 500 });
  }
}