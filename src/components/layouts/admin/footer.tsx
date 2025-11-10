"use client";

export default function AdminFooter() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-900/60">
      <div className="mx-auto container px-6 py-4 text-xs text-zinc-500">
        © {new Date().getFullYear()} Presidential Service Apartment. Admin Console.
      </div>
    </footer>
  );
}