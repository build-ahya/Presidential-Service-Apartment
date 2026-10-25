'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { PublicUser, UserRole } from '@/models/user';
import { api } from './api';
import { DeleteButton } from './delete-button';

export function UsersManager({ users, currentEmail }: { users: PublicUser[]; currentEmail: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [role, setRole] = useState<UserRole>('manager');

  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setSaving(true);
    try {
      await api('/api/admin/users', {
        method: 'POST',
        body: {
          firstName: data.get('firstName'),
          lastName: data.get('lastName'),
          email: data.get('email'),
          password: data.get('password'),
          role,
        },
      });
      toast.success('Team member added');
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function patch(user: PublicUser, body: Record<string, unknown>) {
    try {
      await api(`/api/admin/users/${encodeURIComponent(user.email)}`, { method: 'PUT', body });
      router.refresh();
    } catch (error) {
      toast.error((error as Error).message);
    }
  }

  return (
    <>
      <div className='mb-4 flex justify-end'>
        <Button onClick={() => setOpen(true)}>
          <Plus /> Add team member
        </Button>
      </div>
      <div className='overflow-x-auto rounded-xl border bg-card'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className='w-12' />
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => {
              const me = u.email === currentEmail;
              return (
                <TableRow key={u.email}>
                  <TableCell>
                    <p className='font-medium'>
                      {u.name} {me && <Badge variant='secondary'>You</Badge>}
                    </p>
                    <p className='text-xs text-muted-foreground'>{u.email}</p>
                  </TableCell>
                  <TableCell>
                    <Select value={u.role} onValueChange={(r) => patch(u, { role: r })} disabled={me}>
                      <SelectTrigger className='w-32' aria-label={`Role for ${u.name}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value='admin'>Admin</SelectItem>
                          <SelectItem value='manager'>Manager</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Switch checked={u.active !== false} disabled={me} onCheckedChange={(c) => patch(u, { active: c })} aria-label={`Active: ${u.name}`} />
                  </TableCell>
                  <TableCell>
                    {!me && (
                      <DeleteButton
                        iconOnly
                        url={`/api/admin/users/${encodeURIComponent(u.email)}`}
                        title={`Remove ${u.name}?`}
                        description='They will no longer be able to sign in.'
                      />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add team member</DialogTitle>
            <DialogDescription>Admins can manage the team and delete data; managers handle day-to-day content and bookings.</DialogDescription>
          </DialogHeader>
          <form onSubmit={create}>
            <FieldGroup>
              <div className='grid grid-cols-2 gap-4'>
                <Field>
                  <FieldLabel htmlFor='u-first'>First name</FieldLabel>
                  <Input id='u-first' name='firstName' required />
                </Field>
                <Field>
                  <FieldLabel htmlFor='u-last'>Last name</FieldLabel>
                  <Input id='u-last' name='lastName' required />
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor='u-email'>Email</FieldLabel>
                <Input id='u-email' name='email' type='email' required />
              </Field>
              <Field>
                <FieldLabel htmlFor='u-pass'>Temporary password</FieldLabel>
                <Input id='u-pass' name='password' type='password' minLength={8} required autoComplete='new-password' />
              </Field>
              <Field>
                <FieldLabel>Role</FieldLabel>
                <Select value={role} onValueChange={(r) => setRole(r as UserRole)}>
                  <SelectTrigger className='w-40'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value='manager'>Manager</SelectItem>
                      <SelectItem value='admin'>Admin</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Button type='submit' loading={saving} className='w-full'>
                Add member
              </Button>
            </FieldGroup>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
