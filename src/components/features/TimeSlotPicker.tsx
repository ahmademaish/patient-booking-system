"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Clock3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { TimeSlot } from "@/types";

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selectedSlotId?: string;
  onSelect: (slotId: string) => void;
}

function isPast(datetimeIso: string): boolean {
  return new Date(datetimeIso).getTime() < Date.now();
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function TimeSlotPicker({ slots, selectedSlotId, onSelect }: TimeSlotPickerProps) {
  const groupedByDate = useMemo(() => {
    const sorted = [...slots].sort(
      (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime(),
    );

    return sorted.reduce<Record<string, TimeSlot[]>>((accumulator, slot) => {
      const dateKey = new Date(slot.datetime).toDateString();
      const current = accumulator[dateKey] ?? [];
      accumulator[dateKey] = [...current, slot];
      return accumulator;
    }, {});
  }, [slots]);

  const dateKeys = Object.keys(groupedByDate);
  const [activeDate, setActiveDate] = useState(dateKeys[0] ?? "");
  const resolvedDate = dateKeys.includes(activeDate) ? activeDate : dateKeys[0] ?? "";
  const slotsForDate = groupedByDate[resolvedDate] ?? [];

  const morning = slotsForDate.filter((slot) => new Date(slot.datetime).getHours() < 12);
  const afternoon = slotsForDate.filter((slot) => new Date(slot.datetime).getHours() >= 12);

  return (
    <section className="rounded-2xl border border-zinc-800/50 bg-zinc-900 p-5">
      <div className="mb-4 flex items-center gap-2">
        <CalendarDays className="h-5 w-5 text-zinc-300" />
        <h3 className="text-sm font-semibold text-zinc-100">Select a time slot</h3>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {dateKeys.map((dateKey) => (
          <button
            key={dateKey}
            type="button"
            onClick={() => setActiveDate(dateKey)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-300 ease-in-out active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400",
              resolvedDate === dateKey
                ? "border-zinc-600 bg-zinc-800 text-zinc-100"
                : "border-zinc-800/50 bg-zinc-950 text-zinc-400 hover:border-zinc-700",
            )}
          >
            {formatDate(dateKey)}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <SlotGroup
          title="Morning"
          slots={morning}
          selectedSlotId={selectedSlotId}
          onSelect={onSelect}
        />
        <SlotGroup
          title="Afternoon"
          slots={afternoon}
          selectedSlotId={selectedSlotId}
          onSelect={onSelect}
        />
      </div>
    </section>
  );
}

function SlotGroup({
  title,
  slots,
  selectedSlotId,
  onSelect,
}: {
  title: string;
  slots: TimeSlot[];
  selectedSlotId?: string;
  onSelect: (slotId: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">{title}</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {slots.map((slot) => {
          const disabled = !slot.isAvailable || isPast(slot.datetime);

          return (
            <button
              key={slot.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(slot.id)}
              className={cn(
                "flex min-h-11 items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-all duration-300 ease-in-out active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400",
                selectedSlotId === slot.id
                  ? "border-zinc-200 bg-zinc-100 text-zinc-900"
                  : "border-zinc-800/50 bg-zinc-950 text-zinc-300 hover:border-zinc-700",
                disabled && "cursor-not-allowed border-zinc-800 bg-zinc-900 text-zinc-600",
              )}
            >
              <Clock3 className="h-4 w-4" />
              {formatTime(slot.datetime)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
