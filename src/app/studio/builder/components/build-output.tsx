"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  buildRegistryIndex,
  buildRegistryItemJson,
} from "@/lib/studio/registry-builder";
import type {
  BuilderRegistry,
  BuilderRegistryItem,
} from "../../stores/builder-store";
import type { StudioRegistry, StudioRegistryItem } from "@/lib/studio/types";

interface BuildOutputProps {
  registrySlug: string;
  items: BuilderRegistryItem[];
  registry: BuilderRegistry | null;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2">
      {copied ? (
        <>
          <Check className="size-4" />
          Copied
        </>
      ) : (
        <>
          <Copy className="size-4" />
          Copy
        </>
      )}
    </Button>
  );
}

function JsonOutput({ json, label }: { json: unknown; label: string }) {
  const formatted = JSON.stringify(json, null, 2);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">{label}</h3>
        <CopyButton text={formatted} />
      </div>
      <pre className="bg-muted text-foreground overflow-auto rounded-lg border p-4 text-xs font-mono">
        {formatted}
      </pre>
    </div>
  );
}

function InstallCommand({
  itemName,
  githubRepoUrl,
}: {
  itemName: string;
  githubRepoUrl?: string | null;
}) {
  if (!githubRepoUrl) {
    return (
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium">Install Command</h3>
        <p className="text-xs text-muted-foreground">
          Push to GitHub to get an install command
        </p>
      </div>
    );
  }

  const match = githubRepoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) return null;
  const [, owner, repo] = match;
  const command = `npx shadcn add https://${owner}.github.io/${repo}/r/${itemName}.json`;

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-medium">Install Command</h3>
      <div className="bg-muted flex items-center justify-between gap-2 rounded-lg border p-3">
        <code className="text-foreground flex-1 text-xs font-mono">
          {command}
        </code>
        <CopyButton text={command} />
      </div>
    </div>
  );
}

export function BuildOutput({
  registrySlug,
  items,
  registry,
}: BuildOutputProps) {
  if (!registry) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Build Output</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-sm">
            No registry loaded
          </div>
        </CardContent>
      </Card>
    );
  }

  const studioRegistry: StudioRegistry = {
    id: registry.id,
    clerkUserId: "",
    name: registry.name,
    displayName: registry.displayName,
    homepage: registry.homepage,
    description: registry.description,
    slug: registry.slug,
    isPublic: registry.isPublic,
    themeId: null,
    githubRepoUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const studioItems: StudioRegistryItem[] = items.map((item) => ({
    id: item.id,
    registryId: registry.id,
    name: item.name,
    type: item.type,
    title: item.title,
    description: item.description,
    docs: item.docs,
    dependencies: item.dependencies,
    registryDependencies: item.registryDependencies,
    devDependencies: item.devDependencies,
    cssVars: item.cssVars,
    css: item.css,
    envVars: item.envVars,
    categories: item.categories,
    meta: item.meta,
    sortOrder: item.sortOrder,
    files: item.files.map((file) => ({
      id: file.id,
      itemId: item.id,
      path: file.path,
      type: file.type,
      target: file.target,
      content: file.content,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  const registryIndex = buildRegistryIndex(studioRegistry, studioItems);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Build Output</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="index">
          <TabsList>
            <TabsTrigger value="index">Registry Index</TabsTrigger>
            {items.map((item) => (
              <TabsTrigger key={item.id} value={item.id}>
                {item.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="index" className="mt-4 flex flex-col gap-4">
            <JsonOutput json={registryIndex} label="registry.json" />
          </TabsContent>

          {items.map((item) => {
            const studioItem = studioItems.find((i) => i.id === item.id);
            if (!studioItem) return null;

            const itemJson = buildRegistryItemJson(studioItem, registrySlug);

            return (
              <TabsContent
                key={item.id}
                value={item.id}
                className="mt-4 flex flex-col gap-4"
              >
                <InstallCommand
                  itemName={item.name}
                  githubRepoUrl={registry?.githubRepoUrl}
                />
                <JsonOutput json={itemJson} label={`${item.name}.json`} />
              </TabsContent>
            );
          })}
        </Tabs>
      </CardContent>
    </Card>
  );
}
