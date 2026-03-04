"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

export type PropControl = {
  prop: string;
  label: string;
  options: readonly string[];
  default: string;
};

export function LoaderControls({
  controls,
  values,
  onChange,
}: {
  controls: readonly PropControl[];
  values: Record<string, string>;
  onChange: (prop: string, value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="absolute top-1.5 right-1.5 z-10">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center justify-center",
          "size-7 rounded-md",
          "backdrop-blur-xl bg-background/80",
          "border border-border shadow-sm",
          "text-muted-foreground hover:text-foreground",
          "transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        )}
        aria-label={open ? "Close settings" : "Open settings"}
      >
        <svg
          aria-hidden="true"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>

      {open && (
        <div
          className={cn(
            "absolute top-0 right-0 mt-9",
            "backdrop-blur-xl bg-background/80",
            "border border-border rounded-lg",
            "p-2 shadow-lg",
            "flex flex-col gap-1.5",
            "animate-in fade-in slide-in-from-top-1 duration-150",
          )}
        >
          {controls.map((control) => (
            <div key={control.prop} className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono leading-none">
                {control.label}
              </span>
              <div className="flex">
                {control.options.map((option, i) => {
                  const isActive = values[control.prop] === option;
                  const isFirst = i === 0;
                  const isLast = i === control.options.length - 1;

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => onChange(control.prop, option)}
                      className={cn(
                        "h-6 px-2 text-[11px] font-medium font-mono",
                        "border border-border transition-all duration-150",
                        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                        isFirst && "rounded-l-md",
                        isLast && "rounded-r-md",
                        !isFirst && "-ml-px",
                        isActive
                          ? "bg-foreground text-background border-foreground z-[1]"
                          : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted",
                      )}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
