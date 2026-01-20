"use client";

import { useEffect, useState } from "react";
import { UploadThingProgress } from "@/registry/default/blocks/uploadthing/uploadthing-progress/components/elements/uploadthing-progress";

export default function UploadThingProgressDemo() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-8 p-4 w-full max-w-md">
      <UploadThingProgress progress={progress} variant="bar" size="md" />
      <div className="flex items-center gap-8">
        <UploadThingProgress progress={progress} variant="ring" size="sm" />
        <UploadThingProgress progress={progress} variant="ring" size="md" />
        <UploadThingProgress progress={progress} variant="ring" size="lg" />
      </div>
      <UploadThingProgress
        progress={progress}
        variant="minimal"
        size="md"
        showLabel={false}
      />
    </div>
  );
}
