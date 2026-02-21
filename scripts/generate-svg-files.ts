#!/usr/bin/env bun

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

const PUBLIC_R = join(process.cwd(), "public/r");
const SVG_DIR = join(PUBLIC_R, "svg");

function ensureDir(path: string) {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }
}

function extractDefaultProps(source: string): Record<string, string> {
  const defaults: Record<string, string> = {};
  const funcMatch = source.match(/function\s+\w+\s*\(\s*\{/);
  if (!funcMatch || funcMatch.index === undefined) return defaults;

  const paramStart = funcMatch.index + funcMatch[0].length;
  let depth = 1;
  let paramEnd = paramStart;
  for (let i = paramStart; i < source.length && depth > 0; i++) {
    if (source[i] === "{") depth++;
    if (source[i] === "}") depth--;
    if (depth === 0) {
      paramEnd = i;
      break;
    }
  }

  const paramBlock = source.slice(paramStart, paramEnd);
  const defaultMatches = paramBlock.matchAll(/(\w+)\s*=\s*"([^"]+)"/g);
  for (const match of defaultMatches) {
    defaults[match[1]] = match[2];
  }
  return defaults;
}

function resolveColorsObject(
  source: string,
  defaults: Record<string, string>,
): Record<string, string> {
  const colorsBlock = source.match(
    /const COLORS\s*=\s*(\{[\s\S]*?\})\s*(?:as const)?;/,
  );
  if (!colorsBlock) return {};

  const mode = defaults.mode || "light";
  const colorScheme = defaults.colorScheme || "brand";
  const resolved: Record<string, string> = {};

  const colorsStr = colorsBlock[1];

  const nestedSchemeMode = new RegExp(
    `${colorScheme}:\\s*\\{[^}]*${mode}:\\s*\\{([^}]+)\\}`,
    "m",
  );
  const nestedMatch = colorsStr.match(nestedSchemeMode);
  if (nestedMatch) {
    const entries = nestedMatch[1].matchAll(/(\w+):\s*"([^"]+)"/g);
    for (const entry of entries) {
      resolved[entry[1]] = entry[2];
    }
    return resolved;
  }

  const schemeModeVal = new RegExp(
    `${colorScheme}:\\s*\\{[^}]*${mode}:\\s*"([^"]+)"`,
    "m",
  );
  const schemeMatch = colorsStr.match(schemeModeVal);
  if (schemeMatch) {
    resolved.color = schemeMatch[1];
    return resolved;
  }

  const simpleModeVal = new RegExp(`${mode}:\\s*"([^"]+)"`);
  const simpleMatch = colorsStr.match(simpleModeVal);
  if (simpleMatch) {
    resolved.color = simpleMatch[1];
    return resolved;
  }

  return resolved;
}

