import { ComponentPageTemplate } from "@/components/component-page-template";
import { ServerIcon } from "@/components/icons/server";
import { ShieldIcon } from "@/components/icons/shield";
import { UploadThingIcon } from "@/components/icons/upload-thing";
import { ZapIcon } from "@/components/icons/zap";

export default function UploadThingPage() {
  const features = [
    {
      icon: <ZapIcon className="w-3 h-3" />,
      title: "File Upload Components",
      description:
        "Drag & drop uploader, file browser, and progress indicators",
    },
    {
      icon: <ServerIcon className="w-3 h-3" />,
      title: "Backend Integration",
      description:
        "Server-side file handling, validation, and storage management",
    },
    {
      icon: <ShieldIcon className="w-3 h-3" />,
      title: "Security & Validation",
      description:
        "File type validation, size limits, and secure upload endpoints",
    },
  ];

  const technicalDetails = [
    {
      icon: <ZapIcon className="w-6 h-6" />,
      title: "High Performance",
      description:
        "Chunked uploads, resume capability, and optimized file processing",
    },
    {
      icon: <ServerIcon className="w-6 h-6" />,
      title: "Cloud Storage",
      description:
        "Direct uploads to S3, Vercel Blob, and other cloud providers",
    },
    {
      icon: <ShieldIcon className="w-6 h-6" />,
      title: "Type Safety",
      description:
        "Full TypeScript support with file type validation and error handling",
    },
  ];

  const usageExample = `<span class="text-blue-400">import</span>
<span class="text-foreground"> {"{ UploadDropzone }"} </span>
<span class="text-blue-400">from</span>
<span class="text-green-400"> "@/components/uploadthing"</span>
<br />
<span class="text-gray-500">{"<UploadDropzone />"}</span>`;

  const additionalExamples = [
    {
      title: "File Upload Handler",
      code: `<span class="text-blue-400">const</span> <span class="text-foreground">{ startUpload }</span> = <span class="text-foreground">useUploadThing</span>(<span class="text-green-400">"imageUploader"</span>)`,
    },
  ];

  return (
    <ComponentPageTemplate
      brandColor="#E91515"
      category="FILE UPLOADS"
      name="UploadThing"
      description="Complete file upload solution with drag & drop interface, progress tracking, and cloud storage integration. Built-in validation and error handling."
      icon={<UploadThingIcon className="w-12 h-12" />}
      features={features}
      technicalDetails={technicalDetails}
      installCommand="shadcn@latest add @elements/uploadthing"
      usageExample={usageExample}
      additionalExamples={additionalExamples}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="border border-border rounded-lg p-6 bg-card/30 ">
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4">
                <ZapIcon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-3">Drag & Drop</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Intuitive drag and drop interface with visual feedback and file
                previews
              </p>
              <div className="bg-muted/50 rounded p-2 font-mono text-xs">
                {"<UploadDropzone />"}
              </div>
            </div>

            <div className="border border-border rounded-lg p-6 bg-card/30 ">
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4">
                <ServerIcon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-3">Progress Tracking</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Real-time upload progress with pause, resume, and cancel
                functionality
              </p>
              <div className="bg-muted/50 rounded p-2 font-mono text-xs">
                {"<UploadProgress />"}
              </div>
            </div>

            <div className="border border-border rounded-lg p-6 bg-card/30 ">
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4">
                <ShieldIcon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-3">File Browser</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Browse and manage uploaded files with filtering and search
                capabilities
              </p>
              <div className="bg-muted/50 rounded p-2 font-mono text-xs">
                {"<FileBrowser />"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ComponentPageTemplate>
  );
}
