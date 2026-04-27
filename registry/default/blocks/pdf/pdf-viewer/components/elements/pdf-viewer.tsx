"use client";

import * as React from "react";

import { Document, Page, pdfjs } from "react-pdf";

import { cn } from "@/lib/utils";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type ViewMode = "single" | "scroll" | "book";

interface PdfViewerProps {
  /** URL to the PDF file or File object */
  file: string | File;
  /** Initial viewing mode */
  mode?: ViewMode;
  /** Initial zoom level (0.5 to 2.0) */
  initialZoom?: number;
  /** Custom className */
  className?: string;
}

export function PdfViewer({
  file,
  mode = "single",
  initialZoom = 1.0,
  className,
}: PdfViewerProps) {
  const [numPages, setNumPages] = React.useState<number>(0);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [viewMode, setViewMode] = React.useState<ViewMode>(mode);
  const [zoom, setZoom] = React.useState<number>(initialZoom);
  const [pageWidth, setPageWidth] = React.useState<number>(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setCurrentPage(1);
  }

  // Calculate page width based on container and zoom
  React.useEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const baseWidth =
          viewMode === "book" ? containerWidth / 2 - 40 : containerWidth - 40;
        setPageWidth(baseWidth * zoom);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [viewMode, zoom]);

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - (viewMode === "book" ? 2 : 1), 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) =>
      Math.min(
        prev + (viewMode === "book" ? 2 : 1),
        viewMode === "book" ? numPages - 1 : numPages,
      ),
    );
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 2.0));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleFitWidth = () => setZoom(1.0);

  const handlePageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const page = Number.parseInt(e.target.value, 10);
    if (!Number.isNaN(page) && page >= 1 && page <= numPages) {
      setCurrentPage(page);
    }
  };

  // For book mode: determine if we should show single page (cover) or two pages
  const showCoverAlone = viewMode === "book" && currentPage === 1;
  const bookSecondPage = showCoverAlone ? null : currentPage + 1;

  return (
    <div
      data-slot="pdf-viewer"
      className={cn(
        "flex flex-col border border-border rounded-lg bg-background overflow-hidden",
        className,
      )}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 p-3 border-b border-border bg-muted/50">
        {/* Mode Switcher */}
        <div className="flex items-center gap-1 border border-border rounded-md p-1 bg-background">
          <button
            type="button"
            onClick={() => setViewMode("single")}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded transition-colors",
              viewMode === "single"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
            )}
          >
            Single
          </button>
          <button
            type="button"
            onClick={() => setViewMode("scroll")}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded transition-colors",
              viewMode === "scroll"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
            )}
          >
            Scroll
          </button>
          <button
            type="button"
            onClick={() => setViewMode("book")}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded transition-colors",
              viewMode === "book"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
            )}
          >
            Book
          </button>
        </div>

        {/* Page Navigation */}
        {viewMode !== "scroll" && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goToPreviousPage}
              disabled={currentPage <= 1}
              className="px-2 py-1 text-sm border border-border rounded bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ←
            </button>
            <div className="flex items-center gap-1 text-sm">
              <input
                type="number"
                min={1}
                max={numPages}
                value={currentPage}
                onChange={handlePageInput}
                className="w-12 px-2 py-1 text-center border border-border rounded bg-background"
              />
              <span className="text-muted-foreground">/ {numPages}</span>
            </div>
            <button
              type="button"
              onClick={goToNextPage}
              disabled={currentPage >= numPages}
              className="px-2 py-1 text-sm border border-border rounded bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
            >
              →
            </button>
          </div>
        )}

        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={zoom <= 0.5}
            className="px-2 py-1 text-sm border border-border rounded bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
          >
            −
          </button>
          <span className="text-sm text-muted-foreground min-w-[3rem] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={zoom >= 2.0}
            className="px-2 py-1 text-sm border border-border rounded bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
          >
            +
          </button>
          <button
            type="button"
            onClick={handleFitWidth}
            className="px-2 py-1 text-xs border border-border rounded bg-background hover:bg-muted"
          >
            Fit
          </button>
        </div>
      </div>

      {/* PDF Document */}
      <div
        ref={containerRef}
        className={cn(
          "flex-1 overflow-auto bg-muted/30",
          viewMode === "scroll" && "p-4",
          viewMode !== "scroll" && "flex items-start justify-center p-4",
        )}
      >
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex items-center justify-center p-8">
              <div className="text-sm text-muted-foreground">
                Loading PDF...
              </div>
            </div>
          }
          error={
            <div className="flex items-center justify-center p-8">
              <div className="text-sm text-destructive">
                Failed to load PDF. Please check the file or URL.
              </div>
            </div>
          }
          className={cn(
            viewMode === "scroll" && "space-y-4",
            viewMode === "book" && "flex gap-4",
          )}
        >
          {viewMode === "scroll" &&
            Array.from(new Array(numPages), (_, index) => (
              <div key={`page_${index + 1}`} className="flex justify-center">
                <Page
                  pageNumber={index + 1}
                  width={pageWidth}
                  className="shadow-lg"
                  loading={
                    <div className="h-[800px] w-full bg-background animate-pulse rounded" />
                  }
                />
              </div>
            ))}

          {viewMode === "single" && (
            <div className="flex justify-center">
              <Page
                pageNumber={currentPage}
                width={pageWidth}
                className="shadow-lg"
                loading={
                  <div className="h-[800px] w-full bg-background animate-pulse rounded" />
                }
              />
            </div>
          )}

          {viewMode === "book" && (
            <>
              <div className="flex justify-end">
                <Page
                  pageNumber={currentPage}
                  width={pageWidth}
                  className="shadow-lg"
                  loading={
                    <div className="h-[800px] w-full bg-background animate-pulse rounded" />
                  }
                />
              </div>
              {!showCoverAlone &&
                bookSecondPage &&
                bookSecondPage <= numPages && (
                  <div className="flex justify-start">
                    <Page
                      pageNumber={bookSecondPage}
                      width={pageWidth}
                      className="shadow-lg"
                      loading={
                        <div className="h-[800px] w-full bg-background animate-pulse rounded" />
                      }
                    />
                  </div>
                )}
            </>
          )}
        </Document>
      </div>
    </div>
  );
}

export type { PdfViewerProps, ViewMode };
