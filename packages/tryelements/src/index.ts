#!/usr/bin/env node

import { addCommand } from "./commands/add.js";
import { addHookCommand } from "./commands/add-hook.js";
import { hooksStatusCommand } from "./commands/hooks-status.js";
import { listCommand } from "./commands/list.js";
import { listHooksCommand } from "./commands/list-hooks.js";
import { removeHookCommand } from "./commands/remove-hook.js";

const VERSION = "0.2.0";

function printHelp() {
  console.log(`
  tryelements v${VERSION}

  Install components, logos, and Claude Code hooks from tryelements.dev

  Usage:
    tryelements add-logo <logos...> [options]
    tryelements list [options]
    tryelements add-hook <hooks...>
    tryelements remove-hook <hooks...>
    tryelements list-hooks [options]
    tryelements hooks-status

  Commands:
    add-logo <logos...>    Install logo SVGs to your project
    list                   List all available logos
    add-hook <hooks...>    Install Claude Code hooks
    remove-hook <hooks...> Remove installed hooks
    list-hooks             List available hooks
    hooks-status           Show installed hooks status

  Options:
    -o, --output-dir  Output directory for logos (default: public/)
    --overwrite       Overwrite existing logo files
    --json            Output list as JSON
    --event           Filter hooks by event (for list-hooks)
    -h, --help        Show this help
    -v, --version     Show version

  Examples:
    tryelements add-logo apple clerk astro
    tryelements add-logo github --output-dir=src/assets
    tryelements list
    tryelements add-hook notify-macos guard-branch
    tryelements list-hooks
    tryelements hooks-status
    tryelements remove-hook notify-macos
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
  } else if (command === "add-hook") {
    const names = rest.filter((a) => !a.startsWith("-"));
    await addHookCommand(names);
  } else if (command === "remove-hook") {
    const names = rest.filter((a) => !a.startsWith("-"));
    await removeHookCommand(names);
  } else if (command === "list-hooks") {
    const json = rest.includes("--json");
    const eventFlag = rest.find((a) => a.startsWith("--event="));
    const event = eventFlag ? eventFlag.split("=")[1] : undefined;
    await listHooksCommand({ json, event });
  } else if (command === "hooks-status") {
    await hooksStatusCommand();
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
