import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { PageHeader } from '@/components/admin/page-header';
import { UsersManager } from '@/components/admin/users-manager';
import { authOptions } from '@/lib/auth';
import { UserService } from '@/services/user.service';

export const metadata = { title: 'Team' };
export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== 'admin') redirect('/admin');
  return (
    <>
      <PageHeader title='Team' description='People who can sign in to this dashboard.' />
      <UsersManager users={await UserService.list()} currentEmail={session.user.id} />
    </>
  );
}
