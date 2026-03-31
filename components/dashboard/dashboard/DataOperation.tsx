 "use client";

import cn from "@/lib/utils";
import { ChevronDown, Check } from "lucide-react";
import { ChangeEvent, useEffect, useId, useRef, useState } from "react";

export default function DataOperation({
  value,
  options,
  onChange,
  className,
}: {
  value: string;
  options: string[];
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const listId = useId();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex items-center justify-between gap-3 rounded-full border border-gray-200 bg-white/90 px-4 py-3 font-semibold text-gray-800 shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition-all hover:shadow-[0_14px_30px_rgba(15,23,42,0.12)] focus:outline-none focus:ring-2 focus:ring-blue-500/40 w-36",
          className,
        )}
      >
        <span className="truncate">{value}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-slate-400 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div
          className="absolute z-30 mt-2 w-52 rounded-2xl border border-gray-200 bg-white p-2 shadow-[0_18px_40px_rgba(15,23,42,0.14)]"
          role="listbox"
          id={listId}
        >
          {options.map((option) => {
            const selected = option === value;
            return (
              <button
                key={option}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange?.({
                    target: { value: option },
                  } as ChangeEvent<HTMLSelectElement>);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                  selected
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-blue-50",
                )}
              >
                <span>{option}</span>
                {selected && <Check className="h-4 w-4" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
