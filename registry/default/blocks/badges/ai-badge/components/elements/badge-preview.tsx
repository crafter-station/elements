"use client";

import { forwardRef, useEffect, useState } from "react";

import QRCode from "qrcode";

import { cn } from "@/lib/utils";

export interface BadgeColors {
  background: string;
  foreground: string;
  primary: string;
  muted: string;
  mutedForeground: string;
}

export interface BadgeBranding {
  title: string;
  subtitle: string;
  logo?: React.ReactNode;
  organizationName?: string;
  organizationSubtitle?: string;
}

export type BadgePatternType =
  | "none"
  | "radial"
  | "grid"
  | "dots"
  | "waves"
  | "hexagons"
  | "circuits";

export interface BadgeBackground {
  /** Background pattern type */
  pattern?: BadgePatternType;
  /** Pattern opacity (0-1) */
  patternOpacity?: number;
  /** Pattern color (defaults to foreground) */
  patternColor?: string;
  /** Custom background image URL */
  imageUrl?: string;
  /** Background image opacity (0-1) */
  imageOpacity?: number;
  /** Gradient stops (e.g., ["#ff0000", "#0000ff"]) */
  gradient?: string[];
  /** Gradient direction in degrees (default: 135) */
  gradientAngle?: number;
}

export interface BadgePreviewProps {
  profilePictureUrl?: string | null;
  badgeNumber: string;
  firstName: string;
  lastName?: string;
  jobTitle: string;
  qrCodeUrl?: string;
  colors?: Partial<BadgeColors>;
  branding?: BadgeBranding;
  background?: BadgeBackground;
  className?: string;
}

const DEFAULT_COLORS: BadgeColors = {
  background: "#FAFAFA",
  foreground: "#0A0A0A",
  primary: "#00FF7F",
  muted: "#666666",
  mutedForeground: "#999999",
};

const DEFAULT_BRANDING: BadgeBranding = {
  title: "100 DAYS",
  subtitle: "OF SHIPPING",
};

const DEFAULT_BACKGROUND: BadgeBackground = {
  pattern: "radial",
  patternOpacity: 0.08,
};

// Badge dimensions - square photo area
const BADGE_WIDTH = 1080;
const BADGE_HEIGHT = 1600;
const PHOTO_SIZE = 960;

// Pre-calculate radial line endpoints to avoid hydration mismatches
const RADIAL_LINES = Array.from({ length: 24 }).map((_, i) => ({
  key: `radial-${i}`,
  x2: Math.round(BADGE_WIDTH / 2 + Math.cos((i * 15 * Math.PI) / 180) * 1400),
  y2: Math.round(BADGE_HEIGHT / 2 + Math.sin((i * 15 * Math.PI) / 180) * 1400),
}));

// Pre-calculate octagon points
const OCTAGON_POINTS = [200, 400, 600, 800, 1000, 1200].map((size, idx) => ({
  key: `octagon-${idx}`,
  points: Array.from({ length: 8 })
    .map((_, i) => {
      const angle = (i * 45 - 22.5) * (Math.PI / 180);
      const x = Math.round(BADGE_WIDTH / 2 + Math.cos(angle) * size);
      const y = Math.round(BADGE_HEIGHT / 2 + Math.sin(angle) * size);
      return `${x},${y}`;
    })
    .join(" "),
}));

// Pre-calculate hexagon positions
const HEXAGON_DATA = Array.from({ length: 12 }).flatMap((_, row) =>
  Array.from({ length: 10 }).map((_, col) => {
    const size = 60;
    const xOffset = row % 2 === 0 ? 0 : size * 0.866;
    const x = Math.round(col * size * 1.732 + xOffset);
    const y = Math.round(row * size * 1.5);
    const points = Array.from({ length: 6 })
      .map((_, i) => {
        const angle = (i * 60 - 30) * (Math.PI / 180);
        return `${Math.round(x + Math.cos(angle) * size)},${Math.round(y + Math.sin(angle) * size)}`;
      })
      .join(" ");
    return { key: `hex-${row}-${col}`, points };
  }),
);

// Pre-calculate wave paths
const WAVE_PATHS = Array.from({ length: 20 }).map((_, i) => ({
  key: `wave-${i}`,
  d: `M 0 ${i * 80 + 40} Q ${BADGE_WIDTH / 4} ${i * 80} ${BADGE_WIDTH / 2} ${i * 80 + 40} T ${BADGE_WIDTH} ${i * 80 + 40}`,
}));

