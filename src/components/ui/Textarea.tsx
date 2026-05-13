import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, id, error, className, ...props },
  ref,
) {
  const textareaId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <label htmlFor={textareaId} className="flex flex-col gap-2 text-sm font-medium text-zinc-200">
      <span>{label}</span>
      <textarea
        ref={ref}
        id={textareaId}
        className={cn(
          "min-h-32 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 transition-all duration-300 ease-in-out focus-visible:border-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400",
          error && "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/70",
          className,
        )}
        {...props}
      />
      {error ? <span className="text-xs text-red-400">{error}</span> : null}
    </label>
  );
});
