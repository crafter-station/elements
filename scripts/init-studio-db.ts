import { initSchema } from "../src/lib/studio/db";

async function main() {
  console.log("Initializing Registry Studio database schema...");
  await initSchema();
  console.log("Done.");
}

main().catch(console.error);
