import { NextRequest, NextResponse } from 'next/server';
import { ApartmentService } from '@/services/apartment.service';

// GET /api/apartment - list apartments
export async function GET() {
  try {
    const apartments = await ApartmentService.getApartments();
    return NextResponse.json({ apartments });
  } catch (error) {
    console.error('Failed to fetch apartments', error);
    return NextResponse.json({ error: 'Failed to fetch apartments' }, { status: 500 });
  }
}

// POST /api/apartment - create apartment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body?.name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Generate slug from name if not provided
    const slug = (body.slug || String(body.name))
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check slug uniqueness
    const existing = await ApartmentService.getApartmentBySlug(slug);
    if (existing) {
      return NextResponse.json(
        { error: 'An apartment with this slug already exists' },
        { status: 409 }
      );
    }

    const now = new Date().toISOString();
    const newApartment = {
      name: body.name,
      slug,
      location: body.location || { address: { city: '', country: '' } },
      summary: body.summary || '',
      description: body.description || '',
      rooms: body.rooms || [],
      amenities: body.amenities || [],
      featuredMedia:
        body.featuredMedia || {
          url: '/images/placeholder.svg',
          type: 'image',
          alt: body.name,
          width: 800,
          height: 600,
        },
      gallery: body.gallery || [],
      rating: body.rating || 0,
      reviewsCount: body.reviewsCount || 0,
      contact: body.contact || {},
      policies: body.policies || {},
      rate: body.rate || {},
      tags: body.tags || [],
      createdAt: now,
      updatedAt: now,
    } as any;

    const saved = await ApartmentService.createApartment(newApartment);
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error('Failed to create apartment', error);
    return NextResponse.json(
      { error: 'Failed to create apartment' },
      { status: 500 }
    );
  }
}