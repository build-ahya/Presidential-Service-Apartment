import { handler, requireStaff } from '@/lib/api';
import { json, parseBody } from '@/lib/http';
import { apartmentSchema } from '@/lib/schemas';
import { CatalogService } from '@/services/catalog.service';

export const GET = handler(async (request: Request) => {
  await requireStaff();
  const propertyId = new URL(request.url).searchParams.get('propertyId') || undefined;
  return json({ apartments: await CatalogService.getApartments({ includeDrafts: true, propertyId }) });
});

export const POST = handler(async (request: Request) => {
  await requireStaff();
  const input = await parseBody(request, apartmentSchema);
  try {
    return json(await CatalogService.createApartment(input), 201);
  } catch (e) {
    return json({ error: (e as Error).message }, 409);
  }
});
