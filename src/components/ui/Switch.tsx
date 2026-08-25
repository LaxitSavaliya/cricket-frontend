"use client";

import type { KeyboardEvent, MouseEvent } from "react";

export interface SwitchProps {
  id?: string;
  name?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  activeColor?: string;
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  onChange?: (checked: boolean) => void;
}

export function Switch({
  id,
  name,
  checked = false,
  disabled = false,
  activeColor = "bg-slate-950",
  className = "",
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  onChange,
}: SwitchProps) {
  const handleToggle = (
    event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    if (disabled) return;
    onChange?.(!checked);
  };

  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      disabled={disabled}
      onClick={handleToggle}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          handleToggle(event);
        }
      }}
      className={[
        "relative inline-flex h-6.75 w-12.25 shrink-0 cursor-pointer rounded-full border-2 pt-[0.5px] border-transparent transition-colors duration-200 ease-in-out outline-none",
        "focus-visible:ring-4 focus-visible:ring-slate-100",
        "disabled:cursor-not-allowed disabled:opacity-60",
        checked ? activeColor : "bg-slate-200",
        className,
      ].join(" ")}
    >
      {name && (
        <input type="hidden" name={name} value={checked ? "true" : "false"} />
      )}

      <span
        aria-hidden="true"
        className={[
          "pointer-events-none inline-block h-5 w-5 ml-0.75 mt-px transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
          checked ? "translate-x-5" : "translate-x-0",
        ].join(" ")}
      />
    </button>
  );
}
