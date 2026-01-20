"use client";

import { useState } from "react";
import { UploadThingAvatar } from "@/registry/default/blocks/uploadthing/uploadthing-avatar/components/elements/uploadthing-avatar";

export default function UploadThingAvatarDemo() {
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

  const mockUpload = async (file: File): Promise<string> => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return URL.createObjectURL(file);
  };

  return (
    <div className="flex items-center justify-center gap-8 p-4">
      <UploadThingAvatar
        value={avatarUrl}
        onChange={setAvatarUrl}
        onUpload={mockUpload}
        size="lg"
      />
      <UploadThingAvatar
        value="https://avatars.githubusercontent.com/u/124599?v=4"
        size="md"
        disabled
      />
      <UploadThingAvatar size="sm" fallback="JD" />
    </div>
  );
}
