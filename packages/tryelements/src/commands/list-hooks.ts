import {
  fetchHooksIndex,
  getInstalledHooks,
  type HookMeta,
} from "../hooks-utils.js";

interface ListHooksOptions {
  json: boolean;
  event?: string;
}

export async function listHooksCommand(options: ListHooksOptions) {
  try {
    const index = await fetchHooksIndex();
    const installed = getInstalledHooks();

    let hooks = index.hooks;
    if (options.event) {
      hooks = hooks.filter(
        (h) => h.event.toLowerCase() === options.event!.toLowerCase(),
      );
    }

    if (options.json) {
      console.log(
        JSON.stringify({ hooks, bundles: index.bundles, installed }, null, 2),
      );
      return;
    }

    console.log(`\n  Available hooks (${hooks.length}):\n`);

    const grouped = new Map<string, HookMeta[]>();
    for (const hook of hooks) {
      const cat = hook.tags[0] || "other";
      if (!grouped.has(cat)) grouped.set(cat, []);
      grouped.get(cat)!.push(hook);
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
