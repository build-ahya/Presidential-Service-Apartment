'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

/** Sticky save bar for long forms. */
export function FormBar({
  saving,
  cancelHref,
  saveLabel = 'Save changes',
  children,
}: {
  saving: boolean;
  cancelHref?: string;
  saveLabel?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className='sticky bottom-0 z-10 -mx-4 mt-8 flex items-center justify-between gap-3 border-t bg-background/95 px-4 py-3 backdrop-blur md:-mx-8 md:px-8'>
      <div className='flex items-center gap-2 text-sm text-muted-foreground'>{children}</div>
      <div className='flex items-center gap-2'>
        {cancelHref && (
          <Button asChild variant='ghost'>
            <Link href={cancelHref}>Cancel</Link>
          </Button>
        )}
        <Button type='submit' loading={saving}>
          {saveLabel}
        </Button>
      </div>
    </div>
  );
}
