const MAX_EDGE = 2400;

/** Downscale large photos in the browser so uploads stay small and fast. */
export async function prepareImage(file: File): Promise<{ blob: Blob; width: number; height: number }> {
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return { blob: file, width: 0, height: 0 };

  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  // GIFs would lose animation; small images don't need work.
  if (file.type === 'image/gif' || (scale === 1 && file.size < 1.5 * 1024 * 1024)) {
    bitmap.close();
    return { blob: file, width: bitmap.width, height: bitmap.height };
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.getContext('2d')?.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const type = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.86));
  return { blob: blob && blob.size < file.size ? blob : file, width, height };
}
