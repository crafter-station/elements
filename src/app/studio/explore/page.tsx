"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ShadcnRegistryJson } from "@/lib/studio/types";
import { AlertCircle, ArrowLeft, ArrowRight, Loader2, Search } from "lucide-react";
import { useState } from "react";
import { fetchRemoteRegistry } from "../lib/registry-fetcher";
import { RegistryBrowser } from "./components/registry-browser";
import { RegistryDirectory } from "./components/registry-directory";
import { ImportGitHubDialog } from "../builder/components/import-github-dialog";

export default function ExplorePage() {
  const [registryUrl, setRegistryUrl] = useState("");
  const [registry, setRegistry] = useState<ShadcnRegistryJson | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExplore = async (url?: string) => {
    const targetUrl = url || registryUrl.trim();
    if (!targetUrl) {
      setError("Please enter a registry URL");
      return;
    }

    setIsLoading(true);
    setError(null);
    setRegistry(null);
    if (url) setRegistryUrl(url);

    const { registry: fetchedRegistry, error: fetchError } =
      await fetchRemoteRegistry(targetUrl);

    setIsLoading(false);

    if (fetchError) {
      setError(fetchError);
    } else if (fetchedRegistry) {
      setRegistry(fetchedRegistry);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleExplore();
    }
  };

  const handleBack = () => {
    setRegistry(null);
    setError(null);
    setRegistryUrl("");
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b border-border/50 bg-muted/30">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Explorer
          </p>
          <h1 className="mt-2 font-pixel text-2xl tracking-tight">
            Explore Registries
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse any shadcn-compatible registry by pasting its URL or pick one below
          </p>

          <div className="mt-6 flex gap-2">
            <ImportGitHubDialog />
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="url"
                placeholder="https://ui.shadcn.com/registry.json"
                value={registryUrl}
                onChange={(e) => setRegistryUrl(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                className="h-9 pl-9 text-sm"
              />
            </div>
            <Button
              onClick={() => handleExplore()}
              disabled={isLoading || !registryUrl.trim()}
              size="sm"
              className="h-9 gap-2"
            >
              {isLoading ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <ArrowRight className="size-3.5" />
              )}
              Explore
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl px-6 py-8">
        {error && (
          <div className="mb-6 flex items-start gap-2.5 rounded-md border border-destructive/20 bg-destructive/5 px-4 py-3">
            <AlertCircle className="mt-0.5 size-3.5 shrink-0 text-destructive" />
            <div>
              <p className="text-xs font-medium text-destructive">Failed to load registry</p>
              <p className="mt-0.5 text-xs text-destructive/70">{error}</p>
            </div>
          </div>
        )}

        {registry ? (
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-3" />
              Back to directory
            </button>
            <RegistryBrowser registry={registry} registryUrl={registryUrl} />
          </div>
        ) : (
          <RegistryDirectory onSelectRegistry={(url) => handleExplore(url)} />
        )}
      </div>
    </div>
  );
}
