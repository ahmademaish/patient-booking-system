import { redirect } from "next/navigation";
import { BookingExperience } from "@/components/features/BookingExperience";

interface BookingPageProps {
  searchParams: Promise<{ physicianId?: string }>;
}

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const { physicianId } = await searchParams;

  if (!physicianId) {
    redirect("/");
  }

  return <BookingExperience physicianId={physicianId} />;
}
