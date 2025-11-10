import { NextRequest, NextResponse } from 'next/server';
import { Post, PostCreateInput } from '@/models/post';
import { db, BLOG_COLLECTION } from '@/lib/firebase';
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  doc,
  updateDoc,
} from 'firebase/firestore';

// GET /api/blog - Fetch posts with optional filtering and pagination
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page') || 1);
    const limit = Number(searchParams.get('limit') || 9);
    const categoryId = searchParams.get('categoryId');
    const keyword = searchParams.get('q');
    const tags = searchParams.getAll('tags');

    const colRef = collection(db, BLOG_COLLECTION);
    const snap = await getDocs(colRef);
    const allPosts: Post[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));

    // Filter posts based on search parameters (in-memory for now)
    let filteredPosts: Post[] = allPosts;

    if (categoryId) {
      filteredPosts = filteredPosts.filter(
        (post: Post) => post.category?.id === categoryId
      );
    }

    if (keyword) {
      const searchTerm = keyword.toLowerCase();
      filteredPosts = filteredPosts.filter(
        (post: Post) =>
          post.title.toLowerCase().includes(searchTerm) ||
          post.excerpt.toLowerCase().includes(searchTerm) ||
          post.content.toLowerCase().includes(searchTerm)
      );
    }

    if (tags.length > 0) {
      filteredPosts = filteredPosts.filter((post: Post) =>
        tags.some((tag) =>
          post.tags?.some(
            (postTag: any) => postTag.name?.toLowerCase() === tag.toLowerCase()
          )
        )
      );
    }

    // Apply pagination to filtered results
    const start = (page - 1) * limit;
    const result = filteredPosts.slice(start, start + limit);
    return NextResponse.json({
      posts: result,
      pagination: {
        page,
        limit,
        total: filteredPosts.length,
        totalPages: Math.ceil(filteredPosts.length / limit),
      },
      filters: {
        categoryId,
        keyword,
        tags,
      },
    });
  } catch (error) {
    console.error('Failed to fetch posts', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// POST /api/blog - Create a new post
export async function POST(request: NextRequest) {
  try {
    const body: PostCreateInput = await request.json();

    // Validate required fields
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Generate slug from title if not provided
    const slug =
      body.slug ||
      body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    // Check if slug already exists
    const colRef = collection(db, BLOG_COLLECTION);
    const slugQuery = query(colRef, where('slug', '==', slug));
    const slugSnap = await getDocs(slugQuery);
    if (!slugSnap.empty) {
      return NextResponse.json(
        { error: 'A post with this slug already exists' },
        { status: 409 }
      );
    }

    const now = new Date().toISOString();
    const newPostPartial: Omit<Post, 'id'> = {
      title: body.title,
      slug,
      subtitle: body?.subtitle || '',
      content: body.content,
      excerpt: body.excerpt || body.content.substring(0, 200) + '...',
      author: body.author || { id: 'system', name: 'Admin', avatar: '/images/placeholder.svg' },
      category: body.category || { id: 'general', name: 'General', slug: 'general', description: 'General' },
      tags: body.tags || [],
      featuredMedia: body.featuredMedia || {
        url: '/images/placeholder.svg',
        type: 'image',
        alt: 'Post image',
        width: 800,
        height: 600,
      },
      gallery: body?.gallery || [],
      status: body.status || 'draft',
      visibility: body.visibility || 'public',
      password: body?.password || '',
      publishedAt: body.status === 'published' ? now : body?.publishedAt || '',
      scheduledAt: body?.scheduledAt || now,
      createdAt: now,
      updatedAt: now,
      meta: body.meta || {
        title: body.title,
        description: body.excerpt || body.content.substring(0, 160),
        keywords: [],
      },
      stats: {
        views: 0,
        likes: 0,
        shares: 0,
        readingTime: Math.ceil(body.content.split(' ').length / 200),
        commentCount: 0,
      },
      comments: [],
      isFeatured: body.isFeatured || false,
      isPromoted: body.isPromoted || false,
      isPremium: body.isPremium || false,
      allowComments: body.allowComments !== false,
      relatedPosts: body?.relatedPosts || [],
      version: body.version || 1,
      lastModifiedBy: body.lastModifiedBy || 'system',
    };

    const created = await addDoc(colRef, newPostPartial as any);
    // persist id field
    await updateDoc(doc(db, BLOG_COLLECTION, created.id), { id: created.id });
    const saved: Post = { id: created.id, ...(newPostPartial as any) };

    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
