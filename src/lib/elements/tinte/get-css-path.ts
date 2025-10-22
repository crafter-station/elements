import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Gets the CSS file path from components.json
 * Falls back to app/globals.css if not found
 */
export async function getCssPath(): Promise<string> {
  try {
    const componentsJsonPath = join(process.cwd(), "components.json");
    const componentsConfig = await readFile(componentsJsonPath, "utf-8");
    const config = JSON.parse(componentsConfig);

    // Get CSS path from tailwind.css config, fallback to default
    const cssPath = config?.tailwind?.css || "src/app/globals.css";
    return join(process.cwd(), cssPath);
  } catch (error) {
    // Fallback to default path if components.json doesn't exist or is invalid
    console.warn("Could not read components.json, using default path:", error);
    return join(process.cwd(), "src", "app", "globals.css");
  }
}
