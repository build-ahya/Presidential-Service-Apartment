'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  BedDouble,
  Building2,
  CalendarCheck,
  ChevronsUpDown,
  ExternalLink,
  FileText,
  Images,
  LayoutDashboard,
  LogOut,
  Newspaper,
  Settings,
  Users,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Image from 'next/image';
import React from 'react';
import { CommandMenu } from './command-menu';
import { ThemeToggle } from './theme-toggle';
import type { UserRole } from '@/models/user';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType;
  exact?: boolean;
}

const NAV: { label: string; adminOnly?: boolean; items: NavItem[] }[] = [
  {
    label: 'Manage',
    items: [
      { title: 'Overview', href: '/admin', icon: LayoutDashboard, exact: true },
      { title: 'Reservations', href: '/admin/reservations', icon: CalendarCheck },
      { title: 'Apartments', href: '/admin/apartments', icon: BedDouble },
      { title: 'Properties', href: '/admin/properties', icon: Building2 },
    ],
  },
  {
    label: 'Website',
    items: [
      { title: 'Pages & content', href: '/admin/content', icon: FileText },
      { title: 'Blog', href: '/admin/blog', icon: Newspaper },
      { title: 'Media', href: '/admin/media', icon: Images },
      { title: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
  {
    label: 'Admin',
    adminOnly: true,
    items: [{ title: 'Team', href: '/admin/users', icon: Users }],
  },
];

const SEGMENT_LABELS: Record<string, string> = {
  admin: 'Dashboard',
  reservations: 'Reservations',
  apartments: 'Apartments',
  properties: 'Properties',
  content: 'Pages & content',
  blog: 'Blog',
  media: 'Media',
  settings: 'Settings',
  users: 'Team',
  new: 'New',
};

function Crumbs({ pathname }: { pathname: string }) {
  const parts = pathname.split('/').filter(Boolean);
  const crumbs = parts.map((seg, i) => ({
    href: '/' + parts.slice(0, i + 1).join('/'),
    label: SEGMENT_LABELS[seg] ?? (parts[i - 1] === 'content' ? SEGMENT_LABELS[seg] ?? seg : 'Details'),
  }));
  return (
    <Breadcrumb className='hidden sm:block'>
      <BreadcrumbList>
        {crumbs.map((c, i) => (
          <React.Fragment key={c.href}>
            {i > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {i === crumbs.length - 1 ? (
                <BreadcrumbPage>{c.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={c.href}>{c.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export function AdminShell({
  user,
  siteName,
  children,
}: {
  user: { name: string; email: string; role: UserRole };
  siteName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const initials = (user.name || user.email).slice(0, 2).toUpperCase();
  const groups = NAV.filter((g) => !g.adminOnly || user.role === 'admin');
  const commandLinks = groups.flatMap((g) => g.items.map((i) => ({ title: i.title, href: i.href, group: g.label })));

  return (
    <SidebarProvider>
      <Sidebar collapsible='icon' variant='inset'>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size='lg' asChild className='h-12'>
                <Link href='/admin' aria-label={siteName}>
                  {/* Expanded: full logo (colored on light, white on dark). Collapsed: monogram. */}
                  <span className='hidden size-8 shrink-0 place-items-center rounded-lg bg-primary font-display font-bold text-primary-foreground group-data-[collapsible=icon]:grid'>
                    {siteName[0]}
                  </span>
                  <span className='group-data-[collapsible=icon]:hidden'>
                    <Image src='/images/presidential-service-colored-logo.svg' alt={siteName} width={813} height={211} unoptimized className='h-9 w-auto dark:hidden' />
                    <Image src='/images/presidential-service-logo.svg' alt={siteName} width={813} height={211} unoptimized className='hidden h-9 w-auto dark:block' />
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          {groups.map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => {
                    const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                          <Link href={item.href}>
                            <item.icon />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip='View website'>
                <a href='/' target='_blank' rel='noreferrer'>
                  <ExternalLink />
                  <span>View website</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton size='lg' className='data-[state=open]:bg-sidebar-accent'>
                    <Avatar className='size-8 rounded-lg'>
                      <AvatarFallback className='rounded-lg bg-primary text-xs font-semibold text-primary-foreground'>{initials}</AvatarFallback>
                    </Avatar>
                    <span className='grid flex-1 text-left text-sm leading-tight'>
                      <span className='truncate font-medium'>{user.name || user.email}</span>
                      <span className='truncate text-xs text-muted-foreground capitalize'>{user.role}</span>
                    </span>
                    <ChevronsUpDown className='ml-auto size-4' />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side='top' align='start' className='w-(--radix-dropdown-menu-trigger-width) min-w-56'>
                  <DropdownMenuLabel className='truncate font-normal text-muted-foreground'>{user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/admin/login' })}>
                      <LogOut /> Sign out
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className='flex h-14 shrink-0 items-center gap-2 border-b px-4'>
          <SidebarTrigger className='-ml-1' />
          <Separator orientation='vertical' className='mr-1 h-4' />
          <Crumbs pathname={pathname} />
          <div className='ml-auto flex items-center gap-1'>
            <CommandMenu links={commandLinks} />
            <ThemeToggle />
          </div>
        </header>
        <div className='flex-1 p-4 md:p-6 lg:p-8'>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
