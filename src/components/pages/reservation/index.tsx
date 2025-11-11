'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import LoginForm from '@/components/forms/login-form';
import Loading from '@/components/ui/loading';

type ActionType = 'confirmed' | 'cancelled';

export default function ReservationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { status } = useSession();

  const action = (searchParams.get('action') as ActionType | null) || null;
  const reservationId = searchParams.get('id') || searchParams.get('reservationId') || '';

  const [loginOpen, setLoginOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const canProceed = useMemo(() => {
    return !!action && !!reservationId && (action === 'confirmed' || action === 'cancelled');
  }, [action, reservationId]);

  useEffect(() => {
    if (canProceed && status === 'unauthenticated') {
      setLoginOpen(true);
    }
  }, [canProceed, status]);

  useEffect(() => {
    if (canProceed && status === 'authenticated') {
      void performUpdate();
    }
  }, [canProceed, status]);

  async function performUpdate() {
    try {
      setUpdating(true);
      setError('');
      setMessage('');
      const nextStatus = action === 'confirmed' ? 'confirmed' : 'cancelled';
      const res = await fetch(`/api/reservation/${reservationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to update reservation');
      }
      await res.json();
      setMessage(action === 'confirmed' ? 'Reservation confirmed successfully.' : 'Reservation cancelled successfully.');
    } catch (e: any) {
      setError(e?.message || 'Something went wrong while updating reservation');
    } finally {
      setUpdating(false);
    }
  }

  function handleLoginSuccess() {
    setLoginOpen(false);
    // Session status will become 'authenticated' and trigger performUpdate via effect
  }

  return (
    <div className='container mx-auto h-[60vh] px-4 py-10 my-24'>
      <div className='mx-auto max-w-md text-center'>
        <h1 className='text-2xl font-semibold mb-3'>Reservation Action</h1>
        {!canProceed && (
          <p className='text-muted-foreground'>
            Missing or invalid query parameters. Please provide <code>action=confirm|cancel</code> and <code>id</code>.
          </p>
        )}

        {canProceed && status === 'unauthenticated' && (
          <p className='text-muted-foreground'>Please sign in to complete this action.</p>
        )}

        {canProceed && status === 'authenticated' && (
          <div className='space-y-3'>
            <p>Processing your request to {action} reservation.</p>
            {updating ? (
              <div className='flex items-center justify-center gap-2 text-sm text-muted-foreground'>
                <Loading label='Updating reservation…' className='h-4 w-4' />
                <span>Updating reservation…</span>
              </div>
            ) : (
              <div className='space-y-2'>
                {message && <p className='text-green-600'>{message}</p>}
                {error && <p className='text-red-600'>{error}</p>}
                <div className='flex items-center justify-center gap-2'>
                  <Button variant='default' onClick={() => router.push('/')}>Go Home</Button>
                  <Button variant='secondary' onClick={() => router.back()}>Go Back</Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign in to continue</DialogTitle>
          </DialogHeader>
          <LoginForm onSuccess={handleLoginSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
