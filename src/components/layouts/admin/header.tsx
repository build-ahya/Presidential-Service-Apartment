"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function AdminHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = (session as any)?.user as
    | { name?: string | null; email?: string | null; image?: string | null; role?: string | null }
    | undefined;

  const segments = (pathname || "/admin").split("/").filter(Boolean);
  const adminIndex = segments.indexOf("admin");
  const trail = adminIndex >= 0 ? segments.slice(adminIndex) : segments;

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const avatarSrc = (user?.image || "/images/default-avatar.jpg").replace(/\)$/, "");
  const roleLabel = user?.role ? capitalize(user.role) : "Member";

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto container px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Brand and Breadcrumbs */}
          <div className="flex items-center gap-4">
            <Link href="/admin/overview" className="flex items-center gap-2">
              <Image
                src="/images/presidential-service-apartment-logo.png"
                alt="Presidential Service Apartment"
                width={24}
                height={24}
                className="opacity-90"
                priority
              />
              <span className="text-sm font-semibold text-zinc-200">Presidential Service Apartment</span>
            </Link>
            <span className="text-zinc-600">/</span>
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
              {trail.map((seg, idx) => {
                const label = seg === "admin" ? "Admin" : capitalize(seg.replace(/[-_]/g, " "));
                const href = "/" + segments.slice(0, idx + 1).join("/");
                const isLast = idx === trail.length - 1;
                return (
                  <React.Fragment key={`${seg}-${idx}`}>
                    <Link
                      href={href}
                      className={
                        isLast
                          ? "text-zinc-200 font-medium"
                          : "text-zinc-400 hover:text-zinc-200 transition-colors"
                      }
                    >
                      {label}
                    </Link>
                    {!isLast && <span className="text-zinc-600">/</span>}
                  </React.Fragment>
                );
              })}
            </nav>
          </div>

          {/* Right: Actions & User */}
          <div className="flex items-center gap-3">
            {/* Placeholder for quick actions */}
            {/* <button className="rounded-md bg-zinc-800 px-3 py-1.5 text-sm text-zinc-200 hover:bg-zinc-700">Search</button> */}

            {/* User menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-3 rounded-md border border-zinc-800 bg-zinc-900/60 px-2.5 py-1.5 hover:bg-zinc-800"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                <Image
                  src={avatarSrc}
                  alt={user?.name || "User"}
                  width={28}
                  height={28}
                  className="rounded-full object-cover"
                />
                <div className="hidden sm:flex flex-col items-start leading-tight">
                  <span className="text-xs font-medium text-zinc-200">{user?.name || "User"}</span>
                  <span className="text-[11px] text-zinc-400">{roleLabel}</span>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4 text-zinc-400"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.094l3.71-3.864a.75.75 0 011.08 1.04l-4.25 4.425a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-56 rounded-md border border-zinc-800 bg-zinc-900 shadow-lg"
                >
                  <div className="px-3 py-2 border-b border-zinc-800">
                    <p className="text-sm font-medium text-zinc-200">{user?.name || "User"}</p>
                    <p className="text-xs text-zinc-400">{user?.email || ""}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/admin/overview"
                      className="block px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                      role="menuitem"
                      onClick={() => setMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/admin"
                      className="block px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
                      role="menuitem"
                      onClick={() => setMenuOpen(false)}
                    >
                      Admin Home
                    </Link>
                    <button
                      className="block w-full px-3 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-800"
                      role="menuitem"
                      onClick={() => {
                        setMenuOpen(false);
                        signOut({ callbackUrl: "/admin" });
                      }}
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto container px-6 py-3">
        <AdminNav pathname={pathname || "/admin"} />
      </div>
    </header>
  );
}

function AdminNav({ pathname }: { pathname: string }) {
  const links = [
    { href: "/admin/overview", label: "Overview" },
    { href: "/admin/posts", label: "Posts" },
    { href: "/admin/reservations", label: "Reservations" },
    { href: "/admin/requests", label: "Requests" },
    { href: "/admin/settings", label: "Settings" },
    { href: "/admin/profile", label: "Profile" },
  ];

  return (
    <nav className="flex items-center gap-2 overflow-x-auto scrollbar-none">
      {links.map((l) => {
        const active = pathname === l.href || pathname.startsWith(l.href + "/");
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={
              active
                ? "rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-200"
                : "rounded-md border border-zinc-800 bg-zinc-900/40 px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-zinc-200"
            }
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}