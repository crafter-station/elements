"use client";

import { UploadThingDropzone } from "@/registry/default/blocks/uploadthing/uploadthing-dropzone/components/elements/uploadthing-dropzone";

export default function UploadthingDropzoneDemo() {
  return (
    <div className="w-full max-w-md p-4">
      <UploadThingDropzone
        accept="image/*"
        maxFiles={4}
        maxSize={4 * 1024 * 1024}
        onSelect={(files) => console.log("Selected:", files)}
      />
    </div>
  );
}
