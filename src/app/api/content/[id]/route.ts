import { ContentService } from '@/services/content.service';
import { NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Update specific content item by ID
    await ContentService.updateContent(id, body);

    return NextResponse.json(
      { message: 'Content updated successfully', id },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error in PUT /api/content/[id]:`, error);
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Get specific content item by ID
    const content = await ContentService.getContentById(id);

    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error(`Error in GET /api/content/[id]:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Delete specific content item by ID
    await ContentService.deleteContent(id);

    return NextResponse.json(
      { message: 'Content deleted successfully', id },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error in DELETE /api/content/[id]:`, error);
    return NextResponse.json(
      { error: 'Failed to delete content' },
      { status: 500 }
    );
  }
}
