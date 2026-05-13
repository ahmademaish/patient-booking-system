export type BookingStatus = "Pending" | "Confirmed" | "Cancelled";

export interface Physician {
  id: string;
  name: string;
  specialty: string;
  avatarUrl: string;
  bio: string;
}

export interface TimeSlot {
  id: string;
  physicianId: string;
  datetime: string;
  isAvailable: boolean;
}

export interface Patient {
  firstName: string;
  lastName: string;
  email: string;
}

export interface Booking {
  id: string;
  patient: Patient;
  physicianId: string;
  timeSlotId: string;
  reasonForVisit: string;
  status: BookingStatus;
  createdAt: string;
}
