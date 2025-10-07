"use client";

import { UploadThingButton } from "./upload-button";
import { UploadThingDropzone } from "./upload-dropzone";

export default function UploadThingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">UploadThing Components</h1>
            <p className="text-muted-foreground">
              Complete file upload solution with drag & drop interface, progress
              tracking, and cloud storage integration.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Dropzone Component</h2>
                <p className="text-muted-foreground text-sm">
                  Drag and drop files with visual feedback and file management.
                </p>
              </div>
              <div className="border rounded-lg p-6">
                <UploadThingDropzone
                  endpoint="imageUploader"
                  onUploadComplete={(files) => {
                    console.log("Files uploaded:", files);
                  }}
                  onUploadError={(error) => {
                    console.error("Upload error:", error);
                  }}
                  maxFiles={4}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Button Component</h2>
                <p className="text-muted-foreground text-sm">
                  Simple upload button for basic file uploads.
                </p>
              </div>
              <div className="border rounded-lg p-6 flex justify-center">
                <UploadThingButton
                  endpoint="fileUploader"
                  onUploadComplete={(files) => {
                    console.log("Files uploaded:", files);
                  }}
                  onUploadError={(error) => {
                    console.error("Upload error:", error);
                  }}
                />
              </div>
            </div>
          </div>

          <div className="bg-card border rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold">Features</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-medium">Dropzone Component</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Drag and drop interface</li>
                  <li>• File preview and management</li>
                  <li>• Progress tracking</li>
                  <li>• Multiple file uploads</li>
                  <li>• File type validation</li>
                  <li>• Copy URL functionality</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Button Component</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Simple click-to-upload</li>
                  <li>• Customizable styling</li>
                  <li>• Error handling</li>
                  <li>• Analytics tracking</li>
                  <li>• Toast notifications</li>
                  <li>• TypeScript support</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
