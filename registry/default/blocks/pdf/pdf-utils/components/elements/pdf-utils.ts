/**
 * PDF Utilities using pdf-lib (isomorphic - works in browser and Node.js)
 * For text extraction and rendering, we still use pdfjs (browser-optimized)
 */

import { PDFDocument } from "pdf-lib";
import { pdfjs } from "react-pdf";

// Configure PDF.js worker (for text extraction functions)
if (typeof window !== "undefined" && !pdfjs.GlobalWorkerOptions.workerSrc) {
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

export interface PdfPageInfo {
  pageNumber: number;
  width: number;
  height: number;
  rotation: number;
}

export interface PdfDocumentInfo {
  numPages: number;
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
  creator?: string;
  producer?: string;
  creationDate?: Date;
  modificationDate?: Date;
}

/**
 * Fetch a PDF from a URL and convert it to a File object
 * @param url - URL to the PDF file
 * @param filename - Optional filename (defaults to extracted from URL or "document.pdf")
 * @returns File object containing the PDF data
 */
export async function fetchPdfAsFile(
  url: string,
  filename?: string,
): Promise<File> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch PDF: ${response.status} ${response.statusText}`,
    );
  }

  const blob = await response.blob();

  // Extract filename from URL if not provided
  const finalFilename =
    filename || url.split("/").pop()?.split("?")[0] || "document.pdf";

  return new File([blob], finalFilename, { type: "application/pdf" });
}

/**
 * Load PDF document using pdf-lib (works in browser and Node.js)
 */
async function loadPdfLibDocument(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  return await PDFDocument.load(arrayBuffer);
}

/**
 * Load PDF document using pdfjs (for text extraction)
 */
async function loadPdfJsDocument(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument(arrayBuffer);
  return await loadingTask.promise;
}

/**
 * Get information about a PDF document
 * Uses pdf-lib (works in browser and Node.js)
 * @param file - PDF File object (use fetchPdfAsFile() to convert URL to File)
 * @returns Document metadata and page count
 */
export async function getPdfInfo(file: File): Promise<PdfDocumentInfo> {
  const pdfDoc = await loadPdfLibDocument(file);

  return {
    numPages: pdfDoc.getPageCount(),
    title: pdfDoc.getTitle() || undefined,
    author: pdfDoc.getAuthor() || undefined,
    subject: pdfDoc.getSubject() || undefined,
    keywords: pdfDoc.getKeywords() || undefined,
    creator: pdfDoc.getCreator() || undefined,
    producer: pdfDoc.getProducer() || undefined,
    creationDate: pdfDoc.getCreationDate() || undefined,
    modificationDate: pdfDoc.getModificationDate() || undefined,
  };
}

/**
 * Get information about a specific page
 * Uses pdf-lib (works in browser and Node.js)
 * @param file - PDF File object (use fetchPdfAsFile() to convert URL to File)
 * @param pageNumber - Page number (1-indexed)
 * @returns Page dimensions and rotation
 */
export async function getPageInfo(
  file: File,
  pageNumber: number,
): Promise<PdfPageInfo> {
  const pdfDoc = await loadPdfLibDocument(file);
  const pageCount = pdfDoc.getPageCount();

  if (pageNumber < 1 || pageNumber > pageCount) {
    throw new Error(
      `Page number ${pageNumber} is out of range (1-${pageCount})`,
    );
  }

  const page = pdfDoc.getPage(pageNumber - 1); // pdf-lib uses 0-indexed
  const { width, height } = page.getSize();
  const rotation = page.getRotation().angle;

  return {
    pageNumber,
    width,
    height,
    rotation,
  };
}

/**
 * Extract a single page as a new PDF blob
 * Uses pdf-lib (works in browser and Node.js)
 * @param file - PDF File object (use fetchPdfAsFile() to convert URL to File)
 * @param pageNumber - Page number to extract (1-indexed)
 * @returns Blob containing single-page PDF
 */
export async function extractPage(
  file: File,
  pageNumber: number,
): Promise<Blob> {
  const pdfDoc = await loadPdfLibDocument(file);
  const pageCount = pdfDoc.getPageCount();

  if (pageNumber < 1 || pageNumber > pageCount) {
    throw new Error(
      `Page number ${pageNumber} is out of range (1-${pageCount})`,
    );
  }

  const newPdf = await PDFDocument.create();
  const [copiedPage] = await newPdf.copyPages(pdfDoc, [pageNumber - 1]);
  newPdf.addPage(copiedPage);

  const pdfBytes = await newPdf.save();
  // Convert Uint8Array to ArrayBuffer for Blob compatibility
  return new Blob([pdfBytes.slice().buffer], { type: "application/pdf" });
}

/**
 * Extract a range of pages as a new PDF blob
 * Uses pdf-lib (works in browser and Node.js)
 * @param file - PDF File object (use fetchPdfAsFile() to convert URL to File)
 * @param startPage - First page to extract (1-indexed, inclusive)
 * @param endPage - Last page to extract (1-indexed, inclusive)
 * @returns Blob containing extracted pages
 */
export async function extractPageRange(
  file: File,
  startPage: number,
  endPage: number,
): Promise<Blob> {
  const pdfDoc = await loadPdfLibDocument(file);
  const pageCount = pdfDoc.getPageCount();

  if (startPage < 1 || endPage > pageCount || startPage > endPage) {
    throw new Error(
      `Invalid page range ${startPage}-${endPage} (document has ${pageCount} pages)`,
    );
  }

  const newPdf = await PDFDocument.create();
  const pageIndices = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage - 1 + i,
  );
  const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);

  for (const page of copiedPages) {
    newPdf.addPage(page);
  }

  const pdfBytes = await newPdf.save();
  // Convert Uint8Array to ArrayBuffer for Blob compatibility
  return new Blob([pdfBytes.slice().buffer], { type: "application/pdf" });
}

// ==================== PDF.js-based functions (text extraction and rendering) ====================

/**
 * Get text content from a specific page
 * Uses PDF.js (optimized for browser, but works in Node.js with proper setup)
 * @param file - PDF File object (use fetchPdfAsFile() to convert URL to File)
 * @param pageNumber - Page number (1-indexed)
 * @returns Text content of the page
 */
export async function getPageText(
  file: File,
  pageNumber: number,
): Promise<string> {
  const pdf = await loadPdfJsDocument(file);

  if (pageNumber < 1 || pageNumber > pdf.numPages) {
    throw new Error(
      `Page number ${pageNumber} is out of range (1-${pdf.numPages})`,
    );
  }

  const page = await pdf.getPage(pageNumber);
  const textContent = await page.getTextContent();

  return textContent.items.map((item: any) => item.str).join(" ");
}

/**
 * Search for text in PDF
 * Uses PDF.js for text extraction
 * @param file - PDF File object (use fetchPdfAsFile() to convert URL to File)
 * @param searchText - Text to search for
 * @param caseSensitive - Whether search should be case-sensitive (default: false)
 * @returns Array of page numbers where text was found
 */
export async function searchText(
  file: File,
  searchText: string,
  caseSensitive = false,
): Promise<number[]> {
  const pdf = await loadPdfJsDocument(file);
  const foundPages: number[] = [];

  const normalizedSearch = caseSensitive
    ? searchText
    : searchText.toLowerCase();

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(" ");

    const normalizedPageText = caseSensitive
      ? pageText
      : pageText.toLowerCase();

    if (normalizedPageText.includes(normalizedSearch)) {
      foundPages.push(pageNum);
    }
  }

  return foundPages;
}

/**
 * Render a PDF page as a screenshot (base64 image)
 * Uses PDF.js with Canvas API (browser only, or Node.js with canvas library)
 * @param file - PDF File object (use fetchPdfAsFile() to convert URL to File)
 * @param pageNumber - Page number (1-indexed)
 * @param scale - Scale factor (default: 2 for high DPI)
 * @returns Base64-encoded PNG image
 */
export async function screenshotPage(
  file: File,
  pageNumber: number,
  scale = 2,
): Promise<string> {
  // Check if we're in a browser environment
  if (typeof document === "undefined") {
    throw new Error(
      "screenshotPage requires a browser environment with Canvas API. Use in browser or with a DOM implementation like happy-dom/jsdom.",
    );
  }

  const pdf = await loadPdfJsDocument(file);

  if (pageNumber < 1 || pageNumber > pdf.numPages) {
    throw new Error(
      `Page number ${pageNumber} is out of range (1-${pdf.numPages})`,
    );
  }

  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Could not get canvas context");
  }

  canvas.height = viewport.height;
  canvas.width = viewport.width;

  const renderContext = {
    canvasContext: context,
    viewport: viewport,
  } as any;

  await page.render(renderContext).promise;

  return canvas.toDataURL("image/png");
}

/**
 * Get all page thumbnails as base64 images
 * Uses PDF.js for rendering (browser optimized)
 * @param file - PDF File object (use fetchPdfAsFile() to convert URL to File)
 * @param scale - Scale factor for thumbnails (default: 0.5)
 * @returns Array of base64-encoded PNG images
 */
export async function getAllPageThumbnails(
  file: File,
  scale = 0.5,
): Promise<string[]> {
  const info = await getPdfInfo(file);
  const thumbnails: string[] = [];

  for (let i = 1; i <= info.numPages; i++) {
    const thumbnail = await screenshotPage(file, i, scale);
    thumbnails.push(thumbnail);
  }

  return thumbnails;
}

// Re-export types from PDF.js for compatibility
export type {
  PDFDocumentProxy,
  PDFPageProxy,
  TextContent,
} from "pdfjs-dist/types/src/display/api";
