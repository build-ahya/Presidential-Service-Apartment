import Image from 'next/image';
import Link from 'next/link';
import { Bath, BedDouble, Plus, Users } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatMoney } from '@/lib/booking';
import { CatalogService } from '@/services/catalog.service';

export const metadata = { title: 'Apartments' };
export const dynamic = 'force-dynamic';

export default async function ApartmentsAdminPage() {
  const [apartments, properties] = await Promise.all([
    CatalogService.getApartments({ includeDrafts: true }),
    CatalogService.getProperties({ includeDrafts: true }),
  ]);

  return (
    <>
      <PageHeader
        title='Apartments'
        description='Bookable units, their rates and photos.'
        actions={
          <Button asChild disabled={properties.length === 0}>
            <Link href='/admin/apartments/new'>
              <Plus /> New apartment
            </Link>
          </Button>
        }
      />
      <div className='overflow-x-auto rounded-xl border bg-card'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Apartment</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Layout</TableHead>
              <TableHead className='text-right'>Rate / night</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apartments.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className='py-12 text-center text-muted-foreground'>
                  No apartments yet.
                </TableCell>
              </TableRow>
            )}
            {apartments.map((a) => (
              <TableRow key={a.id} className='relative'>
                <TableCell>
                  <Link href={`/admin/apartments/${a.id}`} className='flex items-center gap-3 after:absolute after:inset-0'>
                    <span className='relative size-12 shrink-0 overflow-hidden rounded-md bg-muted'>
                      {a.featuredMedia?.url && <Image src={a.featuredMedia.url} alt='' fill sizes='48px' className='object-cover' />}
                    </span>
                    <span className='font-medium'>{a.name}</span>
                  </Link>
                </TableCell>
                <TableCell className='text-muted-foreground'>{properties.find((p) => p.id === a.propertyId)?.name ?? '—'}</TableCell>
                <TableCell>
                  <span className='flex items-center gap-3 text-sm text-muted-foreground'>
                    <span className='flex items-center gap-1'><BedDouble className='size-4' />{a.bedrooms}</span>
                    <span className='flex items-center gap-1'><Bath className='size-4' />{a.bathrooms}</span>
                    <span className='flex items-center gap-1'><Users className='size-4' />{a.maxGuests}</span>
                  </span>
                </TableCell>
                <TableCell className='text-right font-medium tabular-nums'>{formatMoney(a.rate.baseRate, a.rate.currency)}</TableCell>
                <TableCell>
                  <Badge variant={a.status === 'published' ? 'default' : 'secondary'}>{a.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
