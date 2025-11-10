"use client";

import { useSession } from "next-auth/react";
import AdminHeader from "./admin/header";
import AdminFooter from "./admin/footer";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const role = (session as any)?.user?.role as string | undefined;

  const isAdmin = role && role !== "customer";

  useEffect(() => {    
    if (pathname === "/admin" && isAdmin) {
      router.push("/admin/overview");
    }
  }, [isAdmin, pathname, router]);

  return (
    <>
      {isAdmin && <AdminHeader />}
      {children}
      {isAdmin && <AdminFooter />}
    </>
  );
}