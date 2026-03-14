#!/usr/bin/env node

// src/commands/add.ts
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

// src/utils.ts
var REGISTRY_BASE =
  process.env.TRYELEMENTS_REGISTRY || "https://tryelements.dev/r";
function normalizeName(input) {
  const name = input.toLowerCase().trim();
  return name.endsWith("-logo") ? name : `${name}-logo`;
}
function svgUrl(logoName) {
  return `${REGISTRY_BASE}/svg/${normalizeName(logoName)}.svg`;
}
function logosIndexUrl() {
  return `${REGISTRY_BASE}/logos-index.json`;
}
async function fetchSvg(logoName) {
  const url = svgUrl(logoName);
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(`Logo "${logoName}" not found in registry`);
    }
    throw new Error(`Failed to fetch ${logoName}: ${res.statusText}`);
  }
  return res.text();
}
async function fetchLogosList() {
  const res = await fetch(logosIndexUrl());
  if (!res.ok) {
    throw new Error(`Failed to fetch logos list: ${res.statusText}`);
  }
  return res.json();
}

// src/commands/add.ts
async function addCommand(logos, options) {
  if (!logos.length) {
    console.error("Error: No logos specified");
    console.log(`
Usage: tryelements add-logo <logos...> [--output-dir=public/]`);
    console.log("Example: tryelements add-logo apple clerk astro");
    process.exit(1);
  }
  const outputDir = resolve(options.outputDir);
  mkdirSync(outputDir, { recursive: true });
  const results = [];
  for (const logo of logos) {
    const name = normalizeName(logo);
    const outputPath = join(outputDir, `${name}.svg`);
    if (existsSync(outputPath) && !options.overwrite) {
      results.push({
        name,
        status: "err",
        detail: "Already exists (use --overwrite)",
      });
      continue;
    }
    try {
      const svg = await fetchSvg(logo);
      writeFileSync(outputPath, svg);
      results.push({ name, status: "ok", detail: outputPath });
    } catch (error) {
      results.push({
        name,
        status: "err",
        detail: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
  console.log();
  for (const r of results) {
    const icon = r.status === "ok" ? "+" : "x";
    const detail = r.status === "ok" ? r.detail : r.detail;
    console.log(`  ${icon} ${r.name} -> ${detail}`);
  }
  const ok = results.filter((r) => r.status === "ok").length;
  console.log(`
  ${ok}/${logos.length} logos installed.`);
  if (ok < logos.length) {
    process.exit(1);
  }
}

// src/commands/list.ts
async function listCommand(options) {
  try {
    const logos = await fetchLogosList();
    if (options.json) {
      console.log(JSON.stringify(logos, null, 2));
      return;
    }
    console.log(`
  Available logos (${logos.length}):
`);
    const cols = 4;
    for (let i = 0; i < logos.length; i += cols) {
      const row = logos.slice(i, i + cols);
      console.log(`  ${row.map((n) => n.padEnd(22)).join("")}`);
    }
    console.log(`
  Install: tryelements add <name> [--output-dir=public/]`);
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// src/index.ts
var VERSION = "0.1.0";
function printHelp() {
  console.log(`
  tryelements v${VERSION}

  Install SVG logos from tryelements.dev

  Usage:
    tryelements add-logo <logos...> [options]
    tryelements list [options]

  Commands:
    add-logo <logos...>  Install logo SVGs to your project
    list                 List all available logos

  Options:
    -o, --output-dir  Output directory (default: public/)
    --overwrite       Overwrite existing files
    --json            Output list as JSON
    -h, --help        Show this help
    -v, --version     Show version

  Examples:
    tryelements add-logo apple clerk astro
    tryelements add-logo github --output-dir=src/assets
    tryelements list
`);
}
async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes("-h") || args.includes("--help")) {
    printHelp();
    return;
  }
  if (args.includes("-v") || args.includes("--version")) {
    console.log(VERSION);
    return;
  }
  const command = args[0];
  const rest = args.slice(1);
  if (command === "add-logo") {
    const logos = [];
    let outputDir = "public/";
    let overwrite = false;
    for (const arg of rest) {
      if (arg === "--overwrite") {
        overwrite = true;
      } else if (arg.startsWith("-o=") || arg.startsWith("--output-dir=")) {
        outputDir = arg.split("=")[1];
      } else if (arg === "-o" || arg === "--output-dir") {
        const idx = rest.indexOf(arg);
        if (idx + 1 < rest.length) {
          outputDir = rest[idx + 1];
        }
      } else if (!arg.startsWith("-")) {
        logos.push(arg);
      }
    }
    await addCommand(logos, { outputDir, overwrite });
  } else if (command === "list") {
    const json = rest.includes("--json");
    await listCommand({ json });
  } else {
    console.error(`Unknown command: ${command}`);
    printHelp();
    process.exit(1);
  }
}
main().catch((error) => {
  console.error("Fatal:", error.message || error);
  process.exit(1);
});
