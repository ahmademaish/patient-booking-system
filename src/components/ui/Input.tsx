import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, id, error, className, ...props },
  ref,
) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <label htmlFor={inputId} className="flex flex-col gap-2 text-sm font-medium text-zinc-200">
      <span>{label}</span>
      <input
        ref={ref}
        id={inputId}
        className={cn(
          "h-11 min-h-11 rounded-xl border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-100 transition-all duration-300 ease-in-out focus-visible:border-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400",
          error && "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/70",
          className,
        )}
        {...props}
      />
      {error ? <span className="text-xs text-red-400">{error}</span> : null}
    </label>
  );
});
