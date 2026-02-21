import { fetchLogosList } from "../utils.js";

interface ListOptions {
  json: boolean;
}

export async function listCommand(options: ListOptions) {
  try {
    const logos = await fetchLogosList();

    if (options.json) {
      console.log(JSON.stringify(logos, null, 2));
      return;
    }

    console.log(`\n  Available logos (${logos.length}):\n`);

    const cols = 4;
    for (let i = 0; i < logos.length; i += cols) {
      const row = logos.slice(i, i + cols);
      console.log("  " + row.map((n) => n.padEnd(22)).join(""));
    }

    console.log(`\n  Install: tryelements add <name> [--output-dir=public/]`);
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}
