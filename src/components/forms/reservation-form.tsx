'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const schema = z.object({
  apartmentId: z.string().min(1, 'Apartment is required'),
  checkIn: z.string().min(1, 'Check-in is required'),
  checkOut: z.string().min(1, 'Check-out is required'),
  guestsCount: z.coerce.number().min(1, 'At least 1 guest'),
  name: z.string().min(2, 'Full name is required'),
  email: z.email('Valid email required'),
  phone: z.string().min(10, 'Valid phone required'),
  notes: z.string().optional(),
});

type ReservationFormInput = z.input<typeof schema>;
type ReservationFormValues = z.output<typeof schema>;

export type ReservationFormProps = {
  initial: {
    apartmentId: string;
    checkIn: string;
    checkOut: string;
    guestsCount: number;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
};

export default function ReservationForm({ initial, onSuccess, onCancel }: ReservationFormProps) {
  const form = useForm<ReservationFormInput, any, ReservationFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      apartmentId: initial.apartmentId,
      checkIn: initial.checkIn,
      checkOut: initial.checkOut,
      guestsCount: initial.guestsCount,
      name: '',
      email: '',
      phone: '',
      notes: '',
    },
  });
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(values: ReservationFormValues) {
    setSubmitting(true);
    try {
      const payload = {
        apartmentId: values.apartmentId,
        checkIn: values.checkIn,
        checkOut: values.checkOut,
        guestsCount: values.guestsCount,
        guest: { name: values.name, email: values.email, phone: values.phone },
        notes: values.notes || undefined,
        status: 'pending' as const,
      };
      const res = await fetch('/api/reservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error || 'Failed to create reservation');
      }
      toast.success('Reservation created');
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.message || 'Error creating reservation');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
          <FormField<ReservationFormInput, 'name'>
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder='John Doe' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField<ReservationFormInput, 'email'>
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type='email' placeholder='john@example.com' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField<ReservationFormInput, 'phone'>
            control={form.control}
            name='phone'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder='+234...' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField<ReservationFormInput, 'guestsCount'>
            control={form.control}
            name='guestsCount'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Guests</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    min={1}
                    value={typeof field.value === 'number' ? field.value : Number(field.value ?? 1)}
                    onChange={(e) => field.onChange(e.currentTarget.valueAsNumber)}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
          <FormField<ReservationFormInput, 'checkIn'>
            control={form.control}
            name='checkIn'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Check-in</FormLabel>
                <FormControl>
                  <Input type='date' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField<ReservationFormInput, 'checkOut'>
            control={form.control}
            name='checkOut'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Check-out</FormLabel>
                <FormControl>
                  <Input type='date' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField<ReservationFormInput, 'notes'>
          control={form.control}
          name='notes'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea rows={3} placeholder='Special requests or notes' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Hidden apartmentId field */}
        <FormField<ReservationFormInput, 'apartmentId'>
          control={form.control}
          name='apartmentId'
          render={({ field }) => (
            <Input type='hidden' {...field} />
          )}
        />

        <div className='flex items-center justify-end gap-2'>
          <Button type='button' variant='ghost' onClick={onCancel}>Cancel</Button>
          <Button type='submit' disabled={submitting}>
            {submitting ? 'Submitting...' : 'Confirm Reservation'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
