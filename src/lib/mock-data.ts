import { Physician, TimeSlot } from "@/types";

function createDate(dayOffset: number, hour: number, minute: number): string {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

export const PHYSICIANS: Physician[] = [
  {
    id: "phys-1",
    name: "Dr. Sophia Martinez",
    specialty: "Family Medicine",
    avatarUrl: "https://i.pravatar.cc/150?u=phys-1",
    bio: "Board-certified Family Physician with over 12 years of clinical experience. Focuses on holistic preventive care and long-term wellness plans.",
  },
  {
    id: "phys-2",
    name: "Dr. Daniel Kim",
    specialty: "Cardiology",
    avatarUrl: "https://i.pravatar.cc/150?u=phys-2",
    bio: "Renowned Cardiologist specializing in interventional procedures, cardiovascular risk assessment, and complex heart rhythm concerns.",
  },
  {
    id: "phys-3",
    name: "Dr. Amina Rahman",
    specialty: "Dermatology",
    avatarUrl: "https://i.pravatar.cc/150?u=phys-3",
    bio: "Board-certified Dermatologist treating complex medical skin conditions. Passionate about evidence-based clinical approaches and patient education.",
  },
];

function slotsForPhysician(physicianId: string, base: number): TimeSlot[] {
  const templates = [
    { day: 1, hour: 9, minute: 0, isAvailable: true },
    { day: 1, hour: 10, minute: 30, isAvailable: true },
    { day: 1, hour: 11, minute: 30, isAvailable: true },
    { day: 1, hour: 13, minute: 0, isAvailable: true },
    { day: 1, hour: 14, minute: 30, isAvailable: true },
    { day: 1, hour: 16, minute: 0, isAvailable: true },
    { day: 2, hour: 9, minute: 0, isAvailable: false },
    { day: 2, hour: 13, minute: 30, isAvailable: false },
  ];

  return templates.map((item, index) => ({
    id: `slot-${base + index}`,
    physicianId,
    datetime: createDate(item.day, item.hour, item.minute),
    isAvailable: item.isAvailable,
  }));
}

export const TIME_SLOTS: TimeSlot[] = [
  ...slotsForPhysician("phys-1", 100),
  ...slotsForPhysician("phys-2", 200),
  ...slotsForPhysician("phys-3", 300),
];
