"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeartPulse } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Patient Portal" },
  { href: "/admin", label: "Staff Console" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/50 bg-zinc-950/95 backdrop-blur">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-2 sm:flex-nowrap sm:px-6 sm:py-0">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl p-1 text-zinc-100 transition-all duration-300 ease-in-out active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-800/50 bg-zinc-900">
            <HeartPulse className="h-4 w-4" />
          </span>
          <span className="text-sm font-semibold tracking-wide">NovaCare</span>
        </Link>

        <nav className="ml-auto inline-flex items-center gap-1.5 sm:gap-2">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            const mobileLabel = link.href === "/" ? "Portal" : "Console";

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "inline-flex h-10 min-h-10 items-center rounded-xl border px-2.5 text-xs font-medium transition-all duration-300 ease-in-out active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 sm:px-3 sm:text-sm",
                  isActive
                    ? "border-zinc-700 bg-zinc-900 text-zinc-100"
                    : "border-zinc-800/50 bg-zinc-950 text-zinc-400 hover:border-zinc-700 hover:text-zinc-100",
                )}
              >
                <span className="sm:hidden">{mobileLabel}</span>
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
