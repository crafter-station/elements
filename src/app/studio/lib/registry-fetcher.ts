import type {
  ShadcnRegistryJson,
  ShadcnRegistryItemJson,
} from "@/lib/studio/types";

export async function fetchRemoteRegistry(url: string): Promise<{
  registry: ShadcnRegistryJson | null;
  error: string | null;
}> {
  try {
    const response = await fetch("/api/studio/explore", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Unknown error" }));
      return {
        registry: null,
        error: errorData.message || `HTTP ${response.status}`,
      };
    }

    const data = await response.json();

    if (!data.name || !Array.isArray(data.items)) {
      return {
        registry: null,
        error: "Invalid registry format: missing 'name' or 'items' array",
      };
    }

    return { registry: data as ShadcnRegistryJson, error: null };
  } catch (err) {
    return {
      registry: null,
      error: err instanceof Error ? err.message : "Failed to fetch registry",
    };
  }
}

export async function fetchRemoteRegistryItem(url: string): Promise<{
  item: ShadcnRegistryItemJson | null;
  error: string | null;
}> {
  try {
    const response = await fetch("/api/studio/explore", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Unknown error" }));
      return {
        item: null,
        error: errorData.message || `HTTP ${response.status}`,
      };
    }

    const data = await response.json();

    if (!data.name || !data.type || !Array.isArray(data.files)) {
      return {
        item: null,
        error: "Invalid item format: missing 'name', 'type', or 'files' array",
      };
    }

    return { item: data as ShadcnRegistryItemJson, error: null };
  } catch (err) {
    return {
      item: null,
      error: err instanceof Error ? err.message : "Failed to fetch item",
    };
  }
}
