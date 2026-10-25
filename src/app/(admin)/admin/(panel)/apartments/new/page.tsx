import { PageHeader } from '@/components/admin/page-header';
import { ApartmentForm } from '@/components/admin/apartment-form';
import { CatalogService } from '@/services/catalog.service';

export const metadata = { title: 'New apartment' };
export const dynamic = 'force-dynamic';

export default async function NewApartmentPage() {
  const properties = await CatalogService.getProperties({ includeDrafts: true });
  return (
    <>
      <PageHeader title='New apartment' />
      <ApartmentForm properties={properties} />
    </>
  );
}
