/**
 * Composite icons for context menu actions
 * Following the pattern: Action + File Type
 * - Action: Copy (two overlapping sheets) or Download (arrow down)
 * - Type: SVG (bezier curve), JSX (code brackets), Image (photo frame)
 */

import type { LucideProps } from "lucide-react";

interface CompositeIconProps extends LucideProps {
  className?: string;
}

/**
 * Copy icon base with SVG badge (bezier curve overlay)
 * Action: Copy (two sheets) + Type: SVG (vector/bezier)
 */
export function CopySvgIcon({
  className = "h-4 w-4",
  ...props
}: CompositeIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <title>Copy as SVG</title>
      {/* Copy base (two sheets) */}
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
      {/* SVG badge: bezier curve (top right) */}
      <path
        d="M15 10.5c0-1 .5-2 1.5-2s1.5 1 1.5 2-.5 2-1.5 2"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/**
 * Copy icon with JSX badge (code brackets)
 * Action: Copy + Type: JSX (code)
 */
export function CopyJsxIcon({
  className = "h-4 w-4",
  ...props
}: CompositeIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <title>Copy as JSX</title>
      {/* Copy base */}
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
      {/* JSX badge: </> (top right) */}
      <path d="M16 9l-1.5 1.5L16 12M18 9l1.5 1.5L18 12" strokeWidth="1.5" />
    </svg>
  );
}

/**
 * Copy icon with Image badge (photo frame)
 * Action: Copy + Type: Image (webp/png)
 */
export function CopyImageIcon({
  className = "h-4 w-4",
  ...props
}: CompositeIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <title>Copy as Image</title>
      {/* Copy base */}
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
      {/* Image badge: mountain + sun (top right) */}
      <circle cx="17.5" cy="10.5" r="0.8" strokeWidth="1.5" />
      <path d="M15 13.5l1.5-1.5 2 2" strokeWidth="1.5" />
    </svg>
  );
}

/**
 * Download icon with SVG file
 * Action: Download (arrow down) + Type: SVG (vector file)
 */
export function DownloadSvgIcon({
  className = "h-4 w-4",
  ...props
}: CompositeIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <title>Download SVG</title>
      {/* File outline */}
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      {/* Download arrow */}
      <line x1="12" y1="11" x2="12" y2="17" strokeWidth="2" />
      <polyline points="9 14 12 17 15 14" strokeWidth="2" />
      {/* SVG badge: small bezier curve inside file */}
      <path d="M9 19c1-.5 2-.5 3 0" strokeWidth="1.5" />
    </svg>
  );
}

/**
 * Download icon with Image file (webp)
 * Action: Download + Type: Image (photo file)
 */
export function DownloadImageIcon({
  className = "h-4 w-4",
  ...props
}: CompositeIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <title>Download Image</title>
      {/* File outline */}
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      {/* Download arrow */}
      <line x1="12" y1="11" x2="12" y2="17" strokeWidth="2" />
      <polyline points="9 14 12 17 15 14" strokeWidth="2" />
      {/* Image badge: mountain + sun inside file */}
      <circle cx="10" cy="19" r="0.6" strokeWidth="1.5" />
      <path d="M8 21l1-1 2 2" strokeWidth="1.5" />
    </svg>
  );
}
