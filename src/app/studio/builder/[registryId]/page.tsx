"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ExternalLink,
  GitBranch,
  Globe,
  Lock,
  Package,
  Settings,
  Eye,
  ChevronDown,
  Code,
} from "lucide-react";
import { useBuilderStore } from "@/app/studio/stores/builder-store";
import { RegistryForm } from "../components/registry-form";
import { ItemList } from "../components/item-list";
import { ItemEditor } from "../components/item-editor";
import { BuildOutput } from "../components/build-output";
import { SchemaValidator } from "../components/schema-validator";
import { PreviewPanel } from "../components/preview-panel";
import { ThemePicker } from "../components/theme-picker";
import { ExportDialog } from "../components/export-dialog";
import { GitHubSyncBar } from "../components/github-sync-bar";
import { inferFromCode } from "@/lib/studio/code-inference";

export default function RegistryEditorPage() {
  const params = useParams<{ registryId: string }>();
  const {
    registry,
    items,
    selectedItemId,
    isLoading,
    setRegistry,
    setItems,
    selectItem,
    addItem,
    updateItem,
    removeItem,
    addFile,
    updateFile,
    removeFile,
    setLoading,
    setDirty,
  } = useBuilderStore();

  const [error, setError] = useState<string | null>(null);
  const [showBuild, setShowBuild] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const selectedItem = items.find((i) => i.id === selectedItemId) || null;

  const registryRef = useRef(registry);
  registryRef.current = registry;

  const handleRegistryUpdate = useCallback(
    async (updates: Record<string, unknown>) => {
      const current = registryRef.current;
      if (!current) return;
      setRegistry({ ...current, ...updates });
      setDirty(true);
      await fetch(`/api/studio/registries/${params.registryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
    },
    [params.registryId, setRegistry, setDirty],
  );

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [registryRes, itemsRes] = await Promise.all([
          fetch(`/api/studio/registries/${params.registryId}`),
          fetch(`/api/studio/registries/${params.registryId}/items`),
        ]);

        if (!registryRes.ok) throw new Error("Failed to fetch registry");

        const registryData = await registryRes.json();
        const itemsData = itemsRes.ok ? await itemsRes.json() : [];

        setRegistry({
          id: registryData.id,
          name: registryData.name,
          slug: registryData.slug,
          displayName: registryData.displayName,
          homepage: registryData.homepage,
          description: registryData.description,
          isPublic: registryData.isPublic,
          githubRepoUrl: registryData.githubRepoUrl,
        });

        setItems(
          itemsData.map((item: any) => ({
            id: item.id,
            name: item.name,
            type: item.type,
            title: item.title,
            description: item.description,
            docs: item.docs,
            dependencies: item.dependencies || [],
            registryDependencies: item.registryDependencies || [],
            devDependencies: item.devDependencies || [],
            cssVars: item.cssVars || {},
            css: item.css,
            envVars: item.envVars || {},
            categories: item.categories || [],
            meta: item.meta || {},
            sortOrder: item.sortOrder || 0,
            files: (item.files || []).map((f: any) => ({
              id: f.id,
              path: f.path,
              type: f.type,
              target: f.target,
              content: f.content,
            })),
          })),
        );

        setDirty(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params.registryId, setRegistry, setItems, setLoading, setDirty]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="size-5 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
          <p className="font-mono text-xs text-muted-foreground">
            Loading registry...
          </p>
        </div>
      </div>
    );
  }

  if (error || !registry) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error || "Registry not found"}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  function handleAddItemFromCode(code: string, filename?: string) {
    const inferred = inferFromCode(code, filename);
    const itemId = crypto.randomUUID();
    const fileId = crypto.randomUUID();

    addItem({
      id: itemId,
      name: inferred.name,
      type: inferred.type,
      title: null,
      description: inferred.description,
      docs: null,
      dependencies: inferred.dependencies,
      registryDependencies: inferred.registryDependencies,
      devDependencies: inferred.devDependencies,
      cssVars: {},
      css: null,
      envVars: {},
      categories: [],
      meta: {},
      sortOrder: items.length,
      files: [
        {
          id: fileId,
          path: inferred.filePath,
          type: inferred.fileType,
          target: null,
          content: code,
        },
      ],
    });
  }

  function handleAddFile(file: {
    path: string;
    type: string;
    target: string | null;
    content: string;
  }) {
    if (!selectedItemId) return;
    addFile(selectedItemId, {
      id: crypto.randomUUID(),
      path: file.path,
      type: file.type as any,
      target: file.target,
      content: file.content,
    });
  }

  if (showBuild) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="border-b border-border/50 bg-muted/30">
          <div className="mx-auto max-w-5xl px-6 py-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBuild(false)}
              className="mb-3 -ml-2 gap-1.5 text-xs text-muted-foreground"
            >
              <ArrowLeft className="size-3" />
              Back to editor
            </Button>
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Build Output
            </p>
            <h1 className="mt-1 font-pixel text-xl tracking-tight">
              {registry.displayName || registry.name}
            </h1>
          </div>
        </div>
        <div className="mx-auto w-full max-w-5xl px-6 py-8">
          <BuildOutput
            registrySlug={registry.slug}
            items={items}
            registry={registry}
          />
        </div>
      </div>
    );
  }

  const repoOwnerName = registry.githubRepoUrl
    ?.replace("https://github.com/", "")
    ?.replace(/\/$/, "");

  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b border-border/50 bg-muted/30">
        <div className="mx-auto max-w-5xl px-6 py-6">
          <div className="flex items-start justify-between">
            <div>
              <Link
                href="/studio/my-registries"
                className="mb-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="size-3" />
                My Registries
              </Link>
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                Registry Editor
              </p>
              <h1 className="mt-1 font-pixel text-xl tracking-tight">
                {registry.displayName || registry.name}
              </h1>
              <div className="mt-2 flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                  <Package className="size-3" />
                  {registry.slug}
                </span>
                {registry.isPublic ? (
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Globe className="size-3" />
                    Public
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Lock className="size-3" />
                    Private
                  </span>
                )}
                {repoOwnerName && (
                  <a
                    href={registry.githubRepoUrl!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <GitBranch className="size-3" />
                    {repoOwnerName}
                    <ExternalLink className="size-2.5" />
                  </a>
                )}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBuild(true)}
              className="gap-1.5 text-xs"
            >
              <Eye className="size-3" />
              Preview
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <div className="space-y-4">
            <div className="rounded-lg border border-border/50 bg-card">
              <button
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-muted/50"
              >
                <span className="flex items-center gap-2">
                  <Settings className="size-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium">Settings</span>
                </span>
                <ChevronDown
                  className={`size-3 text-muted-foreground transition-transform ${showSettings ? "rotate-180" : ""}`}
                />
              </button>
              {showSettings && (
                <div className="border-t border-border/50">
                  <RegistryForm
                    registry={registry}
                    onUpdate={handleRegistryUpdate}
                  />
                </div>
              )}
            </div>

            <ItemList
              items={items.map((i) => ({
                id: i.id,
                name: i.name,
                type: i.type,
                title: i.title,
                description: i.description,
                files: i.files.map((f) => ({ id: f.id })),
              }))}
              selectedItemId={selectedItemId}
              onSelectItem={selectItem}
              onAddItemFromCode={handleAddItemFromCode}
              onRemoveItem={(id) => {
                removeItem(id);
                fetch(`/api/studio/registries/${registry.id}/items/${id}`, {
                  method: "DELETE",
                });
              }}
            />
            {selectedItem && (
              <>
                <SchemaValidator
                  item={{
                    name: selectedItem.name,
                    type: selectedItem.type,
                    title: selectedItem.title,
                    description: selectedItem.description,
                    docs: selectedItem.docs,
                    dependencies: selectedItem.dependencies,
                    registryDependencies: selectedItem.registryDependencies,
                    categories: selectedItem.categories,
                    files: selectedItem.files.map((f) => ({
                      path: f.path,
                      content: f.content,
                    })),
                  }}
                />
                <ThemePicker
                  selectedThemeId={
                    (selectedItem.meta?.tinteThemeId as string) || null
                  }
                  onSelectTheme={(themeId, cssVars) => {
                    updateItem(selectedItem.id, {
                      cssVars: cssVars
                        ? { light: cssVars.light, dark: cssVars.dark }
                        : {},
                      meta: {
                        ...selectedItem.meta,
                        tinteThemeId: themeId,
                      },
                    });
                  }}
                />
              </>
            )}
          </div>

          <div className="space-y-6">
            {selectedItem ? (
              <>
                <ItemEditor
                  item={selectedItem}
                  onUpdate={(updates) => {
                    updateItem(selectedItem.id, updates);
                  }}
                  onAddFile={handleAddFile}
                  onUpdateFile={(fileId, updates) => {
                    updateFile(selectedItem.id, fileId, updates);
                  }}
                  onRemoveFile={(fileId) => {
                    removeFile(selectedItem.id, fileId);
                  }}
                />
                <PreviewPanel
                  files={selectedItem.files}
                  itemName={selectedItem.name}
                />
              </>
            ) : (
              <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-border/50">
                <Code className="size-8 text-muted-foreground/30" />
                <p className="mt-3 text-sm text-muted-foreground">
                  {items.length === 0
                    ? "Paste code to add your first item"
                    : "Select an item to edit"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground/70">
                  {items.length === 0
                    ? "Drop .tsx files or paste component code"
                    : "Or paste code in the sidebar to add more"}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-border/50 pt-6">
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {items.length} item{items.length !== 1 ? "s" : ""} &middot;{" "}
            {items.reduce((sum, i) => sum + i.files.length, 0)} files
          </div>
          <div className="flex items-center gap-3">
            {registry.githubRepoUrl ? (
              <GitHubSyncBar
                registryId={registry.id}
                githubRepoUrl={registry.githubRepoUrl}
              />
            ) : (
              <ExportDialog
                registryId={registry.id}
                registrySlug={registry.slug}
                githubRepoUrl={registry.githubRepoUrl}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
