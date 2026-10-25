'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

/** Free-text list (amenities, tags, house rules). Enter or comma adds an item. */
export function ListField({
  value,
  onChange,
  placeholder = 'Type and press Enter',
  suggestions = [],
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
}) {
  const [draft, setDraft] = useState('');
  const add = (raw: string) => {
    const items = raw
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s && !value.some((v) => v.toLowerCase() === s.toLowerCase()));
    if (items.length) onChange([...value, ...items]);
    setDraft('');
  };

  const remaining = suggestions.filter((s) => !value.some((v) => v.toLowerCase() === s.toLowerCase()));

  return (
    <div className='flex flex-col gap-3'>
      {value.length > 0 && (
        <ul className='flex flex-wrap gap-2'>
          {value.map((item) => (
            <li key={item}>
              <Badge variant='secondary' className='gap-1 py-1 pr-1 pl-2.5 text-sm font-normal'>
                {item}
                <button
                  type='button'
                  onClick={() => onChange(value.filter((v) => v !== item))}
                  className='grid size-4 place-items-center rounded-full hover:bg-foreground/10'
                  aria-label={`Remove ${item}`}
                >
                  <X className='size-3' />
                </button>
              </Badge>
            </li>
          ))}
        </ul>
      )}
      <div className='flex gap-2'>
        <Input
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault();
              add(draft);
            }
          }}
          onBlur={() => draft && add(draft)}
        />
        <Button type='button' variant='outline' onClick={() => add(draft)} disabled={!draft.trim()}>
          <Plus /> Add
        </Button>
      </div>
      {remaining.length > 0 && (
        <div className='flex flex-wrap items-center gap-1.5'>
          <span className='text-xs text-muted-foreground'>Suggestions:</span>
          {remaining.slice(0, 12).map((s) => (
            <button
              key={s}
              type='button'
              onClick={() => add(s)}
              className='rounded-full border border-dashed px-2.5 py-0.5 text-xs text-muted-foreground hover:border-primary hover:text-foreground'
            >
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Number input that keeps `undefined` for blank and avoids NaN. */
export function NumberInput({
  value,
  onChange,
  className,
  ...props
}: Omit<React.ComponentProps<typeof Input>, 'value' | 'onChange' | 'type'> & {
  value?: number;
  onChange: (v: number | undefined) => void;
}) {
  return (
    <Input
      type='number'
      inputMode='decimal'
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
      className={cn(className)}
      {...props}
    />
  );
}

export function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className='grid gap-6 border-b py-8 first:pt-0 last:border-b-0 lg:grid-cols-[260px_1fr]'>
      <div>
        <h2 className='font-semibold'>{title}</h2>
        {description && <p className='mt-1 text-sm text-muted-foreground'>{description}</p>}
      </div>
      <div className='flex min-w-0 flex-col gap-5'>{children}</div>
    </section>
  );
}
