import { handler, requireStaff } from '@/lib/api';
import { json, parseBody } from '@/lib/http';
import { propertySchema } from '@/lib/schemas';
import { CatalogService } from '@/services/catalog.service';

type Ctx = { params: Promise<{ id: string }> };

export const GET = handler(async (_req: Request, { params }: Ctx) => {
  await requireStaff();
  const property = await CatalogService.getPropertyById((await params).id);
  return property ? json(property) : json({ error: 'Property not found' }, 404);
});

export const PUT = handler(async (request: Request, { params }: Ctx) => {
  await requireStaff();
  const input = await parseBody(request, propertySchema);
  try {
    const property = await CatalogService.updateProperty((await params).id, input);
    return property ? json(property) : json({ error: 'Property not found' }, 404);
  } catch (e) {
    return json({ error: (e as Error).message }, 409);
  }
});

export const DELETE = handler(async (_req: Request, { params }: Ctx) => {
  await requireStaff(['admin']);
  try {
    await CatalogService.deleteProperty((await params).id);
    return json({ deleted: true });
  } catch (e) {
    return json({ error: (e as Error).message }, 409);
  }
});
