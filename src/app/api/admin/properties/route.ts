import { handler, requireStaff } from '@/lib/api';
import { json, parseBody } from '@/lib/http';
import { propertySchema } from '@/lib/schemas';
import { CatalogService } from '@/services/catalog.service';

export const GET = handler(async () => {
  await requireStaff();
  return json({ properties: await CatalogService.getProperties({ includeDrafts: true }) });
});

export const POST = handler(async (request: Request) => {
  await requireStaff();
  const input = await parseBody(request, propertySchema);
  try {
    return json(await CatalogService.createProperty(input), 201);
  } catch (e) {
    return json({ error: (e as Error).message }, 409);
  }
});
