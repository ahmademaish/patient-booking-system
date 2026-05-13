"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useBookings } from "@/hooks/useBookings";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ModalOverlay } from "@/components/ui/ModalOverlay";
import { Select } from "@/components/ui/Select";
import { Booking, BookingStatus } from "@/types";

interface CommandModalProps {
  booking: Booking | null;
  open: boolean;
  onClose: () => void;
}

const STATUS_OPTIONS: Array<{ label: string; value: BookingStatus }> = [
  { label: "Pending", value: "Pending" },
  { label: "Confirmed", value: "Confirmed" },
  { label: "Cancelled", value: "Cancelled" },
];

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function CommandModal({ booking, open, onClose }: CommandModalProps) {
  const { getPhysicianById, getTimeSlotById, updateBookingStatus, deleteBooking } = useBookings();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const physician = useMemo(
    () => (booking ? getPhysicianById(booking.physicianId) : undefined),
    [booking, getPhysicianById],
  );

  const slot = useMemo(
    () => (booking ? getTimeSlotById(booking.timeSlotId) : undefined),
    [booking, getTimeSlotById],
  );

  if (!booking) return null;
  const activeBooking = booking;

  function handleClose() {
    setConfirmDelete(false);
    onClose();
  }

  function handleDeleteClick() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    deleteBooking(activeBooking.id);
    toast.success("Appointment deleted successfully.");
    handleClose();
  }

  return (
    <ModalOverlay open={open} onClose={handleClose}>
      <section className="w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-zinc-100">
            {activeBooking.patient.firstName} {activeBooking.patient.lastName}
          </h2>
          <p className="text-sm text-zinc-400">{activeBooking.patient.email}</p>
          <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-300">
            <span>{physician?.name ?? "Unknown physician"}</span>
            <span className="text-zinc-600">•</span>
            <span>{slot ? formatDateTime(slot.datetime) : "Time unavailable"}</span>
            <Badge status={activeBooking.status} />
          </div>
        </div>

        <div className="mt-5 break-words whitespace-pre-wrap overflow-y-auto max-h-[40vh] w-full p-4 bg-zinc-950 rounded-lg text-zinc-300">
          {activeBooking.reasonForVisit}
        </div>

        <div className="mt-6 grid gap-4 border-t border-zinc-800 pt-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <Select
            label="Update status"
            value={activeBooking.status}
            options={STATUS_OPTIONS}
            onChange={(event) =>
              updateBookingStatus(activeBooking.id, event.target.value as BookingStatus)
            }
          />

          <Button
            variant={confirmDelete ? "danger" : "secondary"}
            onClick={handleDeleteClick}
            className="w-full sm:w-auto"
            aria-label={confirmDelete ? "Confirm deletion" : "Delete appointment"}
          >
            {confirmDelete ? "Click to confirm deletion" : "Delete appointment"}
          </Button>
        </div>
      </section>
    </ModalOverlay>
  );
}
