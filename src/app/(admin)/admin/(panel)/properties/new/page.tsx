import { PageHeader } from '@/components/admin/page-header';
import { PropertyForm } from '@/components/admin/property-form';

export const metadata = { title: 'New property' };

export default function NewPropertyPage() {
  return (
    <>
      <PageHeader title='New property' />
      <PropertyForm />
    </>
  );
}
