'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAppSelector } from '@/store/hooks';
import { ChevronDown, Menu, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PublicHeader() {
  const { content } = useAppSelector((state) => state.content);

  const { headerLinks } = content.systemSettings;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useIsMobile();
  const [scrolledPastViewport, setScrolledPastViewport] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      const vh = window.innerHeight || 0;
      // Only enable scroll-based header styling on the home page
      setScrolledPastViewport(isHome ? y >= vh : true);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  const dropdownLinks = headerLinks.filter((link) => link.dropdown);
  const otherLinks = headerLinks.filter((link) => !link.dropdown && !link.isButton);
  const buttonLinks = headerLinks.filter((link) => link.isButton);

  return (
    <header className="fixed top-4 left-1/2 z-50 w-full -translate-x-1/2 px-4">
      <div className="mx-auto container">
        <nav className="flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={isHome
                ? (scrolledPastViewport
                  ? "/images/presidential-service-colored-logo.svg"
                  : "/images/presidential-service-logo.svg")
                : "/images/presidential-service-colored-logo.svg"}
              alt="Presidential Service Apartment logo"
              width={32}
              height={32}
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-2 px-4 py-3 rounded-full border border-white/20 bg-white/10 backdrop-blur supports-[backdrop-filter]:bg-white/10 shadow-lg">
            {otherLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium rounded-full px-4 py-1 transition-colors",
                  // Active state: bg changes based on home vs others and scroll state
                  (pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href)))
                    ? (isHome
                        ? (scrolledPastViewport ? 'bg-primary text-white' : 'bg-white text-black')
                        : 'bg-primary text-white')
                    : (isHome
                        ? (scrolledPastViewport ? 'text-black hover:bg-primary hover:text-white' : 'text-white hover:bg-white hover:text-black')
                        : 'text-black hover:bg-primary hover:text-white')
                )}
              >
                {link.label}
              </Link>
            ))}

            {dropdownLinks.map((link) => (
              <div key={link.href} className="relative group">
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1 text-sm font-medium rounded-full px-4 py-1 transition-colors",
                    (pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href)))
                      ? (isHome
                          ? (scrolledPastViewport ? 'bg-primary text-white' : 'bg-white text-black')
                          : 'bg-primary text-white')
                      : (isHome
                          ? (scrolledPastViewport ? 'text-black hover:bg-primary hover:text-white' : 'text-white hover:bg-white hover:text-black')
                          : 'text-black hover:bg-primary hover:text-white')
                  )}
                >
                  {link.label}
                  <ChevronDown className="h-4 w-4" />
                </Link>
                {Array.isArray(link.dropdown) && link.dropdown.length > 0 && (
                  <div className="absolute left-0 mt-2 hidden w-48 rounded-xl border border-white/20 bg-white/80 p-2 backdrop-blur shadow-md group-hover:block">
                    {link.dropdown.map((dd: any) => (
                      <Link
                        key={`${link.href}-${dd.href}`}
                        href={dd.href}
                        className="block rounded-full px-3 py-2 text-sm text-black hover:bg-black/5"
                      >
                        {dd.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {buttonLinks.map((link) => (
              <Button
                key={link.href}
                variant={link.label === 'Search' ? 'ghost' : (scrolledPastViewport ? 'default' : 'secondary')}
                asChild
                className={cn(
                  link.label === 'Search'
                    ? (scrolledPastViewport ? 'text-black' : 'text-white')
                    : (scrolledPastViewport ? undefined : 'bg-white text-black')
                )}
              >
                <Link href={link.href} className="flex items-center gap-2">
                  {link.label === 'Search' ? (
                    <Search className="h-4 w-4" aria-hidden="true" />
                  ) : <span>{link.label}</span>}
                  
                </Link>
              </Button>
            ))}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
            <Drawer open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="h-6 w-6" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="p-4">
                <DrawerTitle className="sr-only">Menu</DrawerTitle>
                <div className="space-y-2">
                  {[...otherLinks, ...dropdownLinks].map((link) => (
                    <div key={link.href}>
                      <Link
                        href={link.href}
                        className="block rounded-lg px-3 py-2 text-base text-foreground hover:bg-muted"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                      {Array.isArray(link.dropdown) && link.dropdown.length > 0 && (
                        <div className="ml-3 space-y-1">
                          {link.dropdown.map((dd: any) => (
                            <Link
                              key={`${link.href}-${dd.href}`}
                              href={dd.href}
                              className="block rounded-lg px-3 py-2 text-sm text-foreground/80 hover:bg-muted"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {dd.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="pt-2 flex flex-wrap gap-2">
                    {buttonLinks.map((link) => (
                      <Button key={link.href} asChild className="flex-1">
                        <Link href={link.href} onClick={() => setIsMenuOpen(false)}>
                          {link.label}
                        </Link>
                      </Button>
                    ))}
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </nav>
      </div>
    </header>
  );
}
