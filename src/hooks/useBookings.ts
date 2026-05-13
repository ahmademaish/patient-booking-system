import { useBookingContext } from "@/context/BookingContext";

export function useBookings() {
  return useBookingContext();
}
