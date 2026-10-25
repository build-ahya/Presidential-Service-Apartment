import 'server-only';
import { randomUUID } from 'node:crypto';
import { adminBucket, collections, STORAGE_ROOT } from '@/lib/firebase-admin';
import type { MediaAsset } from '@/models/media';

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
export const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];

const nowISO = () => new Date().toISOString();

const sanitizeName = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'file';

const sanitizeFolder = (folder: string) =>
  folder
    .split('/')
    .map((p) => sanitizeName(p))
    .filter(Boolean)
    .join('/') || 'uploads';

function downloadUrl(bucket: string, path: string, token: string) {
  return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(
    path
  )}?alt=media&token=${token}`;
}

export class MediaService {
  static async list(params: { folder?: string; q?: string } = {}): Promise<MediaAsset[]> {
    const snap = await collections.media().get();
    let items = snap.docs
      .map((d) => ({ ...(d.data() as MediaAsset), id: d.id }))
      .sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
    if (params.folder) items = items.filter((m) => m.folder === params.folder);
    if (params.q) {
      const q = params.q.toLowerCase();
      items = items.filter((m) =>
        [m.name, m.alt, m.caption, m.folder].some((v) => v?.toLowerCase().includes(q))
      );
    }
    return items;
  }

  static async upload(input: {
    buffer: Buffer;
    filename: string;
    contentType: string;
    folder?: string;
    width?: number;
    height?: number;
    alt?: string;
    createdBy?: string;
  }): Promise<MediaAsset> {
    if (!ALLOWED_TYPES.includes(input.contentType)) {
      throw new Error('Only JPEG, PNG, WebP, GIF and AVIF images can be uploaded');
    }
    if (input.buffer.byteLength > MAX_UPLOAD_BYTES) {
      throw new Error('Images must be 8MB or smaller');
    }

    const bucket = adminBucket();
    const folder = sanitizeFolder(input.folder || 'uploads');
    const name = sanitizeName(input.filename);
    const path = `${STORAGE_ROOT}/${folder}/${Date.now()}-${name}`;
    const token = randomUUID();

    await bucket.file(path).save(input.buffer, {
      resumable: false,
      metadata: {
        contentType: input.contentType,
        cacheControl: 'public, max-age=31536000',
        metadata: { firebaseStorageDownloadTokens: token },
      },
    });

    const ref = collections.media().doc();
    const asset: MediaAsset = {
      id: ref.id,
      url: downloadUrl(bucket.name, path, token),
      path,
      name: input.filename,
      alt: input.alt?.trim() || input.filename.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' '),
      type: 'image',
      width: input.width || 0,
      height: input.height || 0,
      size: input.buffer.byteLength,
      contentType: input.contentType,
      folder,
      createdAt: nowISO(),
      createdBy: input.createdBy,
    };
    await ref.set(asset);
    return asset;
  }

  static async update(id: string, patch: Partial<Pick<MediaAsset, 'alt' | 'caption' | 'name'>>) {
    const ref = collections.media().doc(id);
    if (!(await ref.get()).exists) return null;
    await ref.update(patch);
    return { ...((await ref.get()).data() as MediaAsset), id };
  }

  static async delete(id: string) {
    const ref = collections.media().doc(id);
    const snap = await ref.get();
    if (!snap.exists) return;
    const { path } = snap.data() as MediaAsset;
    await adminBucket()
      .file(path)
      .delete({ ignoreNotFound: true });
    await ref.delete();
  }

  /** Register files that already sit in the bucket (uploaded before the media manager existed). */
  static async importExisting(): Promise<number> {
    const bucket = adminBucket();
    const [files] = await bucket.getFiles({ prefix: `${STORAGE_ROOT}/` });
    const known = new Set((await this.list()).map((m) => m.path));
    const pending = files.filter((f) => {
      const type = f.metadata.contentType as string | undefined;
      return !known.has(f.name) && !!type && ALLOWED_TYPES.includes(type);
    });

    const register = async (file: (typeof files)[number]) => {
      const contentType = file.metadata.contentType as string;
      let token = (file.metadata.metadata as Record<string, string> | undefined)
        ?.firebaseStorageDownloadTokens?.split(',')[0];
      if (!token) {
        token = randomUUID();
        await file.setMetadata({ metadata: { firebaseStorageDownloadTokens: token } });
      }

      const relative = file.name.slice(STORAGE_ROOT.length + 1);
      const folder = relative.includes('/') ? relative.slice(0, relative.lastIndexOf('/')) : 'uploads';
      const name = file.name.split('/').pop() as string;
      const ref = collections.media().doc();
      await ref.set({
        id: ref.id,
        url: downloadUrl(bucket.name, file.name, token),
        path: file.name,
        name,
        alt: name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' '),
        type: 'image',
        width: 0,
        height: 0,
        size: Number(file.metadata.size ?? 0),
        contentType,
        folder,
        createdAt: (file.metadata.timeCreated as string) || nowISO(),
      } satisfies MediaAsset);
    };

    // Small parallel batches keep this well inside a serverless time limit.
    for (let i = 0; i < pending.length; i += 25) {
      await Promise.all(pending.slice(i, i + 25).map(register));
    }
    const added = pending.length;
    return added;
  }
}
