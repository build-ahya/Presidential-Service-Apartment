import { NextRequest, NextResponse } from 'next/server';
import { db, BLOG_CATEGORY_COLLECTION } from '@/lib/firebase';
import { collection, getDocs, addDoc, query, where, doc, updateDoc } from 'firebase/firestore';
import { PostCategory } from '@/models/post';

type CategoryCreateInput = {
  name: string;
  slug?: string;
  description?: string;
};

// GET /api/blog/category - Fetch all categories (optional query filter `q` by name)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const qParam = (searchParams.get('q') || '').toLowerCase();

    const colRef = collection(db, BLOG_CATEGORY_COLLECTION);
    const snap = await getDocs(colRef);
    let categories: PostCategory[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));

    if (qParam) {
      categories = categories.filter((c) => c.name?.toLowerCase().includes(qParam));
    }

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Failed to fetch categories', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// POST /api/blog/category - Create a new category
export async function POST(request: NextRequest) {
  try {
    const body: CategoryCreateInput = await request.json();

    if (!body.name || body.name.trim().length === 0) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const slug = (body.slug || body.name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const colRef = collection(db, BLOG_CATEGORY_COLLECTION);

    // Check if slug already exists
    const slugQuery = query(colRef, where('slug', '==', slug));
    const slugSnap = await getDocs(slugQuery);
    if (!slugSnap.empty) {
      return NextResponse.json(
        { error: 'A category with this slug already exists' },
        { status: 409 }
      );
    }

    const newCategory: Omit<PostCategory, 'id'> = {
      name: body.name.trim(),
      slug,
      description: (body.description || '').trim(),
    };

    const created = await addDoc(colRef, newCategory as any);
    // Persist id field for convenience
    await updateDoc(doc(db, BLOG_CATEGORY_COLLECTION, created.id), { id: created.id });

    const saved: PostCategory = { id: created.id, ...(newCategory as any) };
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}