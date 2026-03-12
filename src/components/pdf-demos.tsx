"use client";

import dynamic from "next/dynamic";

export const PdfUtilsDemo = dynamic(
  () => import("@/registry/default/examples/pdf-utils-demo"),
  { ssr: false },
);

export const PdfViewerDemo = dynamic(
  () => import("@/registry/default/examples/pdf-viewer-demo"),
  { ssr: false },
);
