import { NextRequest, NextResponse } from 'next/server';
import { Post, PostUpdateInput } from '@/models/post';
import { db, BLOG_COLLECTION } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc, increment } from 'firebase/firestore';

type tParams = { params: Promise<{ id: string }> };

// GET /api/blog/[id] - Get a specific post by ID
export async function GET(request: NextRequest, { params }: tParams) {
  try {
    const { id } = await params;

    const ref = doc(db, BLOG_COLLECTION, id);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Increment view count
    await updateDoc(ref, { 'stats.views': increment(1), updatedAt: new Date().toISOString() });
    const post: Post = { id, ...(snap.data() as any) };

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

// PUT /api/blog/[id] - Update a specific post
export async function PUT(request: NextRequest, { params }: tParams) {
  try {
    const { id } = await params;
    const body: PostUpdateInput = await request.json();

    const ref = doc(db, BLOG_COLLECTION, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const updatedAt = new Date().toISOString();
    await updateDoc(ref, { ...(body as any), updatedAt, version: ((snap.data() as any).version || 1) + 1 });

    const updatedPost: Post = { id, ...(snap.data() as any), ...(body as any), updatedAt };
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

// DELETE /api/blog/[id] - Delete a specific post
export async function DELETE(request: NextRequest, { params }: tParams) {
  try {
    const { id } = await params;

    const ref = doc(db, BLOG_COLLECTION, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    await deleteDoc(ref);

    return NextResponse.json({ message: 'Post deleted successfully', deletedPost: { id } });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
