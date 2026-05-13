import { z } from "zod";

const safeText = z
  .string()
  .trim()
  .min(1, "This field is required.")
  .max(120, "Please keep this under 120 characters.")
  .refine((value) => !/[<>]/.test(value), "Angle brackets are not allowed.")
  .transform((value) => value.replace(/\s+/g, " "));

export const bookingFormSchema = z.object({
  firstName: safeText,
  lastName: safeText,
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(254, "Email is too long.")
    .transform((value) => value.toLowerCase()),
  reasonForVisit: z
    .string()
    .trim()
    .min(1, "Reason for visit is required.")
    .max(2000, "Please keep the reason under 2000 characters.")
    .refine((value) => !/[<>]/.test(value), "Angle brackets are not allowed.")
    .transform((value) => value.replace(/\s+/g, " ")),
});

export type BookingFormSchemaInput = z.input<typeof bookingFormSchema>;
export type BookingFormSchemaOutput = z.output<typeof bookingFormSchema>;
