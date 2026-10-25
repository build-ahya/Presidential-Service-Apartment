import { PageHeader } from '@/components/admin/page-header';
import { SettingsForm } from '@/components/admin/settings-form';
import { ContentService } from '@/services/content.service';

export const metadata = { title: 'Settings' };
export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const { systemSettings } = await ContentService.getFreshContent();
  return (
    <>
      <PageHeader title='Settings' description='Site identity, contact details, navigation and SEO.' />
      <SettingsForm initial={systemSettings} />
    </>
  );
}
