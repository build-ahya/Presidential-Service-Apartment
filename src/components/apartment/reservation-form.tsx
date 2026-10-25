'use client';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { reservationRequestSchema } from '@/lib/schemas';

const formSchema = reservationRequestSchema.pick({ name: true, email: true, phone: true, notes: true });
type Values = z.input<typeof formSchema>;

export interface ReservationFormProps {
  apartmentId: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  onSuccess: () => void;
  onCancel?: () => void;
}

export default function ReservationForm({
  apartmentId,
  checkIn,
  checkOut,
  guestsCount,
  onSuccess,
  onCancel,
}: ReservationFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<Values>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '', phone: '', notes: '' },
  });

  async function onSubmit(values: Values) {
    setSubmitting(true);
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, apartmentId, checkIn, checkOut, guestsCount }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Could not send your request');
      onSuccess();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not send your request');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Controller
          control={form.control}
          name='name'
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor='res-name'>Full name</FieldLabel>
              <Input id='res-name' autoComplete='name' aria-invalid={fieldState.invalid} {...field} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <div className='grid gap-4 sm:grid-cols-2'>
          <Controller
            control={form.control}
            name='email'
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='res-email'>Email</FieldLabel>
                <Input id='res-email' type='email' autoComplete='email' aria-invalid={fieldState.invalid} {...field} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name='phone'
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='res-phone'>Phone / WhatsApp</FieldLabel>
                <Input id='res-phone' type='tel' autoComplete='tel' placeholder='+234…' aria-invalid={fieldState.invalid} {...field} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>
        <Controller
          control={form.control}
          name='notes'
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor='res-notes'>Special requests (optional)</FieldLabel>
              <Textarea id='res-notes' rows={3} placeholder='Arrival time, airport pickup, …' {...field} />
            </Field>
          )}
        />
        <div className='flex justify-end gap-2'>
          {onCancel && (
            <Button type='button' variant='ghost' onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type='submit' size='lg' loading={submitting}>
            Send reservation request
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
