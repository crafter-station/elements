"use client";

import { useState } from "react";

import {
  extractPage,
  extractPageRange,
  fetchPdfAsFile,
  getPageText,
  getPdfInfo,
  type PdfDocumentInfo,
  screenshotPage,
  searchText,
} from "@/registry/default/blocks/pdf/pdf-utils/components/elements/pdf-utils";

// Sample PDF URL - using a public PDF from the web
const SAMPLE_PDF_URL =
  "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf";

export default function PdfUtilsDemo() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [info, setInfo] = useState<PdfDocumentInfo | null>(null);
  const [pageText, setPageText] = useState<string>("");
  const [searchResults, setSearchResults] = useState<number[]>([]);
  const [screenshot, setScreenshot] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const loadSamplePdf = async () => {
    try {
      setLoading(true);
      setError("");
      const file = await fetchPdfAsFile(SAMPLE_PDF_URL);
      setPdfFile(file);
      const pdfInfo = await getPdfInfo(file);
      setInfo(pdfInfo);
    } catch (err) {
      setError(`Failed to load PDF: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const extractPageText = async () => {
    if (!pdfFile) return;
    try {
      setLoading(true);
      setError("");
      const text = await getPageText(pdfFile, 1);
      setPageText(text);
    } catch (err) {
      setError(`Failed to extract text: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const searchPdf = async () => {
    if (!pdfFile) return;
    try {
      setLoading(true);
      setError("");
      const results = await searchText(pdfFile, "trace", false);
      setSearchResults(results);
    } catch (err) {
      setError(`Failed to search: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const takeScreenshot = async () => {
    if (!pdfFile) return;
    try {
      setLoading(true);
      setError("");
      const img = await screenshotPage(pdfFile, 1, 1.5);
      setScreenshot(img);
    } catch (err) {
      setError(`Failed to screenshot: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const downloadExtractedPage = async () => {
    if (!pdfFile) return;
    try {
      setLoading(true);
      setError("");
      const blob = await extractPage(pdfFile, 1);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "extracted-page-1.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(`Failed to extract page: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const downloadPageRange = async () => {
    if (!pdfFile) return;
    try {
      setLoading(true);
      setError("");
      const blob = await extractPageRange(pdfFile, 1, 3);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "extracted-pages-1-3.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(`Failed to extract pages: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl p-6 space-y-6">
      {/* Load PDF */}
      <div className="flex flex-col items-center space-y-3">
        <button
          type="button"
          onClick={loadSamplePdf}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Loading..." : "Load Sample PDF"}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
          {error}
        </div>
      )}

      {/* Document Info */}
      {info && (
        <div className="flex flex-col items-center space-y-2">
          <h3 className="text-lg font-semibold">Document Info</h3>
          <div className="p-4 space-y-1 text-sm bg-muted rounded-md">
            <div>
              <span className="font-medium">Pages:</span> {info.numPages}
            </div>
            {info.title && (
              <div>
                <span className="font-medium">Title:</span> {info.title}
              </div>
            )}
            {info.author && (
              <div>
                <span className="font-medium">Author:</span> {info.author}
              </div>
            )}
            {info.creator && (
              <div>
                <span className="font-medium">Creator:</span> {info.creator}
              </div>
            )}
            {info.creationDate && (
              <div>
                <span className="font-medium">Created:</span>{" "}
                {info.creationDate.toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      {pdfFile && (
        <div className="space-y-4">
          {/* Text Extraction */}
          <div className="flex flex-col items-center space-y-2">
            <h3 className="text-lg font-semibold">Text Extraction</h3>
            <button
              type="button"
              onClick={extractPageText}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary/10 disabled:opacity-50"
            >
              Extract Text from Page 1
            </button>
            {pageText && (
              <div className="p-4 text-sm bg-muted rounded-md max-h-40 overflow-auto">
                {pageText.substring(0, 500)}
                {pageText.length > 500 && "..."}
              </div>
            )}
          </div>

          {/* Search */}
          <div className="flex flex-col items-center space-y-2">
            <h3 className="text-lg font-semibold">Search PDF</h3>
            <button
              type="button"
              onClick={searchPdf}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary/10 disabled:opacity-50"
            >
              Search for "trace"
            </button>
            {searchResults.length > 0 && (
              <div className="p-4 text-sm bg-muted rounded-md">
                Found on pages: {searchResults.join(", ")}
              </div>
            )}
          </div>

          {/* Screenshot */}
          <div className="flex flex-col items-center space-y-2">
            <h3 className="text-lg font-semibold">Page Screenshot</h3>
            <button
              type="button"
              onClick={takeScreenshot}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary/10 disabled:opacity-50"
            >
              Screenshot Page 1
            </button>
            {screenshot && (
              <img
                src={screenshot}
                alt="Page screenshot"
                className="max-w-md border border-border rounded-md"
              />
            )}
          </div>

          {/* Page Extraction */}
          <div className="flex flex-col items-center space-y-2">
            <h3 className="text-lg font-semibold">Extract Pages</h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={downloadExtractedPage}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary/10 disabled:opacity-50"
              >
                Extract Page 1
              </button>
              <button
                type="button"
                onClick={downloadPageRange}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary/10 disabled:opacity-50"
              >
                Extract Pages 1-3
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
