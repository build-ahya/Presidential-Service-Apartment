'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const data = new FormData(e.currentTarget);
    const result = await signIn('credentials', {
      email: data.get('email'),
      password: data.get('password'),
      redirect: false,
    });
    if (!result || result.error) {
      setError('Incorrect email or password.');
      setLoading(false);
      return;
    }
    router.replace(callbackUrl);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor='email'>Email</FieldLabel>
          <Input id='email' name='email' type='email' autoComplete='username' required autoFocus />
        </Field>
        <Field>
          <FieldLabel htmlFor='password'>Password</FieldLabel>
          <Input id='password' name='password' type='password' autoComplete='current-password' required />
        </Field>
        {error && (
          <p role='alert' className='text-sm font-medium text-destructive'>
            {error}
          </p>
        )}
        <Button type='submit' size='lg' loading={loading} className='w-full'>
          Sign in
        </Button>
      </FieldGroup>
    </form>
  );
}
