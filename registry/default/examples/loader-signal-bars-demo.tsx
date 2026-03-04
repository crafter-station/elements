"use client";

import { useState } from "react";

import { LoaderSignalBars } from "@/registry/default/blocks/loaders/loader-signal-bars/components/elements/loader-signal-bars";
import { LoaderControls, type PropControl } from "./loader-controls";

const controls: PropControl[] = [
  {
    prop: "variant",
    label: "Variant",
    options: ["equalizer", "waveform", "heartbeat"],
    default: "equalizer",
  },
  { prop: "size", label: "Size", options: ["sm", "md", "lg"], default: "md" },
];

export default function LoaderSignalBarsDemo() {
  const [values, setValues] = useState(() =>
    Object.fromEntries(controls.map((c) => [c.prop, c.default])),
  );

  return (
    <div className="relative flex items-center justify-center p-8 w-full min-h-full">
      <LoaderControls
        controls={controls}
        values={values}
        onChange={(p, v) => setValues((prev) => ({ ...prev, [p]: v }))}
      />
      <LoaderSignalBars
        variant={values.variant as "equalizer" | "waveform" | "heartbeat"}
        size={values.size as "sm" | "md" | "lg"}
      />
    </div>
  );
}
