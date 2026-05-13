"use client";

import { useMemo, useState } from "react";
import { CalendarClock, ClipboardList } from "lucide-react";
import { useBookings } from "@/hooks/useBookings";
import { Badge } from "@/components/ui/Badge";
import { Booking } from "@/types";
import { CommandModal } from "@/components/features/CommandModal";

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function initials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function AdminTable() {
  const { bookings, getPhysicianById, getTimeSlotById, isHydrated } = useBookings();
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  const selectedBooking = useMemo(
    () => bookings.find((booking) => booking.id === selectedBookingId) ?? null,
    [bookings, selectedBookingId],
  );

  if (!isHydrated) {
    return (
      <section className="rounded-2xl border border-zinc-800/50 bg-zinc-900 py-14 text-center">
        <h2 className="text-sm font-medium text-zinc-400">Loading appointments...</h2>
      </section>
    );
  }

  if (bookings.length === 0) {
    return (
      <section className="rounded-2xl border border-zinc-800/50 bg-zinc-900 py-14 text-center">
        <ClipboardList className="mx-auto mb-3 h-9 w-9 text-zinc-500" />
        <h2 className="text-lg font-semibold text-zinc-100">No upcoming appointments.</h2>
      </section>
    );
  }

  return (
    <>
      <section className="overflow-hidden rounded-2xl border border-zinc-800/50 bg-zinc-900">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full divide-y divide-zinc-800/50">
            <thead className="bg-zinc-900">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Patient Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Doctor
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Date/Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Reason
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {bookings.map((booking) => {
                const physician = getPhysicianById(booking.physicianId);
                const slot = getTimeSlotById(booking.timeSlotId);
                return (
                  <TableRow
                    key={booking.id}
                    booking={booking}
                    doctorName={physician?.name ?? "Unknown physician"}
                    datetime={slot ? formatDateTime(slot.datetime) : "Unavailable"}
                    onSelect={() => setSelectedBookingId(booking.id)}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <CommandModal
        key={selectedBooking?.id ?? "no-booking"}
        booking={selectedBooking}
        open={Boolean(selectedBooking)}
        onClose={() => setSelectedBookingId(null)}
      />
    </>
  );
}

function TableRow({
  booking,
  doctorName,
  datetime,
  onSelect,
}: {
  booking: Booking;
  doctorName: string;
  datetime: string;
  onSelect: () => void;
}) {
  return (
    <tr
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") onSelect();
      }}
      className="cursor-pointer transition-all duration-300 ease-in-out hover:bg-zinc-950/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 bg-zinc-950 text-xs font-semibold text-zinc-200">
            {initials(booking.patient.firstName, booking.patient.lastName)}
          </div>
          <span className="text-sm text-zinc-100">
            {booking.patient.firstName} {booking.patient.lastName}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-zinc-300">{doctorName}</td>
      <td className="whitespace-nowrap px-4 py-3 text-sm text-zinc-300">
        <span className="inline-flex items-center gap-1">
          <CalendarClock className="h-4 w-4 text-zinc-500" />
          {datetime}
        </span>
      </td>
      <td className="px-4 py-3">
        <Badge status={booking.status} />
      </td>
      <td className="px-4 py-3 text-sm text-zinc-300">
        <p className="truncate max-w-[200px] md:max-w-[300px]">{booking.reasonForVisit}</p>
      </td>
    </tr>
  );
}
