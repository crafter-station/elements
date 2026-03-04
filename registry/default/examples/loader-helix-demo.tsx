"use client";

import { useState } from "react";

import { LoaderHelix } from "@/registry/default/blocks/loaders/loader-helix/components/elements/loader-helix";
import { LoaderControls, type PropControl } from "./loader-controls";

const controls: PropControl[] = [
  {
    prop: "variant",
    label: "Variant",
    options: ["dna", "ribbon", "minimal"],
    default: "dna",
  },
];

export default function LoaderHelixDemo() {
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
      <LoaderHelix variant={values.variant as "dna" | "ribbon" | "minimal"} />
    </div>
  );
}
