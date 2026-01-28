"use client";

import Atropos from "atropos/react";
import "atropos/css";

import { forwardRef } from "react";

import { cn } from "@/lib/utils";

import {
  type BadgeBackground,
  type BadgeBranding,
  type BadgeColors,
  type BadgePatternType,
  BadgePreview,
} from "./badge-preview";

export type { BadgeColors, BadgeBranding, BadgeBackground, BadgePatternType };

export interface AIBadgeProps {
  /** URL of the profile picture (can be AI-generated) */
  profilePictureUrl?: string | null;
  /** Badge/member number (e.g., "#001") */
  badgeNumber: string;
  /** First name */
  firstName: string;
  /** Last name */
  lastName?: string;
  /** Role or title displayed on badge */
  jobTitle: string;
  /** Custom URL for QR code (defaults to current origin + /p/{number}) */
  qrCodeUrl?: string;
  /** Custom color palette */
  colors?: Partial<BadgeColors>;
  /** Custom branding (title, subtitle, logo) */
  branding?: BadgeBranding;
  /** Custom background (pattern, image, gradient) */
  background?: BadgeBackground;
  /** Additional CSS classes */
  className?: string;
}

export const AIBadge = forwardRef<SVGSVGElement, AIBadgeProps>(function AIBadge(
  {
    profilePictureUrl,
    badgeNumber,
    firstName,
    lastName,
    jobTitle,
    qrCodeUrl,
    colors,
    branding,
    background,
    className,
  },
  ref,
) {
  return (
    <div data-slot="ai-badge" className={cn("w-full", className)}>
      <Atropos
        className="atropos-badge w-full"
        activeOffset={40}
        shadowScale={1.05}
        rotateXMax={15}
        rotateYMax={15}
        shadow={true}
        highlight={true}
      >
        {/* Outer glass frame - furthest back */}
        <div
          data-atropos-offset="-3"
          className="absolute inset-0 rounded-2xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
            boxShadow:
              "0 25px 80px rgba(0, 0, 0, 0.4), inset 1px 1px 2px rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        />

        {/* Badge content - middle layer */}
        <div
          data-atropos-offset="0"
          className="relative rounded-xl overflow-hidden"
          style={{
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
          }}
        >
          <BadgePreview
            ref={ref}
            profilePictureUrl={profilePictureUrl}
            badgeNumber={badgeNumber}
            firstName={firstName}
            lastName={lastName}
            jobTitle={jobTitle}
            qrCodeUrl={qrCodeUrl}
            colors={colors}
            branding={branding}
            background={background}
          />
        </div>
      </Atropos>

      <style jsx global>{`
          .atropos-badge {
            perspective: 1200px;
          }
          .atropos-badge .atropos-scale,
          .atropos-badge .atropos-rotate {
            transform-style: preserve-3d;
          }
          .atropos-badge .atropos-inner {
            transform-style: preserve-3d;
          }
          .atropos-badge .atropos-shadow {
            filter: blur(30px);
            background: radial-gradient(
              ellipse at center,
              rgba(0, 0, 0, 0.35) 0%,
              transparent 70%
            );
          }
          .atropos-badge .atropos-highlight {
            background: radial-gradient(
              ellipse at center,
              rgba(255, 255, 255, 0.15) 0%,
              transparent 60%
            );
          }
        `}</style>
    </div>
  );
});
