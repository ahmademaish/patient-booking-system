import { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface Option {
  label: string;
  value: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[];
  label?: string;
}

export function Select({ options, label, id, className, ...props }: SelectProps) {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <label htmlFor={selectId} className="flex flex-col gap-2 text-sm font-medium text-zinc-200">
      {label ? <span>{label}</span> : null}
      <select
        id={selectId}
        className={cn(
          "h-11 min-h-11 rounded-xl border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-100 transition-all duration-300 ease-in-out focus-visible:border-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400",
          className,
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
