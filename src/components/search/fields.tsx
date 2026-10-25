'use client';

import * as React from 'react';
import { addDays, isSameDay, startOfToday } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { CalendarDays, ChevronDown, Minus, Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  formatDay,
  fromDateString,
  guestLabel,
  nightsBetween,
  toDateString,
} from '@/lib/booking';
import { cn } from '@/lib/utils';

/** A booking.com-style field: icon, small label, bold value. */
export const FieldButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'> & {
    icon: React.ReactNode;
    label: string;
    value?: string;
    placeholder?: string;
    chevron?: boolean;
  }
>(function FieldButton({ icon, label, value, placeholder, chevron, className, ...props }, ref) {
  return (
    <button
      ref={ref}
      type='button'
      className={cn(
        'group flex w-full min-w-0 items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none',
        className
      )}
      {...props}
    >
      <span className='text-muted-foreground group-hover:text-foreground [&_svg]:size-5'>{icon}</span>
      <span className='flex min-w-0 flex-1 flex-col'>
        <span className='text-[11px] font-medium uppercase tracking-wide text-muted-foreground'>
          {label}
        </span>
        <span className={cn('truncate text-sm font-semibold', !value && 'font-normal text-muted-foreground')}>
          {value || placeholder}
        </span>
      </span>
      {chevron && <ChevronDown className='size-4 text-muted-foreground' />}
    </button>
  );
});

export function DateRangeField({
  checkIn,
  checkOut,
  onChange,
  className,
  align = 'start',
}: {
  checkIn?: string;
  checkOut?: string;
  onChange: (range: { checkIn?: string; checkOut?: string }) => void;
  className?: string;
  align?: 'start' | 'center' | 'end';
}) {
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();
  const from = fromDateString(checkIn);
  const to = fromDateString(checkOut);
  const nights = nightsBetween(checkIn, checkOut);
  const today = startOfToday();

  const handleSelect = (range: DateRange | undefined, clicked: Date) => {
    // Restart the selection when a full range exists and the user clicks again.
    if (from && to) {
      onChange({ checkIn: toDateString(clicked), checkOut: undefined });
      return;
    }
    if (!range?.from) return onChange({});
    if (!range.to || isSameDay(range.from, range.to)) {
      return onChange({ checkIn: toDateString(range.from), checkOut: undefined });
    }
    onChange({ checkIn: toDateString(range.from), checkOut: toDateString(range.to) });
    setOpen(false);
  };

  const value =
    checkIn && checkOut
      ? `${formatDay(checkIn)} — ${formatDay(checkOut)}`
      : checkIn
        ? `${formatDay(checkIn)} — Check-out`
        : '';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FieldButton
          className={className}
          icon={<CalendarDays />}
          label='Check-in — Check-out'
          value={value}
          placeholder='Add dates'
        />
      </PopoverTrigger>
      <PopoverContent align={align} className='w-auto max-w-[calc(100vw-1rem)] p-0'>
        <Calendar
          mode='range'
          numberOfMonths={isMobile ? 1 : 2}
          selected={from ? { from, to } : undefined}
          onSelect={handleSelect}
          disabled={{ before: today }}
          defaultMonth={from ?? today}
          startMonth={today}
        />
        <div className='flex items-center justify-between border-t px-4 py-3 text-sm'>
          <span className='text-muted-foreground'>
            {nights > 0
              ? `${nights} night${nights === 1 ? '' : 's'}`
              : from
                ? 'Now choose check-out'
                : 'Choose check-in'}
          </span>
          <div className='flex gap-2'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => onChange({})}
              disabled={!checkIn && !checkOut}
            >
              Clear
            </Button>
            <Button
              size='sm'
              variant='secondary'
              onClick={() => {
                const start = from ?? today;
                onChange({ checkIn: toDateString(start), checkOut: toDateString(addDays(start, 1)) });
                setOpen(false);
              }}
            >
              1 night
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function Stepper({
  label,
  hint,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className='flex items-center justify-between gap-4'>
      <div>
        <p className='text-sm font-medium'>{label}</p>
        {hint && <p className='text-xs text-muted-foreground'>{hint}</p>}
      </div>
      <div className='flex items-center gap-3'>
        <Button
          type='button'
          variant='outline'
          size='icon-sm'
          className='rounded-full'
          onClick={() => onChange(value - 1)}
          disabled={value <= min}
          aria-label={`Fewer ${label.toLowerCase()}`}
        >
          <Minus />
        </Button>
        <span className='w-5 text-center text-sm font-semibold tabular-nums'>{value}</span>
        <Button
          type='button'
          variant='outline'
          size='icon-sm'
          className='rounded-full'
          onClick={() => onChange(value + 1)}
          disabled={value >= max}
          aria-label={`More ${label.toLowerCase()}`}
        >
          <Plus />
        </Button>
      </div>
    </div>
  );
}

export function GuestsField({
  adults,
  kids,
  maxGuests = 12,
  onChange,
  className,
  align = 'end',
}: {
  adults: number;
  kids: number;
  maxGuests?: number;
  onChange: (v: { adults: number; children: number }) => void;
  className?: string;
  align?: 'start' | 'center' | 'end';
}) {
  const [open, setOpen] = React.useState(false);
  const total = adults + kids;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FieldButton
          className={className}
          icon={<Users />}
          label='Guests'
          value={guestLabel(adults, kids)}
          chevron
        />
      </PopoverTrigger>
      <PopoverContent align={align} className='w-80 max-w-[calc(100vw-1rem)]'>
        <div className='flex flex-col gap-4'>
          <Stepper
            label='Adults'
            hint='Age 13 or above'
            value={adults}
            min={1}
            max={Math.max(1, maxGuests - kids)}
            onChange={(n) => onChange({ adults: n, children: kids })}
          />
          <Stepper
            label='Children'
            hint='Age 0 to 12'
            value={kids}
            min={0}
            max={Math.max(0, maxGuests - adults)}
            onChange={(n) => onChange({ adults, children: n })}
          />
          {total >= maxGuests && (
            <p className='text-xs text-muted-foreground'>Maximum of {maxGuests} guests.</p>
          )}
          <Button variant='outline' className='w-full' onClick={() => setOpen(false)}>
            Done
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
