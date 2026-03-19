import { getInstalledHooks, readSettings } from "../hooks-utils.js";

interface HookEntry {
  matcher?: string;
  hooks: Array<{ type: string; command: string }>;
}

export async function hooksStatusCommand() {
  const installed = getInstalledHooks();

  if (installed.length === 0) {
    console.log("\n  No hooks installed.");
    console.log("\n  Install: tryelements add-hook <name>");
    console.log("  Browse: tryelements list-hooks");
    return;
  }

  const settings = readSettings();
  const hooks = (settings.hooks || {}) as Record<string, HookEntry[]>;

  console.log(`\n  Installed hooks (${installed.length}):\n`);

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

  console.log(`\n  Remove: tryelements remove-hook <name>`);
}
