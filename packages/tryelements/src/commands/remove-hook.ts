import { existsSync, unlinkSync } from "node:fs";
import { join } from "node:path";

import { getHooksDir, unregisterHook } from "../hooks-utils.js";

export async function removeHookCommand(names: string[]) {
  if (!names.length) {
    console.error("Error: No hooks specified");
    console.log("\nUsage: tryelements remove-hook <hooks...>");
    process.exit(1);
  }

  const hooksDir = getHooksDir();
  const results: Array<{ name: string; status: "ok" | "err"; detail: string }> =
    [];

  for (const name of names) {
    const scriptPath = join(hooksDir, `${name}.sh`);
    if (!existsSync(scriptPath)) {
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
  console.log(`\n  ${ok}/${names.length} hooks removed.`);
}
