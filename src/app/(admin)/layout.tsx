import AdminLayout from '@/components/layouts/admin-layout';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
