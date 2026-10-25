import { PageHeader } from '@/components/admin/page-header';
import { PostForm } from '@/components/admin/post-form';
import { BlogService } from '@/services/blog.service';

export const metadata = { title: 'New post' };
export const dynamic = 'force-dynamic';

export default async function NewPostPage() {
  return (
    <>
      <PageHeader title='New post' />
      <PostForm categories={await BlogService.categories()} />
    </>
  );
}
