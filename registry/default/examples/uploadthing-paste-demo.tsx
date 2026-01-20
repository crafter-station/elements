"use client";

import { UploadThingPaste } from "@/registry/default/blocks/uploadthing/uploadthing-paste/components/elements/uploadthing-paste";

export default function UploadThingPasteDemo() {
  const mockUpload = async (files: File[]) => {
    console.log("Uploading files:", files);
    await new Promise((resolve) => setTimeout(resolve, 2000));
  };

  return (
    <div className="flex items-center justify-center p-4 w-full max-w-md">
      <UploadThingPaste
        onPaste={(files) => console.log("Pasted:", files)}
        onUpload={mockUpload}
        accept={["image/*"]}
      />
    </div>
  );
}
