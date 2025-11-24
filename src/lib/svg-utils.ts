/**
 * Clean up SVG markup for standalone use
 * - Removes React-specific class/className attributes
 * - Adds xmlns namespace if missing
 */
export function cleanSvgMarkup(svg: string): string {
  let cleaned = svg;

  // Remove class attributes
  cleaned = cleaned.replace(/\sclass="[^"]*"/g, "");
  cleaned = cleaned.replace(/\sclassName="[^"]*"/g, "");

  // Add xmlns if missing (required for standalone SVG)
  if (!cleaned.includes("xmlns=")) {
    cleaned = cleaned.replace(
      "<svg",
      '<svg xmlns="http://www.w3.org/2000/svg"',
    );
  }

  return cleaned;
}

/**
 * Get SVG dimensions from various sources
 * Priority: naturalWidth/Height > viewBox > fallback
 */
export function getSvgDimensions(
  img: HTMLImageElement,
  svg: string,
  fallback: number = 512,
): { width: number; height: number } {
  let width = img.naturalWidth;
  let height = img.naturalHeight;

  // If both are 0 or undefined, try to parse viewBox from SVG
  if (!width || !height) {
    const viewBoxMatch = svg.match(/viewBox=["']([^"']+)["']/);
    if (viewBoxMatch) {
      const parts = viewBoxMatch[1].split(/\s+/).map(Number);
      // viewBox format: "minX minY width height"
      width = parts[2] || fallback;
      height = parts[3] || fallback;
    } else {
      // Final fallback
      width = width || fallback;
      height = height || fallback;
    }
  }

  return { width, height };
}

/**
 * Create an Image element from SVG string
 */
export async function createImageFromSvg(
  svg: string,
): Promise<HTMLImageElement> {
  const img = new Image();

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = (err) => reject(err);
    img.src = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  });

  return img;
}

/**
 * Convert SVG to canvas with specified max dimension while preserving aspect ratio
 */
export async function svgToCanvas(
  svg: string,
  maxDimension: number,
): Promise<HTMLCanvasElement> {
  const img = await createImageFromSvg(svg);
  const { width, height } = getSvgDimensions(img, svg, maxDimension);

  // Preserve aspect ratio - scale to maxDimension
  const scale = maxDimension / Math.max(width, height);

  const canvas = document.createElement("canvas");
  canvas.width = width * scale;
  canvas.height = height * scale;

  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  return canvas;
}

/**
 * Convert canvas to blob
 */
export async function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string = "image/png",
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("Failed to create blob"));
      }
    }, type);
  });
}

/**
 * Download a blob as a file
 */
export function downloadBlob(
  blob: Blob,
  filename: string,
  mimeType: string,
): void {
  const url = URL.createObjectURL(new Blob([blob], { type: mimeType }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Copy text to clipboard
 */
export async function copyTextToClipboard(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
}

/**
 * Copy image to clipboard
 */
export async function copyImageToClipboard(blob: Blob): Promise<void> {
  await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
}
