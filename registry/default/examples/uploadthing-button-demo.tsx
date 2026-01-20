"use client";

import { UploadThingButton } from "@/registry/default/blocks/uploadthing/uploadthing-button/components/elements/uploadthing-button";

export default function UploadthingButtonDemo() {
  return (
    <div className="flex items-center justify-center p-8">
      <UploadThingButton
        accept="image/*"
        maxSize={4 * 1024 * 1024}
        onSelect={(files) => console.log("Selected:", files)}
      />
    </div>
  );
}
