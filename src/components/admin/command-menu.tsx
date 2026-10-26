'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Kbd } from '@/components/ui/kbd';

export interface CommandLink {
  title: string;
  href: string;
  group: string;
}

/** ⌘K / Ctrl+K quick navigation. */
export function CommandMenu({ links }: { links: CommandLink[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const groups = [...new Set(links.map((l) => l.group))];

  return (
    <>
      <Button
        variant='outline'
        className='hidden h-9 w-64 justify-between px-3 font-normal text-muted-foreground md:flex'
        onClick={() => setOpen(true)}
      >
        <span className='flex items-center gap-2'>
          <Search /> Search…
        </span>
        <Kbd>⌘K</Kbd>
      </Button>
      <Button variant='ghost' size='icon' className='md:hidden' onClick={() => setOpen(true)} aria-label='Search'>
        <Search />
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} title='Go to' description='Jump to any admin page'>
        <CommandInput placeholder='Go to…' />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
          {groups.map((g) => (
            <CommandGroup key={g} heading={g}>
              {links
                .filter((l) => l.group === g)
                .map((l) => (
                  <CommandItem
                    key={l.href}
                    value={`${g} ${l.title}`}
                    onSelect={() => {
                      setOpen(false);
                      router.push(l.href);
                    }}
                  >
                    {l.title}
                  </CommandItem>
                ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
