import { BookingStatus } from "@/types";
import { cn } from "@/lib/utils";

const statusStyles: Record<BookingStatus, string> = {
  Pending: "border-amber-600/40 bg-zinc-900 text-amber-300",
  Confirmed: "border-emerald-600/40 bg-zinc-900 text-emerald-300",
  Cancelled: "border-red-600/40 bg-zinc-900 text-red-300",
};

export function Badge({ status, className }: { status: BookingStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        statusStyles[status],
        className,
      )}
    >
      {status}
    </span>
  );
}
