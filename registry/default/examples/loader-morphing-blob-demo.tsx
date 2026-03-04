"use client";

import { useState } from "react";

import { LoaderMorphingBlob } from "@/registry/default/blocks/loaders/loader-morphing-blob/components/elements/loader-morphing-blob";
import { LoaderControls, type PropControl } from "./loader-controls";

const controls: PropControl[] = [
  {
    prop: "variant",
    label: "Variant",
    options: ["mercury", "aurora", "monochrome"],
    default: "mercury",
  },
  { prop: "size", label: "Size", options: ["sm", "md", "lg"], default: "md" },
];

export default function LoaderMorphingBlobDemo() {
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
      <LoaderMorphingBlob
        variant={values.variant as "mercury" | "aurora" | "monochrome"}
        size={values.size as "sm" | "md" | "lg"}
      />
    </div>
  );
}
