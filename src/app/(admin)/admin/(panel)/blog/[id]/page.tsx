import { notFound } from 'next/navigation';
import { DeleteButton } from '@/components/admin/delete-button';
import { PageHeader } from '@/components/admin/page-header';
import { PostForm } from '@/components/admin/post-form';
import { BlogService } from '@/services/blog.service';

export const metadata = { title: 'Edit post' };
export const dynamic = 'force-dynamic';

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const [post, categories] = await Promise.all([BlogService.getById((await params).id), BlogService.categories()]);
  if (!post) notFound();
  return (
    <>
      <PageHeader
        title={post.title}
        actions={
          <DeleteButton url={`/api/admin/blog/${post.id}`} redirectTo='/admin/blog' title='Delete this post?' description='This cannot be undone.' />
        }
      />
      <PostForm post={post} categories={categories} />
    </>
  );
}
