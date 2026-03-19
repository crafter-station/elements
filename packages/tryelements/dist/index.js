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

// src/commands/add-hook.ts
// src/hooks-utils.ts
import {
  chmodSync,
  copyFileSync,
  existsSync as existsSync2,
  existsSync as existsSync3,
  mkdirSync as mkdirSync2,
  mkdirSync as mkdirSync3,
  readdirSync,
  readFileSync,
  writeFileSync as writeFileSync2,
  writeFileSync as writeFileSync3,
} from "node:fs";
import { dirname, join as join2 } from "node:path";

var REGISTRY_BASE2 =
  process.env.TRYELEMENTS_REGISTRY || "https://tryelements.dev/r";
var HOOKS_DIR = `${process.env.HOME}/.claude/hooks/elements`;
var SETTINGS_PATH = `${process.env.HOME}/.claude/settings.json`;
function hooksIndexUrl() {
  return `${REGISTRY_BASE2}/hooks-index.json`;
}
function hookScriptUrl(name) {
  return `${REGISTRY_BASE2.replace("/r", "")}/hooks/${name}.sh`;
}
async function fetchHooksIndex() {
  const res = await fetch(hooksIndexUrl());
  if (!res.ok)
    throw new Error(`Failed to fetch hooks index: ${res.statusText}`);
  return res.json();
}
async function fetchHookScript(name) {
  const res = await fetch(hookScriptUrl(name));
  if (!res.ok) {
    if (res.status === 404) throw new Error(`Hook "${name}" not found`);
    throw new Error(`Failed to fetch hook: ${res.statusText}`);
  }
  return res.text();
}
function readSettings() {
  if (!existsSync2(SETTINGS_PATH)) return {};
  return JSON.parse(readFileSync(SETTINGS_PATH, "utf-8"));
}
function writeSettings(settings) {
  const dir = dirname(SETTINGS_PATH);
  if (!existsSync2(dir)) mkdirSync2(dir, { recursive: true });
  const backupPath = `${SETTINGS_PATH}.bak`;
  if (existsSync2(SETTINGS_PATH) && !existsSync2(backupPath)) {
    copyFileSync(SETTINGS_PATH, backupPath);
  }
  writeFileSync2(
    SETTINGS_PATH,
    JSON.stringify(settings, null, 2) +
      `
`,
  );
}
function getHooksDir() {
  return HOOKS_DIR;
}
function getInstalledHooks() {
  if (!existsSync2(HOOKS_DIR)) return [];
  return readdirSync(HOOKS_DIR)
    .filter((f) => f.endsWith(".sh"))
    .map((f) => f.replace(".sh", ""));
}
function registerHook(name, event, matcher) {
  const settings = readSettings();
  if (!settings.hooks) settings.hooks = {};
  const hooks = settings.hooks;
  if (!hooks[event]) hooks[event] = [];
  const scriptPath = `${HOOKS_DIR}/${name}.sh`;
  const existing = hooks[event].find((e) =>
    e.hooks?.some((h) => h.command?.includes(`/${name}.sh`)),
  );
  if (existing) return;
  const hookEntry = {
    hooks: [{ type: "command", command: scriptPath }],
  };
  if (matcher) hookEntry.matcher = matcher;
  hooks[event].push(hookEntry);
  writeSettings(settings);
}
function unregisterHook(name) {
  const settings = readSettings();
  if (!settings.hooks) return;
  const hooks = settings.hooks;
  for (const event of Object.keys(hooks)) {
    hooks[event] = hooks[event].filter(
      (e) => !e.hooks?.some((h) => h.command?.includes(`/${name}.sh`)),
    );
    if (hooks[event].length === 0) {
      delete hooks[event];
    }
  }
  if (Object.keys(hooks).length === 0) {
    delete settings.hooks;
  }
  writeSettings(settings);
}

