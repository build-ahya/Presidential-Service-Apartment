'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Logo } from '@/components/brand/logo';
import { cn } from '@/lib/utils';
import { useSite } from '@/providers/site-provider';

export default function PublicHeader() {
  const { content } = useSite();
  const { siteName, headerLinks, contact } = content.systemSettings;
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // The colored logo needs a light backdrop, so the header is always light; it just gains a shadow once scrolled.
  const solid = true;
  const links = headerLinks.filter((l) => !l.isButton);
  const cta = headerLinks.find((l) => l.isButton);
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-all duration-300',
        'border-b bg-background/90 backdrop-blur-md', scrolled && 'shadow-sm'
      )}
    >
      <div className='container mx-auto flex h-16 items-center justify-between gap-4 px-4 md:h-[72px]'>
        <Link href='/' aria-label={siteName} className='shrink-0'>
          <Logo name={siteName} tone='dark' />
        </Link>

        <nav className='hidden items-center gap-1 md:flex' aria-label='Main'>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                solid
                  ? isActive(link.href)
                    ? 'bg-primary/15 text-secondary'
                    : 'text-foreground/80 hover:bg-muted hover:text-foreground'
                  : isActive(link.href)
                    ? 'bg-white/20 text-white'
                    : 'text-white/90 hover:bg-white/15 hover:text-white'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className='hidden items-center gap-2 md:flex'>
          {contact?.phones?.[0] && (
            <a
              href={`tel:${contact.phones[0].replace(/\s+/g, '')}`}
              className={cn(
                'flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium',
                solid ? 'text-foreground/80 hover:text-foreground' : 'text-white/90 hover:text-white'
              )}
            >
              <Phone className='size-4' />
              {contact.phones[0]}
            </a>
          )}
          <Button asChild>
            <Link href={cta?.href ?? '/apartments'}>{cta?.label ?? 'Book now'}</Link>
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className={cn('md:hidden', !solid && 'text-white hover:bg-white/15 hover:text-white')}
              aria-label='Open menu'
            >
              <Menu className='size-6' />
            </Button>
          </SheetTrigger>
          <SheetContent side='right' className='w-80 gap-0 p-0'>
            <SheetTitle className='sr-only'>Menu</SheetTitle>
            <SheetDescription className='sr-only'>Site navigation</SheetDescription>
            <div className='border-b p-4'>
              <Logo name={siteName} />
            </div>
            <nav className='flex flex-col gap-1 p-3'>
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'rounded-lg px-3 py-3 text-base font-medium',
                    isActive(link.href) ? 'bg-primary/15 text-secondary' : 'hover:bg-muted'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className='mt-auto flex flex-col gap-2 border-t p-4'>
              <Button asChild size='lg'>
                <Link href={cta?.href ?? '/apartments'} onClick={() => setOpen(false)}>
                  {cta?.label ?? 'Book now'}
                </Link>
              </Button>
              {contact?.phones?.[0] && (
                <Button asChild variant='outline' size='lg'>
                  <a href={`tel:${contact.phones[0].replace(/\s+/g, '')}`}>
                    <Phone /> {contact.phones[0]}
                  </a>
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