// Pre-calculate grid lines
const GRID_VERTICAL = Array.from({ length: 22 }).map((_, i) => ({
  key: `v-${i}`,
  x: i * 50,
}));

const GRID_HORIZONTAL = Array.from({ length: 33 }).map((_, i) => ({
  key: `h-${i}`,
  y: i * 50,
}));

// Pre-calculate dots
const DOTS_DATA = Array.from({ length: 22 }).flatMap((_, i) =>
  Array.from({ length: 33 }).map((_, j) => ({
    key: `dot-${i}-${j}`,
    cx: i * 50 + 25,
    cy: j * 50 + 25,
  })),
);

// Pre-calculate circuit pattern
const CIRCUIT_VERTICAL = Array.from({ length: 15 }).map((_, i) => ({
  key: `circuit-v-${i}`,
  x: (i * 75) % BADGE_WIDTH,
  nodes: Array.from({ length: 8 }).map((_, j) => ({
    key: `node-${i}-${j}`,
    cy: j * 200 + 100,
  })),
}));

const CIRCUIT_HORIZONTAL = Array.from({ length: 10 }).map((_, i) => ({
  key: `h-circuit-${i}`,
  y: i * 160 + 80,
}));

// Pre-calculate gradient stops helper
const getGradientStops = (colors: string[]) =>
  colors.map((color, i) => ({
    key: `stop-${i}`,
    offset: `${(i / (colors.length - 1)) * 100}%`,
    color,
  }));

function BackgroundPattern({
  type,
  color,
  opacity,
}: {
  type: BadgePatternType;
  color: string;
  opacity: number;
}) {
  if (type === "none") return null;

  return (
    <g clipPath="url(#bgClip)" opacity={opacity}>
      {type === "radial" && (
        <>
          {/* Radial lines from center */}
          {RADIAL_LINES.map((line) => (
            <line
              key={line.key}
              x1={BADGE_WIDTH / 2}
              y1={BADGE_HEIGHT / 2}
              x2={line.x2}
              y2={line.y2}
              stroke={color}
              strokeWidth="2"
            />
          ))}
          {/* Concentric octagons */}
          {OCTAGON_POINTS.map((octagon) => (
            <polygon
              key={octagon.key}
              points={octagon.points}
              fill="none"
              stroke={color}
              strokeWidth="1.5"
            />
          ))}
        </>
      )}

      {type === "grid" && (
        <>
          {/* Vertical lines */}
          {GRID_VERTICAL.map((line) => (
            <line
              key={line.key}
              x1={line.x}
              y1={0}
              x2={line.x}
              y2={BADGE_HEIGHT}
              stroke={color}
              strokeWidth="1"
            />
          ))}
          {/* Horizontal lines */}
          {GRID_HORIZONTAL.map((line) => (
            <line
              key={line.key}
              x1={0}
              y1={line.y}
              x2={BADGE_WIDTH}
              y2={line.y}
              stroke={color}
              strokeWidth="1"
            />
          ))}
        </>
      )}

      {type === "dots" &&
        DOTS_DATA.map((dot) => (
          <circle key={dot.key} cx={dot.cx} cy={dot.cy} r="3" fill={color} />
        ))}

      {type === "waves" &&
        WAVE_PATHS.map((wave) => (
          <path
            key={wave.key}
            d={wave.d}
            fill="none"
            stroke={color}
            strokeWidth="1.5"
          />
        ))}

      {type === "hexagons" &&
        HEXAGON_DATA.map((hex) => (
          <polygon
            key={hex.key}
            points={hex.points}
            fill="none"
            stroke={color}
            strokeWidth="1"
          />
        ))}

      {type === "circuits" && (
        <>
          {/* Circuit-like pattern */}
          {CIRCUIT_VERTICAL.map((circuit) => (
            <g key={circuit.key}>
              <line
                x1={circuit.x}
                y1={0}
                x2={circuit.x}
                y2={BADGE_HEIGHT}
                stroke={color}
                strokeWidth="1"
                strokeDasharray="10,20"
              />
              {circuit.nodes.map((node) => (
                <circle
                  key={node.key}
                  cx={circuit.x}
                  cy={node.cy}
                  r="4"
                  fill={color}
                />
              ))}
            </g>
          ))}
          {CIRCUIT_HORIZONTAL.map((line) => (
            <line
              key={line.key}
              x1={0}
              y1={line.y}
              x2={BADGE_WIDTH}
              y2={line.y}
              stroke={color}
              strokeWidth="1"
              strokeDasharray="15,25"
            />
          ))}
        </>
      )}
    </g>
  );
}

