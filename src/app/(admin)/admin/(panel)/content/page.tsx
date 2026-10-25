import Link from 'next/link';
import { ExternalLink, FileText, Pencil } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { Button } from '@/components/ui/button';
import { CONTENT_SCHEMA } from '@/content/schema';

export const metadata = { title: 'Pages & content' };

export default function ContentIndex() {
  return (
    <>
      <PageHeader
        title='Pages & content'
        description='Edit the words, images and calls to action on each page. Changes go live as soon as you save.'
      />
      <div className='grid gap-4 md:grid-cols-2'>
        {CONTENT_SCHEMA.map((page) => (
          <div key={page.key} className='flex flex-col gap-4 rounded-xl border bg-card p-5'>
            <div className='flex items-start gap-3'>
              <span className='grid size-10 shrink-0 place-items-center rounded-lg bg-primary/15 text-secondary dark:text-primary'>
                <FileText className='size-5' />
              </span>
              <div>
                <h2 className='font-semibold'>{page.label}</h2>
                <p className='text-sm text-muted-foreground'>{page.description}</p>
                <p className='mt-1 text-xs text-muted-foreground'>{page.sections.length} section{page.sections.length === 1 ? '' : 's'}</p>
              </div>
            </div>
            <div className='mt-auto flex gap-2'>
              <Button asChild size='sm'>
                <Link href={`/admin/content/${page.key}`}>
                  <Pencil /> Edit
                </Link>
              </Button>
              <Button asChild size='sm' variant='outline'>
                <Link href={page.path} target='_blank'>
                  <ExternalLink /> View
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
