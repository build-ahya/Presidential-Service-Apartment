'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { api } from './api';

export function DeleteButton({
  url,
  redirectTo,
  title,
  description,
  label = 'Delete',
  iconOnly = false,
}: {
  url: string;
  redirectTo?: string;
  title: string;
  description: string;
  label?: string;
  iconOnly?: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function confirm() {
    setBusy(true);
    try {
      await api(url, { method: 'DELETE' });
      toast.success('Deleted');
      if (redirectTo) router.push(redirectTo);
      router.refresh();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
      setOpen(false);
    }
  }

  return (
    <>
      <Button
        type='button'
        variant='outline'
        size={iconOnly ? 'icon-sm' : 'default'}
        className='text-destructive hover:text-destructive'
        onClick={() => setOpen(true)}
        aria-label={label}
      >
        <Trash2 /> {!iconOnly && label}
      </Button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={busy}
              onClick={(e) => {
                e.preventDefault();
                void confirm();
              }}
            >
              {busy ? 'Deleting…' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
