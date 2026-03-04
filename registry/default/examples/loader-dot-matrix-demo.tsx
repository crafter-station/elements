"use client";

import { useState } from "react";

import { LoaderDotMatrix } from "@/registry/default/blocks/loaders/loader-dot-matrix/components/elements/loader-dot-matrix";
import { LoaderControls, type PropControl } from "./loader-controls";

const controls: PropControl[] = [
  {
    prop: "pattern",
    label: "Pattern",
    options: ["ripple", "wave", "rain"],
    default: "ripple",
  },
];

export default function LoaderDotMatrixDemo() {
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
      <LoaderDotMatrix pattern={values.pattern as "ripple" | "wave" | "rain"} />
    </div>
  );
}
