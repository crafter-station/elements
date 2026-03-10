// Setup file for vitest
// This runs before each test file

import { vi } from "vitest";

// Mock canvas-related browser APIs for PDF rendering tests
globalThis.HTMLCanvasElement.prototype.getContext = vi.fn(() => {
  return {
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    getImageData: vi.fn(),
    putImageData: vi.fn(),
    createImageData: vi.fn(),
    setTransform: vi.fn(),
    drawImage: vi.fn(),
    save: vi.fn(),
    fillText: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    closePath: vi.fn(),
    stroke: vi.fn(),
    translate: vi.fn(),
    scale: vi.fn(),
    rotate: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    measureText: vi.fn(() => ({ width: 0 })),
    transform: vi.fn(),
    rect: vi.fn(),
    clip: vi.fn(),
  };
}) as any;

globalThis.HTMLCanvasElement.prototype.toDataURL = vi.fn(
  () => "data:image/png;base64,mock-image-data",
);
