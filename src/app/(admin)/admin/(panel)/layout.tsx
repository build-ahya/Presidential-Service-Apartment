import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { AdminShell } from '@/components/admin/shell';
import { authOptions } from '@/lib/auth';
import { ContentService } from '@/services/content.service';

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.role) redirect('/admin/login');
  const { systemSettings } = await ContentService.getContent();

  return (
    <AdminShell
      user={{ name: session.user.name ?? '', email: session.user.email ?? '', role: session.user.role }}
      siteName={systemSettings.siteName}
    >
      {children}
    </AdminShell>
  );
}
