"use client";

import { useCallback, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export interface GenerateBadgeOptions {
  /** Scale factor for output image (default: 1) */
  scale?: number;
  /** Output format */
  format?: "png" | "jpeg";
  /** JPEG quality (0-1, default: 0.9) */
  quality?: number;
  /** Background color for JPEG (transparent areas) */
  backgroundColor?: string;
}

export interface UseGenerateBadgeReturn {
  /** Ref to attach to the badge SVG element */
  badgeRef: React.RefObject<SVGSVGElement | null>;
  /** Generate and download the badge as an image */
  generateAndDownload: (
    filename?: string,
    options?: GenerateBadgeOptions,
  ) => Promise<void>;
  /** Generate badge as a Blob */
  generateBlob: (options?: GenerateBadgeOptions) => Promise<Blob | null>;
  /** Generate badge as a data URL */
  generateDataUrl: (options?: GenerateBadgeOptions) => Promise<string | null>;
  /** Whether generation is in progress */
  isGenerating: boolean;
  /** Error if generation failed */
  error: Error | null;
}

/**
 * Convert an image URL to a base64 data URL
 */
async function imageUrlToBase64(url: string): Promise<string> {
  // Skip if already a data URL
  if (url.startsWith("data:")) {
    return url;
  }

  try {
    // Try fetching through a proxy or directly
    const response = await fetch(url, {
      mode: "cors",
      credentials: "omit",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    // If CORS fails, try loading via canvas
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }
        ctx.drawImage(img, 0, 0);
        try {
          resolve(canvas.toDataURL("image/png"));
        } catch {
          // If tainted canvas, return original URL
          resolve(url);
        }
      };

      img.onerror = () => {
        // Return original URL if all else fails
        resolve(url);
      };

      img.src = url;
    });
  }
}

/**
 * Embed all external images in SVG as base64 data URLs
 */
async function embedImagesInSvg(svg: SVGSVGElement): Promise<SVGSVGElement> {
  const clonedSvg = svg.cloneNode(true) as SVGSVGElement;
  const images = clonedSvg.querySelectorAll("image");

  const embedPromises = Array.from(images).map(async (img) => {
    const href =
      img.getAttribute("href") ||
      img.getAttributeNS("http://www.w3.org/1999/xlink", "href");
    if (href && !href.startsWith("data:")) {
      try {
        const base64 = await imageUrlToBase64(href);
        img.setAttribute("href", base64);
        // Also set xlink:href for compatibility
        img.setAttributeNS("http://www.w3.org/1999/xlink", "href", base64);
      } catch (err) {
        console.warn("Failed to embed image:", href, err);
      }
    }
  });

  await Promise.all(embedPromises);
  return clonedSvg;
}

/**
 * Hook for generating badge images from SVG
 */
export function useGenerateBadge(): UseGenerateBadgeReturn {
  const badgeRef = useRef<SVGSVGElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generateBlob = useCallback(
    async (options: GenerateBadgeOptions = {}): Promise<Blob | null> => {
      const svg = badgeRef.current;
      if (!svg) {
        setError(new Error("Badge SVG ref not attached"));
        return null;
      }

      const {
        scale = 1,
        format = "png",
        quality = 0.9,
        backgroundColor,
      } = options;

      setIsGenerating(true);
      setError(null);

      try {
        // Get SVG dimensions
        const svgRect = svg.getBoundingClientRect();
        const width = svg.viewBox.baseVal.width || svgRect.width;
        const height = svg.viewBox.baseVal.height || svgRect.height;

        // Clone SVG and embed all external images as base64
        const clonedSvg = await embedImagesInSvg(svg);
        clonedSvg.setAttribute("width", String(width));
        clonedSvg.setAttribute("height", String(height));

        // Serialize SVG
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(clonedSvg);
        const svgBlob = new Blob([svgString], {
          type: "image/svg+xml;charset=utf-8",
        });
        const svgUrl = URL.createObjectURL(svgBlob);

        // Create canvas
        const canvas = document.createElement("canvas");
        canvas.width = width * scale;
        canvas.height = height * scale;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          throw new Error("Could not get canvas context");
        }

        // Fill background if specified or format is JPEG
        if (backgroundColor || format === "jpeg") {
          ctx.fillStyle = backgroundColor || "#FFFFFF";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Scale context
        ctx.scale(scale, scale);

        // Load and draw SVG
        const img = new Image();
        img.crossOrigin = "anonymous";

        const blob = await new Promise<Blob | null>((resolve, reject) => {
          img.onload = () => {
            ctx.drawImage(img, 0, 0);
            URL.revokeObjectURL(svgUrl);

            canvas.toBlob(
              (blob) => {
                resolve(blob);
              },
              format === "jpeg" ? "image/jpeg" : "image/png",
              quality,
            );
          };

          img.onerror = () => {
            URL.revokeObjectURL(svgUrl);
            reject(new Error("Failed to load SVG as image"));
          };

          img.src = svgUrl;
        });

        return blob;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Failed to generate badge");
        setError(error);
        return null;
      } finally {
        setIsGenerating(false);
      }
    },
    [],
  );

  const generateDataUrl = useCallback(
    async (options: GenerateBadgeOptions = {}): Promise<string | null> => {
      const blob = await generateBlob(options);
      if (!blob) return null;

      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    },
    [generateBlob],
  );

  const generateAndDownload = useCallback(
    async (
      filename: string = "badge",
      options: GenerateBadgeOptions = {},
    ): Promise<void> => {
      const blob = await generateBlob(options);
      if (!blob) return;

      const { format = "png" } = options;
      const extension = format === "jpeg" ? "jpg" : "png";
      const finalFilename = filename.includes(".")
        ? filename
        : `${filename}.${extension}`;

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = finalFilename;
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();

      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
    },
    [generateBlob],
  );

  return {
    badgeRef,
    generateAndDownload,
    generateBlob,
    generateDataUrl,
    isGenerating,
    error,
  };
}

export interface GenerateBadgeButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** The generate badge hook return value */
  badge: UseGenerateBadgeReturn;
  /** Filename for download (without extension) */
  filename?: string;
  /** Generation options */
  options?: GenerateBadgeOptions;
  /** Content to show while generating */
  loadingContent?: React.ReactNode;
}

/**
 * Button component for downloading badge
 */
export function GenerateBadgeButton({
  badge,
  filename = "badge",
  options,
  loadingContent = "Generating...",
  children = "Download Badge",
  className,
  disabled,
  ...props
}: GenerateBadgeButtonProps) {
  const handleClick = async () => {
    await badge.generateAndDownload(filename, options);
  };

  return (
    <button
      data-slot="generate-badge-button"
      type="button"
      onClick={handleClick}
      disabled={disabled || badge.isGenerating}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium",
        "bg-primary text-primary-foreground hover:bg-primary/90",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {badge.isGenerating ? loadingContent : children}
    </button>
  );
}
