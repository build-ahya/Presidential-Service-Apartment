import { notFound } from 'next/navigation';
import { DeleteButton } from '@/components/admin/delete-button';
import { PageHeader } from '@/components/admin/page-header';
import { PropertyForm } from '@/components/admin/property-form';
import { CatalogService } from '@/services/catalog.service';

export const metadata = { title: 'Edit property' };
export const dynamic = 'force-dynamic';

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const property = await CatalogService.getPropertyById((await params).id);
  if (!property) notFound();

  return (
    <>
      <PageHeader
        title={property.name}
        description='Edit property details.'
        actions={
          <DeleteButton
            url={`/api/admin/properties/${property.id}`}
            redirectTo='/admin/properties'
            title='Delete this property?'
            description='This is only possible when the property has no apartments.'
          />
        }
      />
      <PropertyForm property={property} />
    </>
  );
}
