'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import {
  BedDouble,
  Building2,
  CalendarCheck,
  ExternalLink,
  FileText,
  Images,
  LayoutDashboard,
  LogOut,
  Moon,
  Newspaper,
  Settings,
  Sun,
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
  const { resolvedTheme, setTheme } = useTheme();
  const initials = (user.name || user.email).slice(0, 2).toUpperCase();

  return (
    <SidebarProvider>
      <Sidebar collapsible='icon'>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size='lg' asChild>
                <Link href='/admin'>
                  <span className='grid size-8 shrink-0 place-items-center rounded-lg bg-primary font-display font-bold text-primary-foreground'>
                    {siteName[0]}
                  </span>
                  <span className='grid flex-1 text-left text-sm leading-tight'>
                    <span className='truncate font-semibold'>{siteName}</span>
                    <span className='truncate text-xs text-muted-foreground'>Admin</span>
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          {NAV.filter((g) => !g.adminOnly || user.role === 'admin').map((group) => (
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
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className='sticky top-0 z-20 flex h-14 items-center gap-2 border-b bg-background/90 px-4 backdrop-blur'>
          <SidebarTrigger />
          <Separator orientation='vertical' className='mr-2 h-4' />
          <div className='ml-auto flex items-center gap-1'>
            <DropdownMenu>
              <DropdownMenuTrigger className='flex items-center gap-2 rounded-full p-1 pr-3 outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring'>
                <Avatar className='size-8'>
                  <AvatarFallback className='bg-secondary text-xs text-secondary-foreground'>{initials}</AvatarFallback>
                </Avatar>
                <span className='hidden text-left text-sm leading-tight sm:block'>
                  <span className='block font-medium'>{user.name || user.email}</span>
                  <span className='block text-xs text-muted-foreground capitalize'>{user.role}</span>
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-56'>
                <DropdownMenuLabel className='truncate font-normal text-muted-foreground'>{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>
                    {resolvedTheme === 'dark' ? <Sun /> : <Moon />}
                    {resolvedTheme === 'dark' ? 'Light mode' : 'Dark mode'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/admin/login' })}>
                    <LogOut /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <div className='flex-1 p-4 md:p-8'>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
