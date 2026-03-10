"use client";

import { PdfViewer } from "@/registry/default/blocks/pdf/pdf-viewer/components/elements/pdf-viewer";

// Sample PDF URL - using a public PDF from the web
const SAMPLE_PDF_URL =
  "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf";

export default function PdfViewerDemo() {
  return (
    <div className="w-full h-[600px]">
      <PdfViewer file={SAMPLE_PDF_URL} mode="single" initialZoom={1.0} />
    </div>
  );
}
