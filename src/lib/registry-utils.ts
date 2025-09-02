/**
 * Finds the best matching registry item for a given component key
 * Following NAMING_CONVENTIONS.md pattern: {service/category}-{component}-{variant}
 * Priority: exact match > suffix match > prefix match > partial match > fuzzy match
 */
interface RegistryItem {
  name: string;
  [key: string]: unknown;
}

export function findRegistryItemMatch(
  componentKey: string,
  registryItems: Array<RegistryItem>,
): RegistryItem | null {
  const keyLower = componentKey.toLowerCase();

  // 1. Exact match (highest priority)
  let match = registryItems.find(
    (item) => item.name.toLowerCase() === keyLower,
  );
  if (match) return match;

  // 2. Suffix match - key matches end of registry name
  // e.g., "sign-in" matches "clerk-sign-in"
  match = registryItems.find((item) => {
    const regName = item.name.toLowerCase();
    return regName.endsWith(`-${keyLower}`) || regName.endsWith(keyLower);
  });
  if (match) return match;

  // 3. Prefix match - registry name matches end of key
  // e.g., "clerk-sign-in" matches "sign-in"
  match = registryItems.find((item) => {
    const regName = item.name.toLowerCase();
    return keyLower.endsWith(`-${regName}`) || keyLower.endsWith(regName);
  });
  if (match) return match;

  // 4. Contains match - one contains the other
  match = registryItems.find((item) => {
    const regName = item.name.toLowerCase();
    return regName.includes(keyLower) || keyLower.includes(regName);
  });
  if (match) return match;

  // 5. Partial component match
  // Split by hyphens and find matches based on common meaningful parts
  const keyParts = keyLower.split("-").filter((part) => part.length > 2);
  if (keyParts.length === 0) return null;

  match = registryItems.find((item) => {
    const regName = item.name.toLowerCase();
    const regParts = regName.split("-").filter((part) => part.length > 2);

    // Find common meaningful parts
    const commonParts = keyParts.filter((keyPart) =>
      regParts.some(
        (regPart) =>
          regPart.includes(keyPart) ||
          keyPart.includes(regPart) ||
          regPart === keyPart,
      ),
    );

    // Need at least 1 meaningful match for short keys, 2 for longer ones
    const threshold = keyParts.length === 1 ? 1 : Math.min(2, keyParts.length);
    return commonParts.length >= threshold;
  });
  if (match) return match;

  // 6. Fuzzy match - similar words/concepts
  const fuzzyMatches: Record<string, string[]> = {
    switch: ["switcher", "toggle"],
    switcher: ["switch", "toggle"],
    toggle: ["switch", "switcher"],
    button: ["btn"],
    btn: ["button"],
    dropdown: ["select", "menu"],
    theme: ["dark", "light", "mode"],
  };

  match = registryItems.find((item) => {
    const regName = item.name.toLowerCase();
    return keyParts.some((keyPart) => {
      const synonyms = fuzzyMatches[keyPart] || [];
      return synonyms.some((synonym) => regName.includes(synonym));
    });
  });

  return match || null;
}

/**
 * Gets the registry JSON URL for a given registry item
 */
export function getRegistryItemUrl(
  registryItemName: string,
  baseUrl?: string,
): string {
  // Use the production domain for v0 integration
  const origin = baseUrl || "https://tryelements.dev";
  return `${origin}/r/${registryItemName}.json`;
}

/**
 * Finds the exact matching file from registry data for a given node file
 * Simple exact matching by path or target
 */
interface RegistryFile {
  path?: string;
  target?: string;
  content?: string;
}

export function findBestFileMatch(
  nodeFile: { path?: string; target?: string },
  registryFiles: Array<RegistryFile>,
): RegistryFile | null {
  if (!nodeFile || !registryFiles?.length) return null;

  // First try exact target match
  if (nodeFile.target) {
    const exactTargetMatch = registryFiles.find(
      (file) => file.target === nodeFile.target,
    );
    if (exactTargetMatch) return exactTargetMatch;
  }

  // Then try exact path match
  if (nodeFile.path) {
    const exactPathMatch = registryFiles.find(
      (file) => file.path === nodeFile.path,
    );
    if (exactPathMatch) return exactPathMatch;
  }

  // If no exact match, try filename matching
  if (nodeFile.target) {
    const nodeFileName = nodeFile.target.split("/").pop();
    if (nodeFileName) {
      const filenameMatch = registryFiles.find((file) => {
        const registryFileName = file.target?.split("/").pop();
        return registryFileName === nodeFileName;
      });
      if (filenameMatch) return filenameMatch;
    }
  }

  return null;
}
