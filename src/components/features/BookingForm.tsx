"use client";

import { useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useBookings } from "@/hooks/useBookings";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { Textarea } from "@/components/ui/Textarea";
import { bookingFormSchema, type BookingFormSchemaInput } from "@/lib/schemas";
import { Physician, TimeSlot } from "@/types";

interface BookingFormProps {
  physician: Physician;
  selectedSlot?: TimeSlot;
  onSuccess?: () => void;
}

type FormValues = BookingFormSchemaInput;

type FormErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = {
  firstName: "",
  lastName: "",
  email: "",
  reasonForVisit: "",
};

function zodToErrors(error: z.ZodError<FormValues>): FormErrors {
  const fieldErrors: FormErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && key in initialValues) {
      const field = key as keyof FormValues;
      if (!fieldErrors[field]) fieldErrors[field] = issue.message;
    }
  }
  return fieldErrors;
}

export function BookingForm({ physician, selectedSlot, onSuccess }: BookingFormProps) {
  const { createBooking, isHydrated } = useBookings();
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");

  const selectedTime = useMemo(
    () =>
      selectedSlot
        ? new Date(selectedSlot.datetime).toLocaleString(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })
        : null,
    [selectedSlot],
  );

  function updateField(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmissionError("");

    const parsed = bookingFormSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(zodToErrors(parsed.error));
      return;
    }

    if (!selectedSlot) {
      setErrors((current) => ({
        ...current,
        reasonForVisit: "Please select a valid time slot before booking.",
      }));
      return;
    }

    setErrors({});

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const result = createBooking({
      physicianId: physician.id,
      timeSlotId: selectedSlot.id,
      reasonForVisit: parsed.data.reasonForVisit,
      patient: {
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        email: parsed.data.email,
      },
    });

    setIsSubmitting(false);

    if (!result.ok) {
      setSubmissionError(result.error);
      return;
    }

    setValues(initialValues);
    setErrors({});
    toast.success(`Appointment request created for ${selectedTime}.`);
    onSuccess?.();
  }

  if (!isHydrated) {
    return (
      <section className="rounded-2xl border border-zinc-800/50 bg-zinc-900 p-5">
        <p className="text-sm text-zinc-400">Loading booking form...</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-zinc-800/50 bg-zinc-900 p-5">
      <h2 className="text-lg font-semibold text-zinc-100">Patient details</h2>
      <p className="mt-1 text-sm text-zinc-400">
        Booking with {physician.name}
        {selectedTime ? ` on ${selectedTime}` : ". Please select a time slot first."}
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="First Name"
            value={values.firstName}
            onChange={(event) => updateField("firstName", event.target.value)}
            error={errors.firstName}
            autoComplete="given-name"
          />
          <Input
            label="Last Name"
            value={values.lastName}
            onChange={(event) => updateField("lastName", event.target.value)}
            error={errors.lastName}
            autoComplete="family-name"
          />
        </div>

        <Input
          label="Email"
          type="email"
          value={values.email}
          onChange={(event) => updateField("email", event.target.value)}
          error={errors.email}
          autoComplete="email"
        />

        <Textarea
          label="Reason for Visit"
          value={values.reasonForVisit}
          onChange={(event) => updateField("reasonForVisit", event.target.value)}
          error={errors.reasonForVisit}
          placeholder="Describe your concern..."
        />

        {submissionError ? (
          <p className="rounded-xl border border-red-800 bg-red-950/30 px-3 py-2 text-sm text-red-300">
            {submissionError}
          </p>
        ) : null}

        <Button type="submit" className="w-full" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              Booking appointment...
            </>
          ) : (
            "Book appointment"
          )}
        </Button>
      </form>
    </section>
  );
}
