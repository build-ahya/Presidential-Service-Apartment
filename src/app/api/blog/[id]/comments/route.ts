import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, addDoc, orderBy, query, doc, updateDoc, increment } from 'firebase/firestore';
import { db, BLOG_COLLECTION } from '@/lib/firebase';
import { PostComment, PostCommentCreateInput } from '@/models/post';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/services/auth.service';

type tParams = { params: Promise<{ id: string }> };

// GET /api/blog/[id]/comments - Fetch comments for a post
export async function GET(request: NextRequest, { params }: tParams) {
  try {
    const { id } = await params;
    const commentsRef = collection(db, `${BLOG_COLLECTION}/${id}/comments`);
    const q = query(commentsRef, orderBy('createdAt', 'asc'));
    const snap = await getDocs(q);

    const comments: PostComment[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

// POST /api/blog/[id]/comments - Add a comment to a post (requires auth)
export async function POST(request: NextRequest, { params }: tParams) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: PostCommentCreateInput = await request.json();
    if (!body.content || body.content.trim().length === 0) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const commentsRef = collection(db, `${BLOG_COLLECTION}/${id}/comments`);

    const newComment: Omit<PostComment, 'id'> = {
      content: body.content.trim(),
      author: {
        id: session.user.id,
        name: session.user.name || 'User',
        avatar: session.user.image || '/images/default-avatar.jpg',
      },
      createdAt: now,
      updatedAt: now,
      likes: 0,
      parentId: body?.parentId || '',
      isEdited: false,
    };    

    const created = await addDoc(commentsRef, newComment as any);

    // Increment post commentCount
    await updateDoc(doc(db, BLOG_COLLECTION, id), { 'stats.commentCount': increment(1), updatedAt: now });

    const saved: PostComment = { id: created.id, ...(newComment as any) };
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}