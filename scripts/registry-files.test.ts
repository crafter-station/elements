import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";

interface RegistryItem {
  files?: { path: string }[];
}

const registryRoot = resolve("registry/default/blocks");

function findRegistryItems(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      return findRegistryItems(entryPath);
    }

    return entry.isFile() && entry.name === "registry-item.json"
      ? [entryPath]
      : [];
  });
}

describe("registry file references", () => {
  it("resolves every files[].path", () => {
    const missingFiles = findRegistryItems(registryRoot).flatMap(
      (registryItemPath) => {
        const registryItem = JSON.parse(
          readFileSync(registryItemPath, "utf8"),
        ) as RegistryItem;

        return (registryItem.files ?? [])
          .filter((file) => !existsSync(resolve(file.path)))
          .map(
            (file) =>
              `${relative(process.cwd(), registryItemPath)}: ${file.path}`,
          );
      },
    );

    expect(missingFiles).toEqual([]);
  });
});
