"use client";

import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { useMemo, useState } from "react";
import { useBookings } from "@/hooks/useBookings";
import { BookingForm } from "@/components/features/BookingForm";
import { TimeSlotPicker } from "@/components/features/TimeSlotPicker";

export function BookingExperience({ physicianId }: { physicianId: string }) {
  const { getPhysicianById, getTimeSlotById, getSlotsForPhysician, isHydrated } = useBookings();
  const physician = getPhysicianById(physicianId);
  const slots = getSlotsForPhysician(physicianId);
  const [selectedSlotId, setSelectedSlotId] = useState<string>();

  const selectedSlot = useMemo(
    () => (selectedSlotId ? getTimeSlotById(selectedSlotId) : undefined),
    [selectedSlotId, getTimeSlotById],
  );

  if (!isHydrated) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        <section className="rounded-2xl border border-zinc-800/50 bg-zinc-900 p-6">
          <p className="text-sm text-zinc-400">Loading physician availability...</p>
        </section>
      </main>
    );
  }

  if (!physician) {
    return (
      <main className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6">
        <section className="rounded-2xl border border-zinc-800/50 bg-zinc-900 p-6 text-center">
          <AlertTriangle className="mx-auto mb-3 h-8 w-8 text-zinc-300" />
          <h1 className="text-xl font-semibold text-zinc-100">Physician not found</h1>
          <p className="mt-2 text-sm text-zinc-400">
            The provider you selected is unavailable. Please return to the physician list.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex h-11 min-h-11 items-center rounded-xl border border-zinc-700 bg-zinc-100 px-4 text-sm font-semibold text-zinc-900 transition-all duration-300 ease-in-out active:scale-95 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
          >
            Back to physicians
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 rounded-lg px-1 text-sm font-medium text-zinc-400 transition-all duration-300 ease-in-out active:scale-95 hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to patient portal
      </Link>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_1fr]">
        <div className="space-y-5 rounded-2xl border border-zinc-800/50 bg-zinc-900 p-6">
          <div className="flex items-center gap-3">
            <Image
              src={physician.avatarUrl}
              alt={`${physician.name} profile`}
              width={68}
              height={68}
              className="h-17 w-17 rounded-full border border-zinc-800 object-cover"
            />
            <div>
              <h1 className="text-2xl font-semibold text-zinc-100">{physician.name}</h1>
              <p className="text-sm text-zinc-400">{physician.specialty}</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-zinc-300">{physician.bio}</p>

          <TimeSlotPicker
            slots={slots}
            selectedSlotId={selectedSlotId}
            onSelect={(slotId) => setSelectedSlotId(slotId)}
          />
        </div>

        <BookingForm
          physician={physician}
          selectedSlot={selectedSlot}
          onSuccess={() => setSelectedSlotId(undefined)}
        />
      </section>
    </main>
  );
}
