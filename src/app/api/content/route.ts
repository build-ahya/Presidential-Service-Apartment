import fallbackContent from '@/mock-data/content';
import { ContentService } from '@/services/content.service';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { id, ...payload } = await request.json();
    await ContentService.createContent(payload, id);
    return NextResponse.json(
      { message: 'Content created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/content:', error);
    return NextResponse.json(
      { error: 'Failed to create content' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Try to get content from ContentService first
    try {
      const content = await ContentService.getContent();
      return NextResponse.json(content);
    } catch (serviceError) {
      // If service fails, fall back to static content
      console.warn(
        'ContentService failed, using static content:',
        serviceError
      );
    }

    // Static fallback content
    const demoContent = fallbackContent;

    return NextResponse.json(demoContent);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    await ContentService.updateSiteContent(body);
    return NextResponse.json({ message: 'Content updated successfully' });
  } catch (error) {
    console.error('Error in PUT /api/content:', error);
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    );
  }
}
