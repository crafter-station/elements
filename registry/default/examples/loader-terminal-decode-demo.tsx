"use client";

import { useState } from "react";

import { LoaderTerminalDecode } from "@/registry/default/blocks/loaders/loader-terminal-decode/components/elements/loader-terminal-decode";
import { LoaderControls, type PropControl } from "./loader-controls";

const controls: PropControl[] = [
  {
    prop: "charset",
    label: "Charset",
    options: ["symbols", "binary", "hex"],
    default: "symbols",
  },
  {
    prop: "speed",
    label: "Speed",
    options: ["fast", "normal", "slow"],
    default: "fast",
  },
];

const SPEED_MAP: Record<string, number> = {
  fast: 20,
  normal: 50,
  slow: 100,
};

export default function LoaderTerminalDecodeDemo() {
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
      <LoaderTerminalDecode
        charset={values.charset as "symbols" | "binary" | "hex"}
        speed={SPEED_MAP[values.speed]}
      />
    </div>
  );
}
