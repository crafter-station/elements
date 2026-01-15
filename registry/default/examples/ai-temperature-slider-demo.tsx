"use client";

import { useState } from "react";

import { AiTemperatureSlider } from "@/registry/default/blocks/ai/ai-temperature-slider/components/elements/ai-temperature-slider";

export default function AiTemperatureSliderDemo() {
  const [value, setValue] = useState(0.7);

  return (
    <div className="w-full max-w-sm p-4">
      <AiTemperatureSlider value={value} onValueChange={setValue} showPresets />
    </div>
  );
}
