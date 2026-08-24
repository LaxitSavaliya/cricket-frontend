"use client";

import { ChevronDown, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface SelectProps {
  id?: string;
  name?: string;
  value?: string | number | null;
  defaultValue?: string | number;
  options?: readonly SelectOption[];
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  onChange?: (event: { target: { value: string; name?: string } }) => void;
  onBlur?: () => void;
}

export function Select({
  id,
  name,
  value: controlledValue,
  defaultValue,
  options = [],
  placeholder = "Select an option",
  error = false,
  disabled = false,
  required = false,
  className = "",
  onChange,
  onBlur,
}: SelectProps) {
  const generatedId = useId();
  const selectId = id || generatedId;
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string | number>(
    defaultValue ?? "",
  );

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? (controlledValue ?? "") : internalValue;

  const selectedOption = options.find(
    (opt) => String(opt.value) === String(currentValue),
  );

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        onBlur?.();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onBlur]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
        onBlur?.();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onBlur]);

  const handleClear = (event: React.MouseEvent | React.KeyboardEvent) => {
    event.stopPropagation();
    if (disabled) return;

    if (!isControlled) {
      setInternalValue("");
    }

    if (onChange) {
      onChange({
        target: {
          value: "",
          name,
        },
      });
    }
  };

  const handleSelect = (optionValue: string | number) => {
    const stringValue = String(optionValue);
    if (!isControlled) {
      setInternalValue(optionValue);
    }
    setIsOpen(false);

    if (onChange) {
      onChange({
        target: {
          value: stringValue,
          name,
        },
      });
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Hidden input for standard form serialization */}
      {name && (
        <input
          type="hidden"
          name={name}
          value={currentValue}
          required={required}
        />
      )}

      {/* Trigger Button */}
      <button
        id={selectId}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => {
          if (!disabled) {
            setIsOpen((prev) => !prev);
          }
        }}
        className={[
          "flex h-11 w-full items-center justify-between rounded-xl border bg-white px-3.5 text-left text-sm transition outline-none cursor-pointer",
          "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500",

          error
            ? isOpen
              ? "border-red-500 ring-4 ring-red-100"
              : "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
            : isOpen
              ? "border-slate-400 ring-4 ring-slate-100"
              : "border-slate-200 hover:border-slate-300 focus:border-slate-400 focus:ring-4 focus:ring-slate-100",

          className,
        ].join(" ")}
      >
        <span
          className={[
            "block truncate",
            selectedOption ? "text-slate-900 font-medium" : "text-slate-400",
          ].join(" ")}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <div className="ml-2 flex items-center gap-1 shrink-0">
          {selectedOption && !disabled && (
            <span
              role="button"
              tabIndex={0}
              aria-label="Clear selection"
              onClick={handleClear}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleClear(e);
                }
              }}
              className="flex h-5 w-5 items-center justify-center cursor-pointer rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            >
              <X className="h-3.5 w-3.5" strokeWidth={3} />
            </span>
          )}

          <span
            className={[
              "flex h-5 w-5 items-center justify-center text-slate-400 cursor-pointer transition-transform duration-200",
              isOpen ? "rotate-180 text-slate-900" : "",
            ].join(" ")}
          >
            <ChevronDown className="h-5 w-5" strokeWidth={2} />
          </span>
        </div>
      </button>

      {/* Custom Dropdown Menu Popover */}
      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1.5 w-full origin-top transform rounded-2xl border border-slate-200/90 bg-white py-2 px-1.5 shadow-xl shadow-slate-900/10 ring-1 ring-slate-900/5 transition-all duration-150">
          <ul
            role="listbox"
            aria-labelledby={selectId}
            className="max-h-60 overflow-y-auto scroll-py-1 space-y-1.5 pr-1"
          >
            {options.map((option) => {
              const isSelected = String(option.value) === String(currentValue);

              return (
                <li
                  key={String(option.value)}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={option.disabled}
                  onClick={() => {
                    if (!option.disabled) {
                      handleSelect(option.value);
                    }
                  }}
                  className={[
                    "flex select-none items-center justify-between rounded-xl px-3.5 py-2.5 text-sm transition",
                    option.disabled
                      ? "cursor-not-allowed text-slate-300 opacity-60"
                      : isSelected
                        ? "cursor-pointer bg-slate-800 font-medium text-white shadow-sm"
                        : "cursor-pointer font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-950",
                  ].join(" ")}
                >
                  <span className="block truncate">{option.label}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
