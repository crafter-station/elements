import { formatHex, formatHsl, oklch, parse, rgb } from "culori";

// ============================================================================
// TINTE THEME TYPES (Flexoki-inspired continuous scale)
// ============================================================================

export interface TinteBlock {
  bg: string;
  bg_2: string;
  ui: string;
  ui_2: string;
  ui_3: string;
  tx_3: string;
  tx_2: string;
  tx: string;
  pr: string;
  sc: string;
  ac_1: string;
  ac_2: string;
  ac_3: string;
}

export interface TinteTheme {
  light: TinteBlock;
  dark: TinteBlock;
  fonts?: {
    sans: string;
    serif: string;
    mono: string;
  };
  radius?: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  shadows?: {
    color: string;
    opacity: string;
    offsetX: string;
    offsetY: string;
    blur: string;
    spread: string;
  };
}

// ============================================================================
// PALETTE GENERATOR (Tailwind 50-950 ramps from single color)
// ============================================================================

interface PaletteColor {
  name: string;
  value: string;
}

function toOklch(color: string): { l: number; c: number; h: number } {
  const oklchColor = oklch(color);
  if (!oklchColor) throw new Error("Invalid color");

  return {
    l: oklchColor.l || 0,
    c: oklchColor.c || 0,
    h: oklchColor.h || 0,
  };
}

function oklchToRgb(
  l: number,
  c: number,
  h: number,
): { r: number; g: number; b: number } {
  const rgbColor = rgb({ mode: "oklch", l, c, h });
  if (!rgbColor) throw new Error("Invalid OKLCH values");

  return {
    r: rgbColor.r || 0,
    g: rgbColor.g || 0,
    b: rgbColor.b || 0,
  };
}

function rgbToHex(rgbColor: { r: number; g: number; b: number }): string {
  return formatHex({ mode: "rgb", ...rgbColor });
}

function interpolate(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

function findBestShadePosition(baseColor: string): number {
  const baseOklch = toOklch(baseColor);
  const targetLuminances = [
    0.985, 0.967, 0.922, 0.87, 0.708, 0.556, 0.439, 0.371, 0.269, 0.205, 0.145,
  ];

  let bestIndex = 0;
  let minDifference = Math.abs(targetLuminances[0] - baseOklch.l);

  for (let i = 1; i < targetLuminances.length; i++) {
    const difference = Math.abs(targetLuminances[i] - baseOklch.l);
    if (difference < minDifference) {
      minDifference = difference;
      bestIndex = i;
    }
  }

  return bestIndex;
}

function generateTailwindPalette(baseColor: string): PaletteColor[] {
  const stops = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
  const baseOklch = toOklch(baseColor);
  const basePosition = findBestShadePosition(baseColor);

  const lightEndpoint = {
    l: 0.985,
    c: Math.max(0.002, baseOklch.c * 0.05),
    h: baseOklch.h,
  };
  const darkEndpoint = {
    l: 0.145,
    c: Math.max(0.02, baseOklch.c * 0.6),
    h: baseOklch.h,
  };

  const palette: PaletteColor[] = [];

  for (let i = 0; i < stops.length; i++) {
    let interpolatedColor: { l: number; c: number; h: number };

    if (i === basePosition) {
      interpolatedColor = baseOklch;
    } else if (i < basePosition) {
      const factor = (basePosition - i) / basePosition;
      interpolatedColor = {
        l: interpolate(baseOklch.l, lightEndpoint.l, factor),
        c: interpolate(baseOklch.c, lightEndpoint.c, factor * 0.8),
        h: baseOklch.h,
      };
    } else {
      const factor = (i - basePosition) / (stops.length - 1 - basePosition);
      interpolatedColor = {
        l: interpolate(baseOklch.l, darkEndpoint.l, factor),
        c: interpolate(baseOklch.c, darkEndpoint.c, factor * 0.9),
        h: baseOklch.h,
      };
    }

    const rgbColor = oklchToRgb(
      interpolatedColor.l,
      interpolatedColor.c,
      interpolatedColor.h,
    );
    const hex = rgbToHex(rgbColor);

    palette.push({
      name: stops[i].toString(),
      value: hex,
    });
  }

  return palette;
}

// ============================================================================
// TINTE TO SHADCN CONVERSION
// ============================================================================

const DEFAULT_FONTS = {
  "font-sans": "Inter, system-ui, sans-serif",
  "font-serif": "Georgia, serif",
  "font-mono": "JetBrains Mono, monospace",
};

const DEFAULT_BASE = {
  "radius-sm": "0.25rem",
  "radius-md": "0.5rem",
  "radius-lg": "0.75rem",
  "radius-xl": "1rem",
  radius: "0.5rem",
};

const DEFAULT_SHADOWS = {
  "shadow-color": "#000000",
  "shadow-opacity": "0.1",
  "shadow-offset-x": "0px",
  "shadow-offset-y": "2px",
  "shadow-blur": "4px",
  "shadow-spread": "0px",
};

type ThemeMode = "light" | "dark";

const ANCHORS = {
  light: { primary: 600, border: 200, muted: 100, mutedFg: 600, accent: 300 },
  dark: { primary: 400, border: 800, muted: 900, mutedFg: 300, accent: 700 },
} as const;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

const L = (hex: string) => {
  const c = rgb(hex);
  if (!c) return 0;
  const lin = (x: number) =>
    x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  return 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
};

const contrast = (a: string, b: string) => {
  const la = L(a),
    lb = L(b);
  const lighter = Math.max(la, lb),
    darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
};

const bestTextFor = (bg: string) => {
  const w = "#ffffff",
    k = "#000000";
  return contrast(w, bg) >= contrast(k, bg) ? w : k;
};

const tweakL = (hex: string, dL: number) => {
  const c = oklch(hex);
  if (!c) return hex;
  return formatHex({
    mode: "oklch" as const,
    l: clamp01(c.l + dL),
    c: Math.max(0, c.c),
    h: c.h,
  });
};

function buildNeutralRamp(block: TinteBlock): string[] {
  const seed = block.ui || block.ui_2 || block.ui_3 || block.bg || "#808080";
  return generateTailwindPalette(seed).map((s) => s.value);
}

function buildRamp(seed?: string): string[] {
  return generateTailwindPalette(seed || "#64748b").map((s) => s.value);
}

const pick = (ramp: string[], step: number) => {
  const idx = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].indexOf(
    step,
  );
  return ramp[Math.max(0, idx)];
};

