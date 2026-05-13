import { Physician } from "@/types";
import { DoctorCard } from "@/components/features/DoctorCard";

export function DoctorGrid({ physicians }: { physicians: Physician[] }) {
  return (
    <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {physicians.map((physician) => (
        <DoctorCard key={physician.id} physician={physician} />
      ))}
    </div>
  );
}
