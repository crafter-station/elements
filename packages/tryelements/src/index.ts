#!/usr/bin/env node

import { parseArgs } from "node:util";

import { addCommand } from "./commands/add.js";
import { listCommand } from "./commands/list.js";

const VERSION = "0.1.0";

function printHelp() {
  console.log(`
  tryelements v${VERSION}

  Install SVG logos from tryelements.dev

  Usage:
    tryelements add <logos...> [options]
    tryelements list [options]

  Commands:
    add <logos...>    Install logo SVGs to your project
    list              List all available logos

  Options:
    -o, --output-dir  Output directory (default: public/)
    --overwrite       Overwrite existing files
    --json            Output list as JSON
    -h, --help        Show this help
    -v, --version     Show version

  Examples:
    tryelements add apple clerk astro
    tryelements add github --output-dir=src/assets
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

  if (command === "add") {
    const logos: string[] = [];
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
