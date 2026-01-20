"use client";

import { UploadThingFileCard } from "@/registry/default/blocks/uploadthing/uploadthing-file-card/components/elements/uploadthing-file-card";

export default function UploadThingFileCardDemo() {
  return (
    <div className="flex flex-col gap-3 p-4 w-full max-w-md">
      <UploadThingFileCard
        name="profile-photo.jpg"
        size={2457600}
        type="image/jpeg"
        url="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400"
        onRemove={() => console.log("Remove clicked")}
      />
      <UploadThingFileCard
        name="document.pdf"
        size={1048576}
        type="application/pdf"
        url="https://example.com/document.pdf"
        onRemove={() => console.log("Remove clicked")}
      />
      <UploadThingFileCard
        name="presentation.mp4"
        size={15728640}
        type="video/mp4"
        url="https://example.com/video.mp4"
      />
    </div>
  );
}
