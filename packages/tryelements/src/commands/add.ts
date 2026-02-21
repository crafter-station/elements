import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

import { fetchSvg, normalizeName } from "../utils.js";

interface AddOptions {
  outputDir: string;
  overwrite: boolean;
}

export async function addCommand(logos: string[], options: AddOptions) {
  if (!logos.length) {
    console.error("Error: No logos specified");
    console.log(
      "\nUsage: tryelements add-logo <logos...> [--output-dir=public/]",
    );
    console.log("Example: tryelements add-logo apple clerk astro");
    process.exit(1);
  }

  const outputDir = resolve(options.outputDir);
  mkdirSync(outputDir, { recursive: true });

  const results: Array<{ name: string; status: "ok" | "err"; detail: string }> =
    [];

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
  console.log(`\n  ${ok}/${logos.length} logos installed.`);

  if (ok < logos.length) {
    process.exit(1);
  }
}
