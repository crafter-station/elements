import { chmodSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import {
  fetchHookScript,
  fetchHooksIndex,
  getHooksDir,
  registerHook,
} from "../hooks-utils.js";

export async function addHookCommand(names: string[]) {
  if (!names.length) {
    console.error("Error: No hooks specified");
    console.log("\nUsage: tryelements add-hook <hooks...>");
    console.log("Example: tryelements add-hook notify-macos guard-branch");
    console.log("\nList available: tryelements list-hooks");
    process.exit(1);
  }

  const index = await fetchHooksIndex();
  const platform = process.platform;
  const hooksDir = getHooksDir();
  mkdirSync(hooksDir, { recursive: true });

  const results: Array<{ name: string; status: "ok" | "err"; detail: string }> =
    [];

  const expanded: string[] = [];
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

    const scriptPath = join(hooksDir, `${name}.sh`);
    if (existsSync(scriptPath)) {
      results.push({ name, status: "err", detail: "Already installed" });
      continue;
    }

    try {
      const script = await fetchHookScript(name);
      writeFileSync(scriptPath, script);
      chmodSync(scriptPath, 0o755);
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
  console.log(`\n  ${ok}/${unique.length} hooks installed.`);

  if (ok > 0) {
    console.log("\n  Hooks registered in ~/.claude/settings.json");
  }

  if (ok < unique.length) process.exit(1);
}
