import type { ReactNode } from "react";

interface FormFieldProps {
  id?: string;
  label?: string;
  htmlFor?: string;
  children: ReactNode;

  required?: boolean;
  optional?: boolean;

  description?: string;
  error?: string | null;

  className?: string;
}

export function FormField({
  id,
  label,
  htmlFor,
  children,
  required = false,
  optional = false,
  description,
  error,
  className = "",
}: FormFieldProps) {
  return (
    <div id={id} className={className}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700"
        >
          {label}

          {required && (
            <span className="text-red-500" aria-hidden="true">
              *
            </span>
          )}

          {optional && !required && (
            <span className="text-xs font-normal text-slate-400">Optional</span>
          )}
        </label>
      )}

      {children}

      {error ? (
        <p role="alert" className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      ) : description ? (
        <p className="mt-1.5 text-xs text-slate-500">{description}</p>
      ) : null}
    </div>
  );
}
