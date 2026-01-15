"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import { Slider } from "@/components/ui/slider";

interface Preset {
  value: number;
  label: string;
  description: string;
}

const DEFAULT_PRESETS: Preset[] = [
  { value: 0, label: "Precise", description: "Deterministic, focused" },
  { value: 0.7, label: "Balanced", description: "Default, versatile" },
  { value: 1.0, label: "Creative", description: "More variety" },
  { value: 1.5, label: "Wild", description: "Experimental" },
];

interface AiTemperatureSliderProps {
  value?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  showPresets?: boolean;
  presets?: Preset[];
  className?: string;
}

export function AiTemperatureSlider({
  value,
  onValueChange,
  min = 0,
  max = 2,
  step = 0.1,
  showPresets = true,
  presets = DEFAULT_PRESETS,
  className,
}: AiTemperatureSliderProps) {
  const [internalValue, setInternalValue] = React.useState(value ?? 0.7);
  const currentValue = value !== undefined ? value : internalValue;

  const handleChange = React.useCallback(
    (newValue: number[]) => {
      const val = newValue[0];
      if (value === undefined) {
        setInternalValue(val);
      }
      onValueChange?.(val);
    },
    [value, onValueChange],
  );

  const handlePresetClick = React.useCallback(
    (presetValue: number) => {
      if (value === undefined) {
        setInternalValue(presetValue);
      }
      onValueChange?.(presetValue);
    },
    [value, onValueChange],
  );

  const currentPreset = React.useMemo(
    () => presets.find((p) => Math.abs(p.value - currentValue) < 0.05),
    [presets, currentValue],
  );

  return (
    <div
      data-slot="ai-temperature-slider"
      className={cn("w-full space-y-4", className)}
    >
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Temperature</label>
        <span className="font-mono text-sm tabular-nums text-muted-foreground">
          {currentValue.toFixed(1)}
        </span>
      </div>

      <Slider
        value={[currentValue]}
        onValueChange={handleChange}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />

      {showPresets && (
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Temperature presets"
        >
          {presets.map((preset) => {
            const isActive = Math.abs(preset.value - currentValue) < 0.05;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => handlePresetClick(preset.value)}
                aria-pressed={isActive}
                aria-label={`${preset.label}: ${preset.description}`}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition-colors",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:border-primary/50 hover:bg-muted",
                )}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      )}

      {currentPreset && (
        <p className="text-xs text-muted-foreground">
          {currentPreset.description}
        </p>
      )}
    </div>
  );
}

export type { AiTemperatureSliderProps, Preset };