const surface = (bg: string, mode: ThemeMode, delta = 0.02) => {
  return tweakL(bg, mode === "light" ? +delta : -delta);
};

function computeShadowVars(
  tokens: Record<string, string>,
): Record<string, string> {
  const shadowColor = tokens["shadow-color"] || "hsl(0 0% 0%)";
  const opacity = parseFloat(tokens["shadow-opacity"] || "0.1");
  const offsetX = tokens["shadow-offset-x"] || "0px";
  const offsetY = tokens["shadow-offset-y"] || "2px";
  const blur = tokens["shadow-blur"] || "4px";
  const spread = tokens["shadow-spread"] || "0px";

  let hslColor = shadowColor;
  if (shadowColor.startsWith("#")) {
    const parsed = parse(shadowColor);
    if (parsed) {
      const hslString = formatHsl(parsed);
      hslColor = hslString.replace(/hsl\(|\)|\s+/g, "").replace(/,/g, " ");
    } else {
      hslColor = "0 0% 0%";
    }
  } else if (shadowColor.startsWith("hsl(")) {
    hslColor = shadowColor.replace(/hsl\(|\)/g, "").replace(/,/g, " ");
  }

  const colorWithOpacity = (opacityMultiplier: number) =>
    `hsl(${hslColor} / ${(opacity * opacityMultiplier).toFixed(2)})`;

  const secondLayer = (fixedOffsetY: string, fixedBlur: string): string => {
    const spread2 = `${(
      parseFloat(spread.replace("px", "") || "0") - 1
    ).toString()}px`;
    return `${offsetX} ${fixedOffsetY} ${fixedBlur} ${spread2} ${colorWithOpacity(
      1.0,
    )}`;
  };

  return {
    "shadow-2xs": `${offsetX} ${offsetY} ${blur} ${spread} ${colorWithOpacity(
      0.5,
    )}`,
    "shadow-xs": `${offsetX} ${offsetY} ${blur} ${spread} ${colorWithOpacity(
      0.5,
    )}`,
    "shadow-sm": `${offsetX} ${offsetY} ${blur} ${spread} ${colorWithOpacity(
      1.0,
    )}, ${secondLayer("1px", "2px")}`,
    shadow: `${offsetX} ${offsetY} ${blur} ${spread} ${colorWithOpacity(
      1.0,
    )}, ${secondLayer("1px", "2px")}`,
    "shadow-md": `${offsetX} ${offsetY} ${blur} ${spread} ${colorWithOpacity(
      1.0,
    )}, ${secondLayer("2px", "4px")}`,
    "shadow-lg": `${offsetX} ${offsetY} ${blur} ${spread} ${colorWithOpacity(
      1.0,
    )}, ${secondLayer("4px", "6px")}`,
    "shadow-xl": `${offsetX} ${offsetY} ${blur} ${spread} ${colorWithOpacity(
      1.0,
    )}, ${secondLayer("8px", "10px")}`,
    "shadow-2xl": `${offsetX} ${offsetY} ${blur} ${spread} ${colorWithOpacity(
      2.5,
    )}`,
  };
}

