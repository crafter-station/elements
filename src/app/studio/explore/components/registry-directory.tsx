"use client";

import { Input } from "@/components/ui/input";
import { ExternalLink, Loader2, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface RegistryEntry {
  name: string;
  homepage: string;
  url: string;
  description: string;
}

interface RegistryDirectoryProps {
  onSelectRegistry: (registryUrl: string) => void;
}

function deriveRegistryJsonUrl(urlPattern: string): string {
  const base = urlPattern.replace(/\/\{name\}(\.json)?$/, "");
  return `${base}/registry.json`;
}

export function RegistryDirectory({
  onSelectRegistry,
}: RegistryDirectoryProps) {
  const [registries, setRegistries] = useState<RegistryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchRegistries() {
      try {
        const res = await fetch("/api/studio/explore/registries");
        if (!res.ok) throw new Error("Failed to fetch registries");
        const data: RegistryEntry[] = await res.json();
        setRegistries(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load registries",
        );
      } finally {
        setIsLoading(false);
      }
    }
    fetchRegistries();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return registries;
    const q = search.toLowerCase();
    return registries.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.homepage.toLowerCase().includes(q),
    );
  }, [registries, search]);

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="size-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Filter registries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 pl-9 text-xs"
          />
        </div>
        <p className="font-mono text-[10px] text-muted-foreground">
          {filtered.length} registries
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((registry) => (
          <button
            key={registry.name}
            type="button"
            onClick={() =>
              onSelectRegistry(deriveRegistryJsonUrl(registry.url))
            }
            className="group flex flex-col gap-1.5 rounded-lg border border-border/50 bg-background p-3 text-left transition-colors hover:border-foreground/20 hover:bg-muted/50"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="font-mono text-xs font-medium text-foreground">
                {registry.name}
              </span>
              <a
                href={registry.homepage}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="shrink-0 text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
              >
                <ExternalLink className="size-3" />
              </a>
            </div>
            <p className="line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
              {registry.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