function resolveLocalVariables(
  source: string,
  defaults: Record<string, string>,
  colors: Record<string, string>,
): Record<string, string> {
  const vars: Record<string, string> = {};
  const mode = defaults.mode || "light";
  const colorScheme = defaults.colorScheme || "brand";

  const textColorMatch = source.match(
    /const textColor\s*=\s*mode\s*===\s*"dark"\s*\?\s*"([^"]+)"\s*:\s*"([^"]+)"/,
  );
  if (textColorMatch) {
    vars.textColor = mode === "dark" ? textColorMatch[1] : textColorMatch[2];
  }

  const ternaryVars = source.matchAll(
    /const (\w+)\s*=\s*colorScheme\s*===\s*"brand"\s*\?\s*"([^"]+)"\s*:\s*"([^"]+)"/g,
  );
  for (const m of ternaryVars) {
    vars[m[1]] = colorScheme === "brand" ? m[2] : m[3];
  }

  const ternaryMode = source.matchAll(
    /const (\w+)\s*=\s*colorScheme\s*===\s*"brand"\s*\?\s*mode\s*===\s*"light"\s*\?\s*"([^"]+)"\s*:\s*"([^"]+)"\s*:\s*COLORS\.grayscale\[mode\]/g,
  );
  for (const m of ternaryMode) {
    if (colorScheme === "brand") {
      vars[m[1]] = mode === "light" ? m[2] : m[3];
    } else {
      const colorsBlock = source.match(
        /const COLORS\s*=\s*(\{[\s\S]*?\})\s*(?:as const)?;/,
      );
      if (colorsBlock) {
        const grayMatch = colorsBlock[1].match(
          new RegExp(`grayscale:\\s*\\{[^}]*${mode}:\\s*"([^"]+)"`),
        );
        vars[m[1]] = grayMatch ? grayMatch[1] : "currentColor";
      }
    }
  }

  const colorAssign = source.match(
    /const color\s*=\s*COLORS\[colorScheme\]\[mode\]/,
  );
  if (colorAssign && colors.color) {
    vars.color = colors.color;
  } else if (colorAssign) {
    const colorsBlock = source.match(
      /const COLORS\s*=\s*(\{[\s\S]*?\})\s*(?:as const)?;/,
    );
    if (colorsBlock) {
      const val = colorsBlock[1].match(
        new RegExp(`${colorScheme}:\\s*\\{[^}]*${mode}:\\s*"([^"]+)"`),
      );
      if (val) vars.color = val[1];
    }
  }

  const simpleColorAssign = source.match(/const color\s*=\s*COLORS\[mode\]/);
  if (simpleColorAssign) {
    vars.color = colors.color || "currentColor";
  }

  const genericColorAssigns = source.matchAll(
    /const (\w+)\s*=\s*COLORS\[colorScheme\]\[mode\]/g,
  );
  for (const m of genericColorAssigns) {
    if (!vars[m[1]]) {
      vars[m[1]] = colors.color || "currentColor";
    }
  }

  const genericColorBrand = source.matchAll(
    /const (\w+)\s*=\s*colorScheme\s*===\s*"brand"\s*\?\s*mode\s*===\s*"(?:light|dark)"\s*\?\s*"([^"]+)"\s*:\s*"([^"]+)"\s*:\s*(?:mode\s*===\s*"(?:light|dark)"\s*\?\s*"([^"]+)"\s*:\s*"([^"]+)"|COLORS\.?\w*(?:\[\w+\])*)/g,
  );
  for (const m of genericColorBrand) {
    if (!vars[m[1]]) {
      if (colorScheme === "brand") {
        vars[m[1]] = mode === "light" ? m[2] : m[3];
      } else if (m[4] && m[5]) {
        vars[m[1]] = mode === "light" ? m[4] : m[5];
      }
    }
  }

  return vars;
}

function extractJsxVariable(source: string, varName: string): string | null {
  const pattern = new RegExp(`const ${varName}\\s*=\\s*\\(\\s*\\n?`, "m");
  const match = source.match(pattern);
  if (!match || match.index === undefined) return null;

  const start = source.indexOf("(", match.index + `const ${varName}`.length);
  if (start === -1) return null;

  let depth = 0;
  for (let i = start; i < source.length; i++) {
    if (source[i] === "(") depth++;
    if (source[i] === ")") {
      depth--;
      if (depth === 0) {
        return source.slice(start + 1, i).trim();
      }
    }
  }
  return null;
}

function extractJsxObjectEntries(
  source: string,
  objName: string,
): Record<string, string> {
  const entries: Record<string, string> = {};
  const pattern = new RegExp(`const ${objName}\\s*=\\s*\\{`, "m");
  const match = source.match(pattern);
  if (!match || match.index === undefined) return entries;

  const start = source.indexOf("{", match.index + `const ${objName}`.length);
  if (start === -1) return entries;

  let depth = 0;
  let objEnd = start;
  for (let i = start; i < source.length; i++) {
    if (source[i] === "{") depth++;
    if (source[i] === "}") {
      depth--;
      if (depth === 0) {
        objEnd = i;
        break;
      }
    }
  }

  const objBody = source.slice(start + 1, objEnd);

  const parenEntryPattern = /(\w+):\s*\(\s*\n?([\s\S]*?)\n?\s*\)/g;
  for (const entryMatch of objBody.matchAll(parenEntryPattern)) {
    const key = entryMatch[1];
    const value = entryMatch[2].trim();
    if (value.startsWith("<")) {
      entries[key] = value;
    }
  }

  const selfClosingPattern = /(\w+):\s*(<\w+[^>]*\/>)/g;
  for (const entryMatch of objBody.matchAll(selfClosingPattern)) {
    const key = entryMatch[1];
    if (!entries[key]) {
      entries[key] = entryMatch[2].trim();
    }
  }

  return entries;
}

function findLastSvgReturn(source: string): string | null {
  const returns = findSvgReturns(source);
  return returns[returns.length - 1] || null;
}

