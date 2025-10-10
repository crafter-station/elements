#!/usr/bin/env bun

import { existsSync, readdirSync, renameSync } from "node:fs";
import { join } from "node:path";
import { stdin as input, stdout as output } from "node:process";
import * as readline from "node:readline/promises";

const TEMP_DIR = join(process.cwd(), "apps/playground/components/temp");
const PACKAGES_DIR = join(process.cwd(), "packages");

const PROVIDERS = ["clerk", "uploadthing", "polar", "theme", "logos"];

async function main() {
  const rl = readline.createInterface({ input, output });

  try {
    console.log("🚀 Move Component to Package\n");

    // List available components in temp
    const tempFiles = readdirSync(TEMP_DIR).filter(
      (f) => f.endsWith(".tsx") || f.endsWith(".ts"),
    );

    if (tempFiles.length === 0) {
      console.log(
        "❌ No components found in apps/playground/components/temp/\n",
      );
      console.log(
        "Create a component there first, then run this script again.",
      );
      process.exit(0);
    }

    console.log("📦 Available components:");
    for (const [i, file] of tempFiles.entries()) {
      console.log(`  ${i + 1}. ${file}`);
    }
    console.log();

    const fileIndexStr = await rl.question(
      "Select component number (or type filename): ",
    );
    const fileIndex = Number.parseInt(fileIndexStr, 10) - 1;
    const fileName =
      !Number.isNaN(fileIndex) && tempFiles[fileIndex]
        ? tempFiles[fileIndex]
        : fileIndexStr;

    if (!tempFiles.includes(fileName)) {
      console.log(`\n❌ Component "${fileName}" not found in temp directory`);
      process.exit(1);
    }

    console.log(`\n✓ Selected: ${fileName}\n`);

    // Select provider
    console.log("Available providers:");
    for (const [i, provider] of PROVIDERS.entries()) {
      console.log(`  ${i + 1}. ${provider}`);
    }
    console.log();

    const providerIndexStr = await rl.question(
      "Select provider number (or type name): ",
    );
    const providerIndex = Number.parseInt(providerIndexStr, 10) - 1;
    const provider =
      !Number.isNaN(providerIndex) && PROVIDERS[providerIndex]
        ? PROVIDERS[providerIndex]
        : providerIndexStr.toLowerCase();

    if (!PROVIDERS.includes(provider)) {
      console.log(`\n❌ Invalid provider: ${provider}`);
      console.log(`Available: ${PROVIDERS.join(", ")}`);
      process.exit(1);
    }

    console.log(`\n✓ Provider: ${provider}\n`);

    // Ask for component name (defaults to filename without extension)
    const defaultName = fileName.replace(/\.(tsx|ts)$/, "");
    const componentName =
      (await rl.question(`Component name (default: ${defaultName}): `)) ||
      defaultName;

    // Determine target directory
    const targetDir = join(PACKAGES_DIR, provider, "registry", provider);
    const targetPath = join(targetDir, fileName);

    if (!existsSync(targetDir)) {
      console.log(`\n❌ Target directory does not exist: ${targetDir}`);
      process.exit(1);
    }

    if (existsSync(targetPath)) {
      const overwrite = await rl.question(
        `\n⚠️  File already exists at ${targetPath}\nOverwrite? (y/N): `,
      );
      if (overwrite.toLowerCase() !== "y") {
        console.log("\n❌ Cancelled");
        process.exit(0);
      }
    }

    // Move the file
    const sourcePath = join(TEMP_DIR, fileName);
    renameSync(sourcePath, targetPath);

    console.log(`\n✅ Moved component successfully!`);
    console.log(`   From: ${sourcePath}`);
    console.log(`   To:   ${targetPath}\n`);

    console.log("🤖 Next steps:");
    console.log(
      `   1. Tell Claude: "add ${componentName} to ${provider} registry"`,
    );
    console.log(`   2. Test at: http://localhost:3000/docs/${provider}`);
    console.log("   3. Commit and push when ready\n");
  } finally {
    rl.close();
  }
}

main().catch(console.error);
