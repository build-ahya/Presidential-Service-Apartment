import { handler, requireStaff } from '@/lib/api';
import { json } from '@/lib/http';
import { MediaService } from '@/services/media.service';

/** Adds files that are already in the storage bucket to the media library. */
export const POST = handler(async () => {
  await requireStaff();
  return json({ added: await MediaService.importExisting() });
});