function findSvgReturns(source: string): string[] {
  const returns: string[] = [];
  const returnPattern = /return\s*\(/g;

  for (const match of source.matchAll(returnPattern)) {
    const beforeReturn = source.slice(
      Math.max(0, match.index - 5),
      match.index,
    );
    if (beforeReturn.includes("//")) continue;

    const parenStart = source.indexOf("(", match.index + 6);
    if (parenStart === -1) continue;

    let depth = 0;
    for (let i = parenStart; i < source.length; i++) {
      if (source[i] === "(") depth++;
      if (source[i] === ")") {
        depth--;
        if (depth === 0) {
          const content = source.slice(parenStart + 1, i).trim();
          if (content.includes("<svg")) {
            returns.push(content);
          }
          break;
        }
      }
    }
  }

  return returns;
}

function convertStyleObject(styleStr: string): string {
  const inner = styleStr.replace(/^\{\{/, "").replace(/\}\}$/, "").trim();
  const parts = inner
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  const cssProps: string[] = [];

  for (const part of parts) {
    const colonIdx = part.indexOf(":");
    if (colonIdx === -1) continue;
    const key = part.slice(0, colonIdx).trim();
    let value = part.slice(colonIdx + 1).trim();
    value = value.replace(/^["']|["']$/g, "");

    const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
    cssProps.push(`${cssKey}:${value}`);
  }

  return cssProps.join(";");
}

function jsxToSvg(
  jsx: string,
  colors: Record<string, string>,
  localVars: Record<string, string>,
  source: string,
): string {
  let svg = jsx;

  svg = svg.replace(/\s*className=\{[^}]*\}/g, "");
  svg = svg.replace(/\s*className="[^"]*"/g, "");
  svg = svg.replace(/\s*\{\.\.\.props\}/g, "");
  svg = svg.replace(/\s*role="img"/g, "");

  svg = svg.replace(/style=\{\{([^}]*)\}\}/g, (_match, inner) => {
    const css = convertStyleObject(`{{${inner}}}`);
    return css ? `style="${css}"` : "";
  });

  const allVars = { ...colors, ...localVars };

  svg = svg.replace(
    /fill=\{colors\.(\w+)\}/g,
    (_, key) => `fill="${allVars[key] || "currentColor"}"`,
  );
  svg = svg.replace(
    /stroke=\{colors\.(\w+)\}/g,
    (_, key) => `stroke="${allVars[key] || "currentColor"}"`,
  );
  svg = svg.replace(
    /fill=\{color\}/g,
    `fill="${allVars.color || "currentColor"}"`,
  );
  svg = svg.replace(
    /stroke=\{color\}/g,
    `stroke="${allVars.color || "currentColor"}"`,
  );
  svg = svg.replace(
    /fill=\{textColor\}/g,
    `fill="${allVars.textColor || "currentColor"}"`,
  );

  for (const [varName, varValue] of Object.entries(allVars)) {
    if (varName === "color" || varName === "textColor") continue;
    const fillPattern = new RegExp(`fill=\\{${varName}\\}`, "g");
    svg = svg.replace(fillPattern, `fill="${varValue}"`);
    const strokePattern = new RegExp(`stroke=\\{${varName}\\}`, "g");
    svg = svg.replace(strokePattern, `stroke="${varValue}"`);
  }

  svg = svg.replace(/stopColor=\{([^}]+)\}/g, (_, expr) => {
    const key = expr.replace(/colors\./, "").replace(/\s/g, "");
    return `stop-color="${allVars[key] || "currentColor"}"`;
  });

  const jsxVarRefs = svg.matchAll(/\{(\w+(?:\.\w+)?)\}/g);
  for (const ref of [...jsxVarRefs]) {
    const fullRef = ref[1];
    if (fullRef.includes(".")) {
      const [objName, propName] = fullRef.split(".");
      const entries = extractJsxObjectEntries(source, objName);
      if (entries[propName]) {
        let replacement = entries[propName];
        replacement = replacement.replace(
          /fill=\{colors\.(\w+)\}/g,
          (_, k) => `fill="${allVars[k] || "currentColor"}"`,
        );
        replacement = replacement.replace(
          /fill=\{color\}/g,
          `fill="${allVars.color || "currentColor"}"`,
        );
        replacement = replacement.replace(
          /stroke=\{color\}/g,
          `stroke="${allVars.color || "currentColor"}"`,
        );
        replacement = replacement.replace(
          /fill=\{[^}]+\}/g,
          `fill="currentColor"`,
        );
        replacement = replacement.replace(
          /stroke=\{[^}]+\}/g,
          `stroke="currentColor"`,
        );
        svg = svg.replace(`{${fullRef}}`, replacement);
      }
    } else {
      const extracted = extractJsxVariable(source, fullRef);
      if (extracted) {
        let replacement = extracted;
        replacement = replacement.replace(
          /fill=\{colors\.(\w+)\}/g,
          (_, k) => `fill="${allVars[k] || "currentColor"}"`,
        );
        replacement = replacement.replace(
          /fill=\{color\}/g,
          `fill="${allVars.color || "currentColor"}"`,
        );
        replacement = replacement.replace(
          /stroke=\{color\}/g,
          `stroke="${allVars.color || "currentColor"}"`,
        );
        for (const [vn, vv] of Object.entries(allVars)) {
          replacement = replacement.replace(
            new RegExp(`fill=\\{${vn}\\}`, "g"),
            `fill="${vv}"`,
          );
          replacement = replacement.replace(
            new RegExp(`stroke=\\{${vn}\\}`, "g"),
            `stroke="${vv}"`,
          );
        }
        replacement = replacement.replace(
          /fill=\{[^}]+\}/g,
          `fill="currentColor"`,
        );
        replacement = replacement.replace(
          /stroke=\{[^}]+\}/g,
          `stroke="currentColor"`,
        );
        svg = svg.replace(`{${fullRef}}`, replacement);
      }
    }
  }

  svg = svg.replace(/\{\/\*[\s\S]*?\*\/\}/g, "");
  svg = svg.replace(/\{`[^`]*`\}/g, "");

  svg = svg.replace(/stopColor=/g, "stop-color=");
  svg = svg.replace(/stopOpacity=/g, "stop-opacity=");
  svg = svg.replace(/fillRule=/g, "fill-rule=");
  svg = svg.replace(/clipRule=/g, "clip-rule=");
  svg = svg.replace(/clipPath=/g, "clip-path=");
  svg = svg.replace(/strokeWidth=/g, "stroke-width=");
  svg = svg.replace(/strokeLinecap=/g, "stroke-linecap=");
  svg = svg.replace(/strokeLinejoin=/g, "stroke-linejoin=");
  svg = svg.replace(/strokeMiterlimit=/g, "stroke-miterlimit=");

  if (!svg.includes("xmlns=")) {
    svg = svg.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  svg = svg.replace(/\n\s*/g, "\n");
  svg = svg.replace(/\n{3,}/g, "\n\n");
  svg = svg.trim();

  return svg;
}

function processLogo(name: string, jsonPath: string): string | null {
  try {
    const json = JSON.parse(readFileSync(jsonPath, "utf-8"));
    const content: string = json.files?.[0]?.content;
    if (!content) {
      console.warn(`  ⚠ ${name}: No file content found`);
      return null;
    }

    const defaults = extractDefaultProps(content);
    const colors = resolveColorsObject(content, defaults);
    const localVars = resolveLocalVariables(content, defaults, colors);

    const svgJsx = findLastSvgReturn(content);
    if (!svgJsx) {
      console.warn(`  ⚠ ${name}: Could not extract SVG return`);
      return null;
    }

    const svg = jsxToSvg(svgJsx, colors, localVars, content);

    if (svg.match(/\{[a-zA-Z]/)) {
      const remaining = svg.match(/\{[a-zA-Z][^}]*\}/g);
      if (remaining) {
        console.warn(
          `  ⚠ ${name}: Unresolved expressions: ${remaining.join(", ")}`,
        );
      }
    }

    return svg;
  } catch (error) {
    console.warn(
      `  ⚠ ${name}: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
    return null;
  }
}