// src/commands/add-hook.ts
async function addHookCommand(names) {
  if (!names.length) {
    console.error("Error: No hooks specified");
    console.log(`
Usage: tryelements add-hook <hooks...>`);
    console.log("Example: tryelements add-hook notify-macos guard-branch");
    console.log(`
List available: tryelements list-hooks`);
    process.exit(1);
  }
  const index = await fetchHooksIndex();
  const platform = process.platform;
  const hooksDir = getHooksDir();
  mkdirSync3(hooksDir, { recursive: true });
  const results = [];
  const expanded = [];
  for (const name of names) {
    if (index.bundles[name]) {
      expanded.push(...index.bundles[name]);
    } else {
      expanded.push(name);
    }
  }
  const unique = [...new Set(expanded)];
  for (const name of unique) {
    const meta = index.hooks.find((h) => h.name === name);
    if (!meta) {
      results.push({ name, status: "err", detail: "Not found in registry" });
      continue;
    }
    if (!meta.platforms.includes(platform === "darwin" ? "darwin" : "linux")) {
      results.push({
        name,
        status: "err",
        detail: `Not supported on ${platform}`,
      });
      continue;
    }
    const scriptPath = join2(hooksDir, `${name}.sh`);
    if (existsSync3(scriptPath)) {
      results.push({ name, status: "err", detail: "Already installed" });
      continue;
    }
    try {
      const script = await fetchHookScript(name);
      writeFileSync3(scriptPath, script);
      chmodSync(scriptPath, 493);
      registerHook(name, meta.event, meta.matcher);
      results.push({
        name,
        status: "ok",
        detail: `${meta.event}${meta.matcher ? ` (${meta.matcher})` : ""}`,
      });
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
    console.log(`  ${icon} ${r.name} -> ${r.detail}`);
  }
  const ok = results.filter((r) => r.status === "ok").length;
  console.log(`
  ${ok}/${unique.length} hooks installed.`);
  if (ok > 0) {
    console.log(`
  Hooks registered in ~/.claude/settings.json`);
  }
  if (ok < unique.length) process.exit(1);
}

// src/commands/hooks-status.ts
async function hooksStatusCommand() {
  const installed = getInstalledHooks();
  if (installed.length === 0) {
    console.log(`
  No hooks installed.`);
    console.log(`
  Install: tryelements add-hook <name>`);
    console.log("  Browse: tryelements list-hooks");
    return;
  }
  const settings = readSettings();
  const hooks = settings.hooks || {};
  console.log(`
  Installed hooks (${installed.length}):
`);
  for (const name of installed) {
    let event = "unknown";
    let matcher = "";
    for (const [evt, entries] of Object.entries(hooks)) {
      for (const entry of entries) {
        if (entry.hooks?.some((h) => h.command?.includes(`/${name}.sh`))) {
          event = evt;
          matcher = entry.matcher || "";
        }
      }
    }
    const matcherStr = matcher ? ` (${matcher})` : "";
    console.log(`    ${name.padEnd(22)} ${event}${matcherStr}`);
  }
  console.log(`
  Remove: tryelements remove-hook <name>`);
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
      console.log("  " + row.map((n) => n.padEnd(22)).join(""));
    }
    console.log(`
  Install: tryelements add <name> [--output-dir=public/]`);
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// src/commands/list-hooks.ts
async function listHooksCommand(options) {
  try {
    const index = await fetchHooksIndex();
    const installed = getInstalledHooks();
    let hooks = index.hooks;
    if (options.event) {
      hooks = hooks.filter(
        (h) => h.event.toLowerCase() === options.event.toLowerCase(),
      );
    }
    if (options.json) {
      console.log(
        JSON.stringify({ hooks, bundles: index.bundles, installed }, null, 2),
      );
      return;
    }
    console.log(`
  Available hooks (${hooks.length}):
`);
    const grouped = new Map();
    for (const hook of hooks) {
      const cat = hook.tags[0] || "other";
      if (!grouped.has(cat)) grouped.set(cat, []);
      grouped.get(cat).push(hook);
    }
    for (const [category, categoryHooks] of grouped) {
      console.log(`  ${category.toUpperCase()}`);
      for (const h of categoryHooks) {
        const status = installed.includes(h.name) ? "[installed]" : "";
        const platforms = h.platforms.join(",");
        console.log(
          `    ${h.name.padEnd(22)} ${h.event.padEnd(16)} ${platforms.padEnd(14)} ${status}`,
        );
      }
      console.log();
    }
    if (Object.keys(index.bundles).length > 0) {
      console.log("  BUNDLES");
      for (const [name, items] of Object.entries(index.bundles)) {
        console.log(`    ${name.padEnd(22)} ${items.join(", ")}`);
      }
      console.log();
    }
    console.log("  Install: tryelements add-hook <name>");
    console.log("  Install bundle: tryelements add-hook <bundle-name>");
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// src/commands/remove-hook.ts
import { existsSync as existsSync4, unlinkSync } from "node:fs";
import { join as join3 } from "node:path";

async function removeHookCommand(names) {
  if (!names.length) {
    console.error("Error: No hooks specified");
    console.log(`
Usage: tryelements remove-hook <hooks...>`);
    process.exit(1);
  }
  const hooksDir = getHooksDir();
  const results = [];
  for (const name of names) {
    const scriptPath = join3(hooksDir, `${name}.sh`);
    if (!existsSync4(scriptPath)) {
      results.push({ name, status: "err", detail: "Not installed" });
      continue;
    }
    try {
      unlinkSync(scriptPath);
      unregisterHook(name);
      results.push({ name, status: "ok", detail: "Removed" });
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
    console.log(`  ${icon} ${r.name} -> ${r.detail}`);
  }
  const ok = results.filter((r) => r.status === "ok").length;
  console.log(`
  ${ok}/${names.length} hooks removed.`);
}

// src/index.ts
var VERSION = "0.2.0";
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
