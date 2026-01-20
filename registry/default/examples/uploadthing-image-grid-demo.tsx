"use client";

import { useState } from "react";
import {
  UploadThingImageGrid,
  type ImageItem,
} from "@/registry/default/blocks/uploadthing/uploadthing-image-grid/components/elements/uploadthing-image-grid";

const DEMO_IMAGES: ImageItem[] = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
    name: "Mountain landscape",
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop",
    name: "Nature scene",
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400&h=400&fit=crop",
    name: "Forest path",
  },
];

export default function UploadThingImageGridDemo() {
  const [images, setImages] = useState<ImageItem[]>(DEMO_IMAGES);

  const mockUpload = async (files: File[]) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return files.map((file, index) => ({
      id: `new-${Date.now()}-${index}`,
      url: URL.createObjectURL(file),
      name: file.name,
    }));
  };

  return (
    <div className="flex items-center justify-center p-4 w-full max-w-md">
      <UploadThingImageGrid
        value={images}
        onChange={setImages}
        onUpload={mockUpload}
        maxImages={6}
        columns={3}
      />
    </div>
  );
}