export const BadgePreview = forwardRef<SVGSVGElement, BadgePreviewProps>(
  function BadgePreview(
    {
      profilePictureUrl,
      badgeNumber,
      firstName,
      lastName = "",
      jobTitle,
      qrCodeUrl,
      colors: customColors,
      branding: customBranding,
      background: customBackground,
      className,
    },
    ref,
  ) {
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
    const colors = { ...DEFAULT_COLORS, ...customColors };
    const branding = { ...DEFAULT_BRANDING, ...customBranding };
    const background = { ...DEFAULT_BACKGROUND, ...customBackground };

    useEffect(() => {
      const generateQR = async () => {
        try {
          const numberOnly = badgeNumber.replace("#", "");
          const url =
            qrCodeUrl ||
            (typeof window !== "undefined"
              ? `${window.location.origin}/p/${numberOnly}`
              : "");

          if (!url) return;

          const qrDataUrl = await QRCode.toDataURL(url, {
            width: 120,
            margin: 0,
            color: {
              dark: colors.foreground,
              light: colors.background,
            },
          });
          setQrCodeDataUrl(qrDataUrl);
        } catch (error) {
          console.error("Error generating QR code:", error);
        }
      };

      generateQR();
    }, [badgeNumber, qrCodeUrl, colors.foreground, colors.background]);

    const getNameFontSize = (name: string) => {
      if (name.length > 12) return "52";
      if (name.length > 8) return "64";
      return "72";
    };

    const gradientId = "badgeGradient";
    const hasGradient = background.gradient && background.gradient.length >= 2;

    return (
      <div
        data-slot="badge-preview"
        className={cn("w-full overflow-hidden", className)}
      >
        <div
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: `${BADGE_WIDTH}/${BADGE_HEIGHT}` }}
        >
          <svg
            ref={ref}
            width={BADGE_WIDTH}
            height={BADGE_HEIGHT}
            viewBox={`0 0 ${BADGE_WIDTH} ${BADGE_HEIGHT}`}
            className="absolute top-0 left-0 w-full h-full"
            preserveAspectRatio="xMidYMid meet"
            style={{ overflow: "hidden" }}
            role="img"
            aria-labelledby="badge-title"
          >
            <title id="badge-title">{`${firstName} ${lastName} - ${branding.title} Badge`}</title>
            <defs>
              <filter id="grayscale">
                <feColorMatrix
                  type="matrix"
                  values="0.33 0.33 0.33 0 0
                          0.33 0.33 0.33 0 0
                          0.33 0.33 0.33 0 0
                          0 0 0 1 0"
                />
              </filter>

              <clipPath id="photoClip">
                <rect x="60" y="60" width={PHOTO_SIZE} height={PHOTO_SIZE} />
              </clipPath>

              <clipPath id="bgClip">
                <rect width={BADGE_WIDTH} height={BADGE_HEIGHT} />
              </clipPath>

              {/* Gradient definition */}
              {hasGradient && (
                <linearGradient
                  id={gradientId}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                  gradientTransform={`rotate(${background.gradientAngle || 135}, 0.5, 0.5)`}
                >
                  {getGradientStops(background.gradient || []).map((stop) => (
                    <stop
                      key={stop.key}
                      offset={stop.offset}
                      stopColor={stop.color}
                    />
                  ))}
                </linearGradient>
              )}
            </defs>

            {/* Background - solid color or gradient */}
            <rect
              width={BADGE_WIDTH}
              height={BADGE_HEIGHT}
              fill={hasGradient ? `url(#${gradientId})` : colors.background}
            />

            {/* Custom background image */}
            {background.imageUrl && (
              <image
                href={background.imageUrl}
                x="0"
                y="0"
                width={BADGE_WIDTH}
                height={BADGE_HEIGHT}
                preserveAspectRatio="xMidYMid slice"
                opacity={background.imageOpacity ?? 0.3}
              />
            )}

            {/* Background pattern */}
            <BackgroundPattern
              type={background.pattern || "radial"}
              color={background.patternColor || colors.foreground}
              opacity={background.patternOpacity ?? 0.08}
            />

            {/* Photo area background */}
            <rect
              x="60"
              y="60"
              width={PHOTO_SIZE}
              height={PHOTO_SIZE}
              fill="#E5E5E5"
            />

            {/* Profile picture */}
            {profilePictureUrl && (
              <image
                href={profilePictureUrl}
                x="60"
                y="60"
                width={PHOTO_SIZE}
                height={PHOTO_SIZE}
                filter="url(#grayscale)"
                preserveAspectRatio="xMidYMid slice"
                clipPath="url(#photoClip)"
              />
            )}

            {/* L-Bracket frame element */}
            <path
              d="M60 1020 L60 1260 L200 1260"
              fill="none"
              stroke={colors.foreground}
              strokeWidth="16"
            />

            {/* Badge Number */}
            <text
              x="100"
              y="1080"
              fill={colors.muted}
              fontSize="28"
              fontFamily="'Geist Mono', monospace"
              letterSpacing="0.15em"
            >
              {badgeNumber}
            </text>

            {/* First Name */}
            <text
              x="100"
              y="1160"
              fill={colors.foreground}
              fontSize={getNameFontSize(firstName)}
              fontWeight="700"
              fontFamily="'Geist', 'Geist Mono', monospace"
              letterSpacing="-0.02em"
            >
              {firstName.toUpperCase()}
            </text>

            {/* Last Name */}
            {lastName && (
              <text
                x="100"
                y="1240"
                fill={colors.foreground}
                fontSize={getNameFontSize(lastName)}
                fontWeight="700"
                fontFamily="'Geist', 'Geist Mono', monospace"
                letterSpacing="-0.02em"
              >
                {lastName.toUpperCase()}
              </text>
            )}

            {/* Role */}
            <text
              x="100"
              y={lastName ? "1300" : "1220"}
              fill={colors.muted}
              fontSize="24"
              fontFamily="'Geist Mono', monospace"
              letterSpacing="0.1em"
            >
              → {jobTitle.toUpperCase()}
            </text>

            {/* Organization branding - right side */}
            {(branding.organizationName || branding.logo) && (
              <g transform="translate(1020, 1060)">
                {branding.logo}
                {branding.organizationName && (
                  <>
                    <text
                      x="0"
                      y="60"
                      fill={colors.muted}
                      fontSize="20"
                      fontFamily="'Geist Mono', monospace"
                      letterSpacing="0.1em"
                      textAnchor="end"
                    >
                      {branding.organizationName.toUpperCase()}
                    </text>
                    {branding.organizationSubtitle && (
                      <text
                        x="0"
                        y="88"
                        fill={colors.foreground}
                        fontSize="20"
                        fontWeight="700"
                        fontFamily="'Geist Mono', monospace"
                        letterSpacing="0.1em"
                        textAnchor="end"
                      >
                        {branding.organizationSubtitle.toUpperCase()}
                      </text>
                    )}
                  </>
                )}
              </g>
            )}

            {/* Bottom divider line */}
            <line
              x1="60"
              y1="1360"
              x2="1020"
              y2="1360"
              stroke={colors.foreground}
              strokeWidth="2"
            />

            {/* Brand title */}
            <text
              x="100"
              y="1460"
              fill={colors.foreground}
              fontSize="56"
              fontWeight="700"
              fontFamily="'Geist', 'Geist Mono', monospace"
              letterSpacing="-0.02em"
            >
              {branding.title}
            </text>

            {/* Accent square next to brand */}
            <rect
              x="460"
              y="1418"
              width="48"
              height="48"
              fill={colors.primary}
            />

            {/* Brand subtitle */}
            <text
              x="100"
              y="1520"
              fill={colors.muted}
              fontSize="20"
              fontFamily="'Geist Mono', monospace"
              letterSpacing="0.2em"
            >
              {branding.subtitle}
            </text>

            {/* QR Code */}
            {qrCodeDataUrl && (
              <image
                href={qrCodeDataUrl}
                x="900"
                y="1420"
                width="120"
                height="120"
              />
            )}

            {/* Corner accents - top left */}
            <rect x="60" y="60" width="8" height="40" fill={colors.primary} />
            <rect x="60" y="60" width="40" height="8" fill={colors.primary} />

            {/* Corner accents - top right */}
            <rect x="1012" y="60" width="8" height="40" fill={colors.primary} />
            <rect x="980" y="60" width="40" height="8" fill={colors.primary} />

            {/* Corner accents - bottom left of photo */}
            <rect x="60" y="980" width="8" height="40" fill={colors.primary} />
            <rect x="60" y="1012" width="40" height="8" fill={colors.primary} />

            {/* Corner accents - bottom right of photo */}
            <rect
              x="1012"
              y="980"
              width="8"
              height="40"
              fill={colors.primary}
            />
            <rect
              x="980"
              y="1012"
              width="40"
              height="8"
              fill={colors.primary}
            />
          </svg>
        </div>
      </div>
    );
  },
);
