import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { PageEditor } from '@/components/admin/page-editor';
import { PageHeader } from '@/components/admin/page-header';
import { Button } from '@/components/ui/button';
import { CONTENT_SCHEMA } from '@/content/schema';
import { ContentService } from '@/services/content.service';

export const dynamic = 'force-dynamic';

export default async function EditContentPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const schema = CONTENT_SCHEMA.find((p) => p.key === page);
  if (!schema) notFound();
  const { siteContent } = await ContentService.getFreshContent();

  return (
    <>
      <PageHeader
        title={schema.label}
        description={schema.description}
        actions={
          <Button asChild variant='outline'>
            <Link href={schema.path} target='_blank'>
              <ExternalLink /> View page
            </Link>
          </Button>
        }
      />
      <PageEditor schema={schema} initial={siteContent[schema.key] ?? {}} />
    </>
  );
}
