import { NextRequest, NextResponse } from 'next/server';
import { db, BLOG_COLLECTION } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Post } from '@/models/post';

type tParams = { params: Promise<{ slug: string }> };

// GET /api/blog/slug/[slug]/related - Get related posts by category or tags
export async function GET(request: NextRequest, { params }: tParams) {
  try {
    const { slug } = await params;

    const colRef = collection(db, BLOG_COLLECTION);
    const snap = await getDocs(colRef);
    const allPosts: Post[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));

    const current = allPosts.find((p) => p.slug === slug);
    if (!current) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const related = allPosts
      .filter((p) => p.id !== current.id)
      .filter((p) => {
        const sameCategory = p.category?.id && current.category?.id && p.category.id === current.category.id;
        const tagOverlap = (p.tags || []).some((t) => (current.tags || []).some((ct) => ct.name === t.name));
        return sameCategory || tagOverlap;
      })
      .slice(0, 6);

    return NextResponse.json(related);
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return NextResponse.json({ error: 'Failed to fetch related posts' }, { status: 500 });
  }
}
