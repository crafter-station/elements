"use client";

import { UploadThingButton } from "@registry/uploadthing/upload-button";
import { UploadThingDropzone } from "@registry/uploadthing/upload-dropzone";
import { toast } from "sonner";

export function UploadThingDropzoneDemo() {
  return (
    <div className="w-full">
      <UploadThingDropzone
        endpoint="imageUploader"
        onUploadComplete={(files) => {
          console.log("Files: ", files);
          toast.success(`Successfully uploaded ${files.length} file(s)`);
        }}
        onUploadError={(error: Error) => {
          toast.error(`Upload failed: ${error.message}`);
        }}
        maxFiles={4}
        className="max-w-2xl mx-auto"
      />
    </div>
  );
}

export function UploadThingButtonDemo() {
  return (
    <div className="flex justify-center py-8">
      <UploadThingButton
        endpoint="fileUploader"
        onUploadComplete={(files) => {
          console.log("Files: ", files);
          toast.success(`Successfully uploaded ${files.length} file(s)`);
        }}
        onUploadError={(error: Error) => {
          toast.error(`Upload failed: ${error.message}`);
        }}
        className="bg-blue-600 hover:bg-blue-700"
      />
    </div>
  );
}
