"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { DoctorGrid } from "@/components/features/DoctorGrid";
import { useBookings } from "@/hooks/useBookings";

export default function Home() {
  const { physicians, isHydrated } = useBookings();

  if (!isHydrated) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <section className="rounded-2xl border border-zinc-800/50 bg-zinc-900 p-6">
          <p className="text-sm text-zinc-400">Loading NovaCare portal...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <section className="rounded-2xl border border-zinc-800/50 bg-zinc-900 p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <p className="inline-flex items-center gap-2 rounded-full border border-zinc-800/50 bg-zinc-950 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-300">
              Patient booking portal
            </p>
            <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
              Simplified access to world-class care.
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-zinc-400">
              Connect directly with our board-certified specialists in a frictionless, secure
              portal.
            </p>
          </div>
          <Link
            href="/admin"
            className="inline-flex h-11 min-h-11 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-950 px-4 text-sm font-semibold text-zinc-100 transition-all duration-300 ease-in-out active:scale-95 hover:bg-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
          >
            Open Staff Console
          </Link>
        </div>
        <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-zinc-800/50 bg-zinc-950 px-3 py-2 text-sm text-zinc-400">
          <ShieldCheck className="h-4 w-4 text-zinc-300" />
          Designed for reliable booking decisions with safe slot handling and clean validation.
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-zinc-50">Choose your physician</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Click a provider to view appointment times and continue to booking.
        </p>

        <DoctorGrid physicians={physicians} />
      </section>
    </main>
  );
}
