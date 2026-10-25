'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function SortSelect({ value }: { value: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  return (
    <Select
      value={value}
      onValueChange={(v) => {
        const next = new URLSearchParams(params);
        if (v === 'recommended') next.delete('sort');
        else next.set('sort', v);
        router.replace(`${pathname}?${next.toString()}`, { scroll: false });
      }}
    >
      <SelectTrigger className='w-48 bg-background' aria-label='Sort apartments'>
        <SelectValue />
      </SelectTrigger>
      <SelectContent align='end'>
        <SelectGroup>
          <SelectItem value='recommended'>Recommended</SelectItem>
          <SelectItem value='price_asc'>Price: low to high</SelectItem>
          <SelectItem value='price_desc'>Price: high to low</SelectItem>
          <SelectItem value='guests'>Sleeps the most</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
