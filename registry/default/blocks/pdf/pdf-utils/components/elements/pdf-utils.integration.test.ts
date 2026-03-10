import { PDFDocument, StandardFonts } from "pdf-lib";
import { beforeAll, describe, expect, it } from "vitest";

import {
  extractPage,
  extractPageRange,
  getPageInfo,
  getPdfInfo,
} from "./pdf-utils";

/**
 * Integration Tests for PDF Utils
 * Uses a locally-generated PDF to avoid CORS and network issues
 */
describe("PDF Utils - Integration Tests", () => {
  let testPdfFile: File;

  beforeAll(async () => {
    // Create a test PDF with pdf-lib
    const pdfDoc = await PDFDocument.create();

    // Add metadata
    pdfDoc.setTitle("Test PDF Document");
    pdfDoc.setAuthor("PDF Utils Test Suite");
    pdfDoc.setSubject("Integration Testing");
    pdfDoc.setKeywords(["test", "pdf", "integration"]);
    pdfDoc.setCreator("pdf-lib");
    pdfDoc.setProducer("Vitest");

    // Add 3 pages with some text
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    for (let i = 1; i <= 3; i++) {
      const page = pdfDoc.addPage([600, 800]);
      page.drawText(`Page ${i}`, {
        x: 50,
        y: 750,
        size: 30,
        font,
      });
      page.drawText(`This is test content on page ${i}`, {
        x: 50,
        y: 700,
        size: 12,
        font,
      });
    }

    const pdfBytes = await pdfDoc.save();
    // Convert to Buffer which is compatible with Blob/File
    const buffer = Buffer.from(pdfBytes);
    testPdfFile = new File([buffer], "test.pdf", {
      type: "application/pdf",
    });
  }, 10000);

  describe("getPdfInfo", () => {
    it("should get document info from PDF Blob", async () => {
      const info = await getPdfInfo(testPdfFile);

      expect(info).toBeDefined();
      expect(info.numPages).toBe(3);
      expect(info.title).toBe("Test PDF Document");
      expect(info.author).toBe("PDF Utils Test Suite");
      expect(info.subject).toBe("Integration Testing");
      expect(info.keywords).toContain("test");
      expect(info.creator).toBe("pdf-lib");
      expect(info.producer).toContain("pdf-lib"); // pdf-lib sets its own producer
      expect(info.creationDate).toBeInstanceOf(Date);
    });

    it("should handle PDF File object", async () => {
      const info = await getPdfInfo(testPdfFile);

      expect(info.numPages).toBe(3);
      expect(info.title).toBe("Test PDF Document");
    });
  });

  describe("getPageInfo", () => {
    it("should get page dimensions", async () => {
      const pageInfo = await getPageInfo(testPdfFile, 1);

      expect(pageInfo).toBeDefined();
      expect(pageInfo.pageNumber).toBe(1);
      expect(pageInfo.width).toBe(600);
      expect(pageInfo.height).toBe(800);
      expect(pageInfo.rotation).toBe(0);
    });

    it("should get info for different pages", async () => {
      const page1 = await getPageInfo(testPdfFile, 1);
      const page2 = await getPageInfo(testPdfFile, 2);
      const page3 = await getPageInfo(testPdfFile, 3);

      expect(page1.pageNumber).toBe(1);
      expect(page2.pageNumber).toBe(2);
      expect(page3.pageNumber).toBe(3);

      // All pages have same dimensions in our test PDF
      expect(page1.width).toBe(page2.width);
      expect(page2.width).toBe(page3.width);
    });

    it("should throw error for invalid page number", async () => {
      await expect(getPageInfo(testPdfFile, 0)).rejects.toThrow(/out of range/);
      await expect(getPageInfo(testPdfFile, 999)).rejects.toThrow(
        /out of range/,
      );
    });
  });

  describe("extractPage", () => {
    it("should extract a single page", async () => {
      const extractedBlob = await extractPage(testPdfFile, 2);

      expect(extractedBlob).toBeInstanceOf(Blob);
      expect(extractedBlob.type).toBe("application/pdf");

      // Verify the extracted PDF has only 1 page
      const extractedFile = new File([extractedBlob], "extracted.pdf", {
        type: "application/pdf",
      });
      const info = await getPdfInfo(extractedFile);
      expect(info.numPages).toBe(1);
    });

    it("should extract first page", async () => {
      const extractedBlob = await extractPage(testPdfFile, 1);
      const extractedFile = new File([extractedBlob], "page1.pdf");
      const info = await getPdfInfo(extractedFile);

      expect(info.numPages).toBe(1);
    });

    it("should extract last page", async () => {
      const extractedBlob = await extractPage(testPdfFile, 3);
      const extractedFile = new File([extractedBlob], "page3.pdf");
      const info = await getPdfInfo(extractedFile);

      expect(info.numPages).toBe(1);
    });

    it("should throw error for invalid page", async () => {
      await expect(extractPage(testPdfFile, 0)).rejects.toThrow(/out of range/);
      await expect(extractPage(testPdfFile, 10)).rejects.toThrow(
        /out of range/,
      );
    });
  });

  describe("extractPageRange", () => {
    it("should extract multiple pages", async () => {
      const extractedBlob = await extractPageRange(testPdfFile, 1, 2);

      expect(extractedBlob).toBeInstanceOf(Blob);
      expect(extractedBlob.type).toBe("application/pdf");

      const extractedFile = new File([extractedBlob], "pages1-2.pdf");
      const info = await getPdfInfo(extractedFile);
      expect(info.numPages).toBe(2);
    });

    it("should extract all pages", async () => {
      const extractedBlob = await extractPageRange(testPdfFile, 1, 3);
      const extractedFile = new File([extractedBlob], "all-pages.pdf");
      const info = await getPdfInfo(extractedFile);

      expect(info.numPages).toBe(3);
    });

    it("should extract single page range", async () => {
      const extractedBlob = await extractPageRange(testPdfFile, 2, 2);
      const extractedFile = new File([extractedBlob], "page2-only.pdf");
      const info = await getPdfInfo(extractedFile);

      expect(info.numPages).toBe(1);
    });

    it("should throw error for invalid range", async () => {
      await expect(extractPageRange(testPdfFile, 0, 2)).rejects.toThrow(
        /Invalid page range/,
      );
      await expect(extractPageRange(testPdfFile, 1, 10)).rejects.toThrow(
        /Invalid page range/,
      );
      await expect(extractPageRange(testPdfFile, 3, 1)).rejects.toThrow(
        /Invalid page range/,
      );
    });
  });

  describe("PDF manipulation", () => {
    it("should handle extracted PDF for further operations", async () => {
      // Extract page 2
      const page2Blob = await extractPage(testPdfFile, 2);
      const page2File = new File([page2Blob], "page2.pdf");

      // Get info from extracted page
      const pageInfo = await getPageInfo(page2File, 1);
      expect(pageInfo.width).toBe(600);
      expect(pageInfo.height).toBe(800);

      // Extract from the extracted PDF (should have only 1 page now)
      const info = await getPdfInfo(page2File);
      expect(info.numPages).toBe(1);
    });
  });
});
