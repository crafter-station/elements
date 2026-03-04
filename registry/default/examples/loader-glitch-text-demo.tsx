"use client";

import { useState } from "react";

import { LoaderGlitchText } from "@/registry/default/blocks/loaders/loader-glitch-text/components/elements/loader-glitch-text";
import { LoaderControls, type PropControl } from "./loader-controls";

const controls: PropControl[] = [
  {
    prop: "intensity",
    label: "Intensity",
    options: ["subtle", "medium", "heavy"],
    default: "medium",
  },
];

export default function LoaderGlitchTextDemo() {
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
      <LoaderGlitchText
        intensity={values.intensity as "subtle" | "medium" | "heavy"}
      />
    </div>
  );
}
