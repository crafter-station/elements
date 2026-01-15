"use client";

import { ApiResponseViewer } from "@/registry/default/blocks/devtools/api-response-viewer/components/elements/api-response-viewer";

const sampleResponse = {
  status: 200,
  statusText: "OK",
  headers: {
    "content-type": "application/json",
    "x-request-id": "abc123",
    "cache-control": "no-cache",
  },
  body: {
    success: true,
    data: {
      id: 1,
      name: "Example",
      timestamp: "2024-01-15T10:30:00Z",
    },
  },
  timing: {
    dns: 5,
    connect: 15,
    ttfb: 45,
    download: 12,
    total: 77,
  },
};

export default function ApiResponseViewerDemo() {
  return (
    <div className="w-full max-w-2xl p-4">
      <ApiResponseViewer response={sampleResponse} />
    </div>
  );
}
