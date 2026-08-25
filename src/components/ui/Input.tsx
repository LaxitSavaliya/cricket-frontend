import type { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function Input({ error = false, className = "", ...props }: InputProps) {
  return (
    <input
      {...props}
      aria-invalid={error || undefined}
      className={[
        "h-11 w-full rounded-xl border bg-white px-3.5",
        "text-sm text-slate-900 outline-none transition",
        "placeholder:text-slate-400",
        "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500",

        error
          ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
          : "border-slate-200 focus:border-slate-400 focus:ring-4 focus:ring-slate-100",

        className,
      ].join(" ")}
    />
  );
}
