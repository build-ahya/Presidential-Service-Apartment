import { handler, requireStaff } from '@/lib/api';
import { json, parseBody } from '@/lib/http';
import { apartmentSchema } from '@/lib/schemas';
import { CatalogService } from '@/services/catalog.service';

type Ctx = { params: Promise<{ id: string }> };

export const GET = handler(async (_req: Request, { params }: Ctx) => {
  await requireStaff();
  const apartment = await CatalogService.getApartmentById((await params).id);
  return apartment ? json(apartment) : json({ error: 'Apartment not found' }, 404);
});

export const PUT = handler(async (request: Request, { params }: Ctx) => {
  await requireStaff();
  const input = await parseBody(request, apartmentSchema);
  try {
    const apartment = await CatalogService.updateApartment((await params).id, input);
    return apartment ? json(apartment) : json({ error: 'Apartment not found' }, 404);
  } catch (e) {
    return json({ error: (e as Error).message }, 409);
  }
});

export const DELETE = handler(async (_req: Request, { params }: Ctx) => {
  await requireStaff(['admin']);
  await CatalogService.deleteApartment((await params).id);
  return json({ deleted: true });
});
