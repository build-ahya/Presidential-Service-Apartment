import Image from 'next/image';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BlogService } from '@/services/blog.service';

export const metadata = { title: 'Blog' };
export const dynamic = 'force-dynamic';

export default async function BlogAdminPage() {
  const posts = await BlogService.listAll();
  return (
    <>
      <PageHeader
        title='Blog'
        description='News and stories shown on the website.'
        actions={
          <Button asChild>
            <Link href='/admin/blog/new'>
              <Plus /> New post
            </Link>
          </Button>
        }
      />
      <div className='overflow-x-auto rounded-xl border bg-card'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Post</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className='py-12 text-center text-muted-foreground'>
                  No posts yet.
                </TableCell>
              </TableRow>
            )}
            {posts.map((p) => (
              <TableRow key={p.id} className='relative'>
                <TableCell>
                  <Link href={`/admin/blog/${p.id}`} className='flex items-center gap-3 after:absolute after:inset-0'>
                    <span className='relative size-12 shrink-0 overflow-hidden rounded-md bg-muted'>
                      {p.featuredMedia?.url && <Image src={p.featuredMedia.url} alt='' fill sizes='48px' className='object-cover' />}
                    </span>
                    <span className='font-medium'>{p.title}</span>
                  </Link>
                </TableCell>
                <TableCell className='text-muted-foreground'>{p.category?.name}</TableCell>
                <TableCell>
                  <Badge variant={p.status === 'published' ? 'default' : 'secondary'} className='capitalize'>
                    {p.status}
                  </Badge>
                </TableCell>
                <TableCell className='text-muted-foreground'>
                  {format(parseISO(p.publishedAt || p.createdAt), 'd MMM yyyy')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
