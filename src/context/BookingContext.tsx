"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { PHYSICIANS, TIME_SLOTS } from "@/lib/mock-data";
import { Booking, BookingStatus, Patient, Physician, TimeSlot } from "@/types";

interface CreateBookingInput {
  patient: Patient;
  physicianId: string;
  timeSlotId: string;
  reasonForVisit: string;
}

interface BookingContextValue {
  isHydrated: boolean;
  physicians: Physician[];
  timeSlots: TimeSlot[];
  bookings: Booking[];
  createBooking: (input: CreateBookingInput) => { ok: true; booking: Booking } | { ok: false; error: string };
  updateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  deleteBooking: (bookingId: string) => void;
  getPhysicianById: (id: string) => Physician | undefined;
  getTimeSlotById: (id: string) => TimeSlot | undefined;
  getSlotsForPhysician: (physicianId: string) => TimeSlot[];
}

const BookingContext = createContext<BookingContextValue | undefined>(undefined);

function isPast(datetimeIso: string): boolean {
  return new Date(datetimeIso).getTime() < Date.now();
}

function createBookingId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `booking-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const subscribe = useCallback(() => () => undefined, []);
  const isHydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(() =>
    TIME_SLOTS.map((slot) => ({ ...slot })),
  );
  const [bookings, setBookings] = useState<Booking[]>([]);
  const physicians = PHYSICIANS;

  const getPhysicianById = useCallback(
    (id: string) => physicians.find((physician) => physician.id === id),
    [physicians],
  );

  const getTimeSlotById = useCallback(
    (id: string) => timeSlots.find((slot) => slot.id === id),
    [timeSlots],
  );

  const getSlotsForPhysician = useCallback(
    (physicianId: string) =>
      timeSlots
        .filter((slot) => slot.physicianId === physicianId)
        .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()),
    [timeSlots],
  );

  const createBooking = useCallback(
    (input: CreateBookingInput) => {
      if (!isHydrated) {
        return { ok: false as const, error: "Booking data is still loading. Please try again." };
      }

      const slot = timeSlots.find((value) => value.id === input.timeSlotId);

      if (!slot) return { ok: false as const, error: "Selected time slot was not found." };
      if (slot.physicianId !== input.physicianId) {
        return { ok: false as const, error: "Selected slot does not match physician." };
      }
      if (!slot.isAvailable || isPast(slot.datetime)) {
        return { ok: false as const, error: "This slot is no longer available." };
      }

      const booking: Booking = {
        id: createBookingId(),
        patient: input.patient,
        physicianId: input.physicianId,
        timeSlotId: input.timeSlotId,
        reasonForVisit: input.reasonForVisit,
        status: "Pending",
        createdAt: new Date().toISOString(),
      };

      setBookings((current) => [booking, ...current]);
      setTimeSlots((current) =>
        current.map((value) =>
          value.id === input.timeSlotId ? { ...value, isAvailable: false } : value,
        ),
      );

      return { ok: true as const, booking };
    },
    [isHydrated, timeSlots],
  );

  const updateBookingStatus = useCallback((bookingId: string, status: BookingStatus) => {
    setBookings((current) =>
      current.map((booking) => (booking.id === bookingId ? { ...booking, status } : booking)),
    );
  }, []);

  const deleteBooking = useCallback((bookingId: string) => {
    setBookings((current) => {
      const removed = current.find((booking) => booking.id === bookingId);
      if (!removed) return current;

      setTimeSlots((slots) =>
        slots.map((slot) =>
          slot.id === removed.timeSlotId ? { ...slot, isAvailable: true } : slot,
        ),
      );

      return current.filter((booking) => booking.id !== bookingId);
    });
  }, []);

  const value = useMemo(
    () => ({
      isHydrated,
      physicians,
      timeSlots,
      bookings,
      createBooking,
      updateBookingStatus,
      deleteBooking,
      getPhysicianById,
      getTimeSlotById,
      getSlotsForPhysician,
    }),
    [
      isHydrated,
      physicians,
      timeSlots,
      bookings,
      createBooking,
      updateBookingStatus,
      deleteBooking,
      getPhysicianById,
      getTimeSlotById,
      getSlotsForPhysician,
    ],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBookingContext(): BookingContextValue {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBookingContext must be used inside BookingProvider.");
  }
  return context;
}
