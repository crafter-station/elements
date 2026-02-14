"use client";

import { Input } from "@/components/ui/input";
import { ITEM_TYPE_LABELS } from "@/lib/studio/constants";
import type {
  RegistryItemType,
  ShadcnRegistryJson,
  ShadcnRegistryItemJson,
} from "@/lib/studio/types";
import { ExternalLink, FileCode, Loader2, Package, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { fetchRemoteRegistryItem } from "../../lib/registry-fetcher";
import { scoreRegistryItem } from "../../lib/quality-scorer";
import { ComponentViewer } from "./component-viewer";

interface RegistryBrowserProps {
  registry: ShadcnRegistryJson;
  registryUrl: string;
}

export function RegistryBrowser({
  registry,
  registryUrl,
}: RegistryBrowserProps) {
  const [selectedItem, setSelectedItem] =
    useState<ShadcnRegistryItemJson | null>(null);
  const [isLoadingItem, setIsLoadingItem] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<RegistryItemType | "all">(
    "all",
  );

  const handleSelectItem = async (item: ShadcnRegistryItemJson) => {
    const hasContent = item.files.some((f) => f.content);
    if (hasContent) {
      setSelectedItem(item);
      return;
    }

    setIsLoadingItem(true);
    const baseUrl = registryUrl.replace(/\/registry\.json$/, "");
    const itemUrl = `${baseUrl}/${item.name}.json`;
    const { item: fullItem } = await fetchRemoteRegistryItem(itemUrl);
    setIsLoadingItem(false);

    if (fullItem) {
      setSelectedItem(fullItem);
    } else {
      setSelectedItem(item);
    }
  };

  const itemTypes = useMemo(() => {
    const counts = new Map<RegistryItemType, number>();
    for (const item of registry.items) {
      counts.set(item.type, (counts.get(item.type) || 0) + 1);
    }
    return Array.from(counts.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [registry.items]);

  const filteredItems = useMemo(() => {
    return registry.items.filter((item) => {
      const matchesSearch = searchQuery
        ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      const matchesType = selectedType === "all" || item.type === selectedType;

      return matchesSearch && matchesType;
    });
  }, [registry.items, searchQuery, selectedType]);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4 rounded-lg border border-border/50 bg-muted/30 p-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">{registry.name}</h2>
          {registry.homepage && (
            <a
              href={registry.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <ExternalLink className="size-3" />
              {registry.homepage}
            </a>
          )}
        </div>
        <span className="shrink-0 rounded-md bg-muted px-2.5 py-1 font-mono text-xs text-muted-foreground">
          {registry.items.length} items
        </span>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 pl-9 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedType("all")}
            className={`rounded-full border px-2.5 py-1 font-mono text-[10px] transition-colors ${
              selectedType === "all"
                ? "border-foreground/30 bg-foreground/10 text-foreground"
                : "border-border/50 text-muted-foreground hover:border-foreground/20 hover:text-foreground"
            }`}
          >
            All ({registry.items.length})
          </button>
          {itemTypes.map(([type, count]) => (
            <button
              key={type}
              type="button"
              onClick={() =>
                setSelectedType(selectedType === type ? "all" : type)
              }
              className={`rounded-full border px-2.5 py-1 font-mono text-[10px] transition-colors ${
                selectedType === type
                  ? "border-foreground/30 bg-foreground/10 text-foreground"
                  : "border-border/50 text-muted-foreground hover:border-foreground/20 hover:text-foreground"
              }`}
            >
              {ITEM_TYPE_LABELS[type]} ({count})
            </button>
          ))}
        </div>
      </div>

      {isLoadingItem && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      )}

      {!isLoadingItem && selectedItem ? (
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setSelectedItem(null)}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            &larr; Back to all items
          </button>
          <ComponentViewer item={selectedItem} registryUrl={registryUrl} />
        </div>
      ) : !isLoadingItem ? (
        <>
          {filteredItems.length === 0 ? (
            <div className="flex min-h-[200px] items-center justify-center">
              <p className="text-xs text-muted-foreground">
                No items found matching your filters
              </p>
            </div>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => {
                const breakdown = scoreRegistryItem(item);
                const scoreColor =
                  breakdown.score >= 70
                    ? "text-green-600"
                    : breakdown.score >= 40
                      ? "text-yellow-600"
                      : "text-red-600";

                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => handleSelectItem(item)}
                    className="group flex flex-col gap-2 rounded-lg border border-border/50 bg-background p-3 text-left transition-colors hover:border-foreground/20 hover:bg-muted/50"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {item.title || item.name}
                        </p>
                        <p className="truncate font-mono text-[10px] text-muted-foreground">
                          {item.name}
                        </p>
                      </div>
                      <span className={`shrink-0 font-mono text-[10px] font-medium ${scoreColor}`}>
                        {breakdown.score}
                      </span>
                    </div>
                    {item.description && (
                      <p className="line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <FileCode className="size-2.5" />
                        {item.files.length} files
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Package className="size-2.5" />
                        {(item.dependencies?.length || 0) +
                          (item.registryDependencies?.length || 0)}{" "}
                        deps
                      </span>
                      <span className="rounded bg-muted px-1.5 py-0.5 font-mono">
                        {ITEM_TYPE_LABELS[item.type]}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
