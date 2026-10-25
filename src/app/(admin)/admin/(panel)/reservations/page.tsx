import { getServerSession } from 'next-auth';
import { PageHeader } from '@/components/admin/page-header';
import { ReservationsTable } from '@/components/admin/reservations-table';
import { authOptions } from '@/lib/auth';
import { CatalogService } from '@/services/catalog.service';
import { ReservationService } from '@/services/reservation.service';

export const metadata = { title: 'Reservations' };
export const dynamic = 'force-dynamic';

export default async function ReservationsPage() {
  const [session, { reservations }, apartments] = await Promise.all([
    getServerSession(authOptions),
    ReservationService.list({ limit: 1000 }),
    CatalogService.getApartments({ includeDrafts: true }),
  ]);

  return (
    <>
      <PageHeader
        title='Reservations'
        description='Confirming a stay blocks those dates on the website and emails the guest.'
      />
      <ReservationsTable
        reservations={reservations}
        apartmentNames={Object.fromEntries(apartments.map((a) => [a.id, a.name]))}
        canDelete={session?.user.role === 'admin'}
      />
    </>
  );
}
