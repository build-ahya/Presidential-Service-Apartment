import type { Metadata } from 'next';
import { LegalPage } from '@/components/shared/legal-page';
import { ContentService } from '@/services/content.service';

export const metadata: Metadata = { title: 'Terms of Service' };

export default async function Page() {
  const { siteContent } = await ContentService.getContent();
  return <LegalPage section={siteContent.terms.main} />;
}