function mapTinteBlockToShadcn(
  block: TinteBlock,
  mode: ThemeMode,
  extendedTheme?: TinteTheme,
): Record<string, string> {
  const bg = block.bg || (mode === "light" ? "#ffffff" : "#0b0b0f");
  const fg = block.tx || bestTextFor(bg);

  const neutralRamp = buildNeutralRamp(block);
  const primaryRamp = buildRamp(block.pr);
  const secondaryRamp = buildRamp(block.sc);
  const accentRamp = buildRamp(block.ac_1 || block.ac_2 || block.pr);

  const A = ANCHORS[mode];
  const primary = pick(primaryRamp, A.primary);
  const secondary = pick(secondaryRamp, mode === "light" ? 500 : 400);
  const accent = pick(accentRamp, A.accent);
  const muted = pick(neutralRamp, A.muted);
  const border = pick(neutralRamp, A.border);

  const ensureFg = (on: string) => bestTextFor(on);
  const ring = tweakL(primary, mode === "light" ? +0.1 : -0.1);
  const card = surface(bg, mode, 0.03);
  const popover = surface(bg, mode, 0.03);

  const destructiveSeed = block.ac_3 || "#ef4444";
  const destructiveRamp = buildRamp(destructiveSeed);
  const destructive = pick(destructiveRamp, mode === "light" ? 500 : 400);

  const chart1 = pick(primaryRamp, 500);
  const chart2 = pick(accentRamp, 500);
  const chart3 = pick(primaryRamp, 300);
  const chart4 = pick(accentRamp, 700);
  const chart5 = pick(primaryRamp, 700);

  const sidebar = bg;
  const sidebarAccent = surface(bg, mode, 0.04);

  const result: Record<string, string> = {
    background: bg,
    foreground: fg,
    card,
    "card-foreground": ensureFg(card),
    popover,
    "popover-foreground": ensureFg(popover),
    primary,
    "primary-foreground": ensureFg(primary),
    secondary,
    "secondary-foreground": ensureFg(secondary),
    muted,
    "muted-foreground": pick(neutralRamp, A.mutedFg),
    accent,
    "accent-foreground": ensureFg(accent),
    destructive,
    "destructive-foreground": ensureFg(destructive),
    border,
    input: tweakL(border, mode === "light" ? -0.1 : +0.1),
    ring,
    "chart-1": chart1,
    "chart-2": chart2,
    "chart-3": chart3,
    "chart-4": chart4,
    "chart-5": chart5,
    sidebar,
    "sidebar-foreground": ensureFg(sidebar),
    "sidebar-primary": primary,
    "sidebar-primary-foreground": ensureFg(primary),
    "sidebar-accent": sidebarAccent,
    "sidebar-accent-foreground": ensureFg(sidebarAccent),
    "sidebar-border": border,
    "sidebar-ring": ring,
    ...DEFAULT_BASE,
  };

  // Add fonts if available
  if (extendedTheme?.fonts) {
    result["font-sans"] =
      `"${extendedTheme.fonts.sans}", ${DEFAULT_FONTS["font-sans"]}`;
    result["font-serif"] =
      `"${extendedTheme.fonts.serif}", ${DEFAULT_FONTS["font-serif"]}`;
    result["font-mono"] =
      `"${extendedTheme.fonts.mono}", ${DEFAULT_FONTS["font-mono"]}`;
  } else {
    Object.assign(result, DEFAULT_FONTS);
  }

  // Add border radius if available
  if (extendedTheme?.radius) {
    result["radius-sm"] = extendedTheme.radius.sm;
    result["radius-md"] = extendedTheme.radius.md;
    result["radius-lg"] = extendedTheme.radius.lg;
    result["radius-xl"] = extendedTheme.radius.xl;
    result.radius = extendedTheme.radius.md;
  }

  // Add shadow properties if available
  if (extendedTheme?.shadows) {
    result["shadow-color"] = extendedTheme.shadows.color;
    result["shadow-opacity"] = extendedTheme.shadows.opacity;
    result["shadow-offset-x"] = extendedTheme.shadows.offsetX;
    result["shadow-offset-y"] = extendedTheme.shadows.offsetY;
    result["shadow-blur"] = extendedTheme.shadows.blur;
    result["shadow-spread"] = extendedTheme.shadows.spread;
  } else {
    Object.assign(result, DEFAULT_SHADOWS);
  }

  // Add computed shadow variables
  const shadowVars = computeShadowVars(result);
  Object.assign(result, shadowVars);

  return result;
}

export function convertTinteToShadcn(tinte: TinteTheme) {
  const lightBlock = mapTinteBlockToShadcn(tinte.light, "light", tinte);
  const darkBlock = mapTinteBlockToShadcn(tinte.dark, "dark", tinte);

  return {
    light: lightBlock,
    dark: darkBlock,
  };
}
