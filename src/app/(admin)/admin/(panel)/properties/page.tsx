import Image from 'next/image';
import Link from 'next/link';
import { Building2, MapPin, Plus } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CatalogService } from '@/services/catalog.service';

export const metadata = { title: 'Properties' };
export const dynamic = 'force-dynamic';

export default async function PropertiesPage() {
  const [properties, apartments] = await Promise.all([
    CatalogService.getProperties({ includeDrafts: true }),
    CatalogService.getApartments({ includeDrafts: true }),
  ]);

  return (
    <>
      <PageHeader
        title='Properties'
        description='Buildings or locations. Each property contains one or more apartments.'
        actions={
          <Button asChild>
            <Link href='/admin/properties/new'>
              <Plus /> New property
            </Link>
          </Button>
        }
      />
      {properties.length === 0 ? (
        <p className='rounded-xl border border-dashed py-16 text-center text-muted-foreground'>No properties yet.</p>
      ) : (
        <div className='grid gap-5 md:grid-cols-2 xl:grid-cols-3'>
          {properties.map((p) => {
            const count = apartments.filter((a) => a.propertyId === p.id).length;
            return (
              <Link
                key={p.id}
                href={`/admin/properties/${p.id}`}
                className='group overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md'
              >
                <div className='relative aspect-[16/9] bg-muted'>
                  {p.featuredMedia?.url ? (
                    <Image src={p.featuredMedia.url} alt='' fill sizes='400px' className='object-cover' />
                  ) : (
                    <Building2 className='absolute inset-0 m-auto size-10 text-muted-foreground' />
                  )}
                </div>
                <div className='flex flex-col gap-2 p-4'>
                  <div className='flex items-start justify-between gap-2'>
                    <h2 className='font-semibold group-hover:underline'>{p.name}</h2>
                    <Badge variant={p.status === 'published' ? 'default' : 'secondary'}>{p.status}</Badge>
                  </div>
                  <p className='flex items-center gap-1.5 text-sm text-muted-foreground'>
                    <MapPin className='size-4' /> {[p.location.address.city, p.location.address.state].filter(Boolean).join(', ')}
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    {count} apartment{count === 1 ? '' : 's'}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
