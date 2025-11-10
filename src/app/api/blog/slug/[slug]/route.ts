import { NextRequest, NextResponse } from 'next/server';
import { Post } from '@/models/post';
import { db, BLOG_COLLECTION } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc, increment } from 'firebase/firestore';

type tParams = { params: Promise<{ slug: string }> };

// GET /api/blog/slug/[slug] - Get a specific post by slug
export async function GET(
  request: NextRequest,
  { params }: tParams
) {
  try {
    const { slug } = await params;

    const colRef = collection(db, BLOG_COLLECTION);
    const q = query(colRef, where('slug', '==', slug));
    const snap = await getDocs(q);
    if (snap.empty) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const d = snap.docs[0];
    const post: Post = { id: d.id, ...(d.data() as any) };

    // Only return published posts for public access
    if (post.status !== 'published' && post.visibility !== 'public') {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Increment view count
    await updateDoc(doc(db, BLOG_COLLECTION, d.id), { 'stats.views': increment(1), updatedAt: new Date().toISOString() });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}