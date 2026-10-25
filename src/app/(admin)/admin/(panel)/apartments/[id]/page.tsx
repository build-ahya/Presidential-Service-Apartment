import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ExternalLink } from 'lucide-react';
import { ApartmentForm } from '@/components/admin/apartment-form';
import { DeleteButton } from '@/components/admin/delete-button';
import { PageHeader } from '@/components/admin/page-header';
import { Button } from '@/components/ui/button';
import { CatalogService } from '@/services/catalog.service';

export const metadata = { title: 'Edit apartment' };
export const dynamic = 'force-dynamic';

export default async function EditApartmentPage({ params }: { params: Promise<{ id: string }> }) {
  const [apartment, properties] = await Promise.all([
    CatalogService.getApartmentById((await params).id),
    CatalogService.getProperties({ includeDrafts: true }),
  ]);
  if (!apartment) notFound();

  return (
    <>
      <PageHeader
        title={apartment.name}
        description='Edit apartment details, rate and photos.'
        actions={
          <>
            {apartment.status === 'published' && (
              <Button asChild variant='outline'>
                <Link href={`/apartments/${apartment.slug}`} target='_blank'>
                  <ExternalLink /> View
                </Link>
              </Button>
            )}
            <DeleteButton
              url={`/api/admin/apartments/${apartment.id}`}
              redirectTo='/admin/apartments'
              title='Delete this apartment?'
              description='Existing reservations are kept but will no longer link to an apartment.'
            />
          </>
        }
      />
      <ApartmentForm apartment={apartment} properties={properties} />
    </>
  );
}
