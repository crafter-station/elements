import { ComponentPageTemplate } from "@/components/component-page-template";
import { ServerIcon } from "@/components/icons/server";
import { ShieldIcon } from "@/components/icons/shield";
import { UploadThingLogo } from "@/components/icons/upload-thing";
import { ZapIcon } from "@/components/icons/zap";

import {
  UploadThingButtonDemo,
  UploadThingDropzoneDemo,
} from "./upload-components";

export default function UploadThingPage() {
  const features = [
    {
      icon: <ZapIcon className="w-3 h-3" />,
      title: "Drag & Drop Interface",
      description:
        "Intuitive drag and drop uploader with visual feedback and file previews",
    },
    {
      icon: <ServerIcon className="w-3 h-3" />,
      title: "Progress Tracking",
      description:
        "Real-time upload progress with pause, resume, and cancel functionality",
    },
    {
      icon: <ShieldIcon className="w-3 h-3" />,
      title: "File Validation",
      description:
        "Built-in file type validation, size limits, and secure upload endpoints",
    },
  ];

  const technicalDetails = [
    {
      icon: <ZapIcon className="w-6 h-6" />,
      title: "High Performance",
      description:
        "Chunked uploads, resume capability, and optimized file processing with cloud storage",
    },
    {
      icon: <ServerIcon className="w-6 h-6" />,
      title: "Multiple Endpoints",
      description:
        "Support for images, PDFs, media files, and general uploads with different configurations",
    },
    {
      icon: <ShieldIcon className="w-6 h-6" />,
      title: "Type Safety",
      description:
        "Full TypeScript support with file type validation and comprehensive error handling",
    },
  ];

  const usageExample = `<span class="text-blue-400">import</span>
<span class="text-foreground"> { UploadThingDropzone } </span>
<span class="text-blue-400">from</span>
<span class="text-green-400"> "@/components/uploadthing"</span>
<br />
<span class="text-gray-500">&lt;UploadThingDropzone endpoint="imageUploader" /&gt;</span>`;

  const additionalExamples = [
    {
      title: "Upload Button Component",
      code: `<span class="text-gray-500">&lt;UploadThingButton endpoint="fileUploader" /&gt;</span>`,
    },
    {
      title: "Custom Upload Handler",
      code: `<span class="text-blue-400">const</span> <span class="text-foreground">{ startUpload }</span> = <span class="text-foreground">useUploadThing</span>(<span class="text-green-400">"imageUploader"</span>)`,
    },
  ];

  const uploadThingComponents = {
    "uploadthing-dropzone": <UploadThingDropzoneDemo />,
    "uploadthing-button": <UploadThingButtonDemo />,
  };

  const componentInstallUrls = {
    "uploadthing-dropzone": "@elements/uploadthing-dropzone",
    "uploadthing-button": "@elements/uploadthing-button",
  };

  return (
    <ComponentPageTemplate
      brandColor="#E91515"
      category="FILES"
      name="UploadThing"
      description="Complete file upload solution with drag & drop interface, progress tracking, and cloud storage integration. Built-in validation and error handling."
      icon={<UploadThingLogo className="w-12 h-12" />}
      features={features}
      technicalDetails={technicalDetails}
      installCommand="bunx shadcn@latest add @elements/uploadthing-dropzone"
      usageExample={usageExample}
      additionalExamples={additionalExamples}
      components={uploadThingComponents}
      componentInstallUrls={componentInstallUrls}
      layout={{ type: "auto", columns: 1, gap: "lg" }}
    >
      {/* Custom sections can go here if needed */}
      <div className="border-t border-border border-dotted px-8 lg:px-16 py-16">
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Upload Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need for modern file uploads in web applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-border rounded-lg p-6 bg-card/30">
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4">
                <ServerIcon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-3">Progress Tracking</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Real-time upload progress with visual indicators and status
                updates
              </p>
              <div className="bg-amber-100 dark:bg-amber-900/30 rounded p-3 text-xs">
                <div className="text-amber-800 dark:text-amber-200 font-medium mb-1">
                  🚧 Coming Soon
                </div>
                <div className="text-amber-700 dark:text-amber-300">
                  Advanced progress tracking features in development
                </div>
              </div>
            </div>

            <div className="border border-border rounded-lg p-6 bg-card/30">
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4">
                <ZapIcon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-3">File Browser</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Browse, organize, and manage uploaded files with a dedicated
                interface
              </p>
              <div className="bg-amber-100 dark:bg-amber-900/30 rounded p-3 text-xs">
                <div className="text-amber-800 dark:text-amber-200 font-medium mb-1">
                  🚧 Coming Soon
                </div>
                <div className="text-amber-700 dark:text-amber-300">
                  File management interface in development
                </div>
              </div>
            </div>
          </div>

          <div className="bg-muted/30 rounded-lg p-6">
            <h3 className="font-semibold mb-4">Environment Setup</h3>
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium mb-2">
                  Required Environment Variables:
                </h4>
                <div className="bg-background rounded border p-3 font-mono text-sm">
                  <div>UPLOADTHING_TOKEN=ut_...</div>
                  <div>UPLOADTHING_APP_ID=your_app_id</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Get your credentials from the{" "}
                <a
                  href="https://uploadthing.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  UploadThing Dashboard
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </ComponentPageTemplate>
  );
}
