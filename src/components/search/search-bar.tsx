'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Building2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { parseSearch, searchToQuery, type SearchState } from '@/lib/booking';
import { cn } from '@/lib/utils';
import { useSite } from '@/providers/site-provider';
import { DateRangeField, FieldButton, GuestsField } from './fields';

const ANY = 'all';

/**
 * Booking.com-style search: property, dates, guests. Submitting navigates to
 * /apartments with the search in the query string, so results are shareable.
 */
export function SearchBar({
  className,
  size = 'default',
}: {
  className?: string;
  size?: 'default' | 'large';
}) {
  const { properties } = useSite();
  const router = useRouter();
  const params = useSearchParams();
  const initial = React.useMemo(() => parseSearch(params), [params]);
  const [state, setState] = React.useState<SearchState>(initial);
  const [error, setError] = React.useState('');

  // Keep in sync when the URL changes (back button, shared link).
  React.useEffect(() => setState(initial), [initial]);

  const patch = (p: Partial<SearchState>) => {
    setError('');
    setState((s) => ({ ...s, ...p }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (state.checkIn && !state.checkOut) {
      setError('Choose a check-out date');
      return;
    }
    router.push(`/apartments?${searchToQuery(state)}`);
  };

  const multi = properties.length > 1;
  const propertyName = properties.find((p) => p.id === state.propertyId)?.name;

  return (
    <form onSubmit={onSubmit} className={cn('w-full', className)}>
      <div
        className={cn(
          'flex flex-col overflow-hidden rounded-2xl border-[3px] border-primary bg-background text-foreground shadow-xl',
          'lg:flex-row lg:items-stretch lg:divide-x lg:rounded-full',
          '[&>*:not(:last-child)]:border-b lg:[&>*:not(:last-child)]:border-b-0',
          size === 'large' && 'lg:[&_button]:py-3.5'
        )}
      >
        <div className='lg:flex-[1.2]'>
          {multi ? (
            <Select
              value={state.propertyId ?? ANY}
              onValueChange={(v) => patch({ propertyId: v === ANY ? undefined : v })}
            >
              <SelectTrigger className='h-auto w-full rounded-none border-0 px-4 py-2.5 shadow-none focus-visible:ring-0 [&>span]:flex [&>span]:flex-col [&>span]:items-start [&_svg:last-child]:ml-auto'>
                <span className='flex items-center gap-3'>
                  <Building2 className='size-5 text-muted-foreground' />
                  <span className='flex flex-col items-start'>
                    <span className='text-[11px] font-medium uppercase tracking-wide text-muted-foreground'>
                      Property
                    </span>
                    <SelectValue placeholder='All properties' />
                  </span>
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={ANY}>All properties</SelectItem>
                  {properties.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          ) : (
            <FieldButton
              tabIndex={-1}
              className='cursor-default hover:bg-transparent'
              icon={<Building2 />}
              label='Property'
              value={propertyName ?? properties[0]?.name ?? 'Presidential Service Apartments'}
            />
          )}
        </div>

        <div className='lg:flex-[1.5]'>
          <DateRangeField
            checkIn={state.checkIn}
            checkOut={state.checkOut}
            onChange={patch}
          />
        </div>

        <div className='lg:flex-1'>
          <GuestsField
            adults={state.adults}
            kids={state.children}
            onChange={patch}
          />
        </div>

        <div className='flex items-center p-2 lg:pl-2'>
          <Button
            type='submit'
            size='lg'
            className='h-12 w-full rounded-xl text-base font-semibold lg:rounded-full lg:px-8'
          >
            <Search />
            Search
          </Button>
        </div>
      </div>
      {error && <p className='mt-2 text-center text-sm font-medium text-destructive'>{error}</p>}
    </form>
  );
}