export function generateSvgFiles() {
  ensureDir(SVG_DIR);

  const files = readdirSync(PUBLIC_R).filter((f) => f.endsWith("-logo.json"));

  console.log(`   Found ${files.length} logo registry files`);

  let success = 0;
  let failed = 0;
  const index: Array<{ name: string; file: string }> = [];

  for (const file of files) {
    const name = file.replace(".json", "");
    const jsonPath = join(PUBLIC_R, file);
    const svg = processLogo(name, jsonPath);

    if (svg) {
      const svgPath = join(SVG_DIR, `${name}.svg`);
      writeFileSync(svgPath, svg);
      index.push({ name, file: `${name}.svg` });
      success++;
    } else {
      failed++;
    }
  }

  const indexPath = join(SVG_DIR, "index.json");
  writeFileSync(indexPath, JSON.stringify(index, null, 2));

  console.log(`   ✓ Generated ${success} SVG files`);
  if (failed > 0) {
    console.log(`   ⚠ Failed: ${failed}`);
  }
  console.log(`   ✓ Wrote ${indexPath}`);

  return { success, failed };
}

if (import.meta.main) {
  console.log("🖼️  Generating SVG files from registry...\n");
  const result = generateSvgFiles();
  console.log(`\n✨ Done! ${result.success} SVGs generated.`);
}
