"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { ITEM_TYPE_LABELS } from "@/lib/studio/constants";
import type { RegistryItemType } from "@/lib/studio/types";

interface GenerationReviewProps {
  metadata: {
    name: string;
    type: RegistryItemType;
    title: string;
    description: string;
    docs: string;
    dependencies: string[];
    registryDependencies: string[];
    categories: string[];
  };
  code: string;
  onSave: (registryId?: string) => void;
}

interface Registry {
  id: string;
  name: string;
  slug: string;
}

export function GenerationReview({
  metadata,
  code,
  onSave,
}: GenerationReviewProps) {
  const [registries, setRegistries] = useState<Registry[]>([]);
  const [selectedRegistry, setSelectedRegistry] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [createNew, setCreateNew] = useState(false);

  useEffect(() => {
    const fetchRegistries = async () => {
      try {
        const response = await fetch("/api/studio/registries");
        if (response.ok) {
          const data = await response.json();
          setRegistries(data);
        }
      } catch (error) {
        console.error("Failed to fetch registries:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegistries();
  }, []);

  const handleSave = () => {
    if (createNew) {
      onSave();
    } else if (selectedRegistry) {
      onSave(selectedRegistry);
    }
  };

  const previewJson = {
    name: metadata.name,
    type: metadata.type,
    title: metadata.title,
    description: metadata.description,
    docs: metadata.docs,
    dependencies: metadata.dependencies,
    registryDependencies: metadata.registryDependencies,
    categories: metadata.categories,
    files: [
      {
        path: `components/${metadata.name}.tsx`,
        type: metadata.type,
        content: code.slice(0, 100) + "...",
      },
    ],
  };

  const qualityScore = calculateQualityScore(metadata);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Review Generated Metadata</CardTitle>
          <CardDescription>
            Verify the metadata before saving to your registry
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                Name
              </div>
              <div className="font-mono">{metadata.name}</div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                Type
              </div>
              <Badge variant="outline">{ITEM_TYPE_LABELS[metadata.type]}</Badge>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                Title
              </div>
              <div>{metadata.title}</div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                Quality Score
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary rounded-full h-2 transition-all"
                    style={{ width: `${qualityScore}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{qualityScore}%</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">
              Description
            </div>
            <p className="text-sm">{metadata.description}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                Dependencies
              </div>
              <div className="flex flex-wrap gap-1">
                {metadata.dependencies.length > 0 ? (
                  metadata.dependencies.map((dep) => (
                    <Badge key={dep} variant="secondary" className="text-xs">
                      {dep}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">None</span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                Registry Dependencies
              </div>
              <div className="flex flex-wrap gap-1">
                {metadata.registryDependencies.length > 0 ? (
                  metadata.registryDependencies.map((dep) => (
                    <Badge key={dep} variant="outline" className="text-xs">
                      {dep}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">None</span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">
              Categories
            </div>
            <div className="flex flex-wrap gap-1">
              {metadata.categories.map((category) => (
                <Badge key={category} className="text-xs">
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">
              JSON Preview
            </div>
            <pre className="bg-secondary p-4 rounded-lg text-xs overflow-x-auto">
              {JSON.stringify(previewJson, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Save to Registry</CardTitle>
          <CardDescription>
            Choose a registry or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading registries...
            </div>
          ) : registries.length === 0 ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              No registries found. A new registry will be created.
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="registry">Select Registry</Label>
              <Select
                value={createNew ? "new" : selectedRegistry}
                onValueChange={(value) => {
                  if (value === "new") {
                    setCreateNew(true);
                    setSelectedRegistry("");
                  } else {
                    setCreateNew(false);
                    setSelectedRegistry(value);
                  }
                }}
              >
                <SelectTrigger id="registry">
                  <SelectValue placeholder="Choose a registry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">
                    <div className="font-medium">Create New Registry</div>
                  </SelectItem>
                  {registries.map((registry) => (
                    <SelectItem key={registry.id} value={registry.id}>
                      <div>
                        <div className="font-medium">{registry.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {registry.slug}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button
            onClick={handleSave}
            disabled={!createNew && !selectedRegistry}
            size="lg"
            className="w-full"
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            {createNew || registries.length === 0
              ? "Create Registry & Add Item"
              : "Add to Registry"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function calculateQualityScore(
  metadata: GenerationReviewProps["metadata"],
): number {
  let score = 0;

  if (metadata.name && metadata.name.length > 2) score += 20;
  if (metadata.title && metadata.title.length > 5) score += 15;
  if (metadata.description && metadata.description.length > 20) score += 20;
  if (metadata.docs && metadata.docs.length > 50) score += 25;
  if (metadata.categories.length > 0) score += 10;
  if (
    metadata.dependencies.length > 0 ||
    metadata.registryDependencies.length > 0
  )
    score += 10;

  return Math.min(100, score);
}
