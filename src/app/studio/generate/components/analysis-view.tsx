"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ITEM_TYPE_OPTIONS } from "@/lib/studio/constants";
import { Sparkles, Package, Tag, FileCode, BookOpen, X } from "lucide-react";
import type { RegistryItemType } from "@/lib/studio/types";

interface AnalysisViewProps {
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
  onUpdate: (metadata: AnalysisViewProps["metadata"]) => void;
}

export function AnalysisView({ metadata, onUpdate }: AnalysisViewProps) {
  const [localMetadata, setLocalMetadata] = useState(metadata);
  const [newCategory, setNewCategory] = useState("");
  const [newDependency, setNewDependency] = useState("");
  const [newRegistryDep, setNewRegistryDep] = useState("");

  const updateField = <K extends keyof typeof localMetadata>(
    key: K,
    value: (typeof localMetadata)[K],
  ) => {
    const updated = { ...localMetadata, [key]: value };
    setLocalMetadata(updated);
    onUpdate(updated);
  };

  const addCategory = () => {
    if (
      newCategory.trim() &&
      !localMetadata.categories.includes(newCategory.trim())
    ) {
      updateField("categories", [
        ...localMetadata.categories,
        newCategory.trim(),
      ]);
      setNewCategory("");
    }
  };

  const removeCategory = (category: string) => {
    updateField(
      "categories",
      localMetadata.categories.filter((c) => c !== category),
    );
  };

  const addDependency = () => {
    if (
      newDependency.trim() &&
      !localMetadata.dependencies.includes(newDependency.trim())
    ) {
      updateField("dependencies", [
        ...localMetadata.dependencies,
        newDependency.trim(),
      ]);
      setNewDependency("");
    }
  };

  const removeDependency = (dep: string) => {
    updateField(
      "dependencies",
      localMetadata.dependencies.filter((d) => d !== dep),
    );
  };

  const addRegistryDep = () => {
    if (
      newRegistryDep.trim() &&
      !localMetadata.registryDependencies.includes(newRegistryDep.trim())
    ) {
      updateField("registryDependencies", [
        ...localMetadata.registryDependencies,
        newRegistryDep.trim(),
      ]);
      setNewRegistryDep("");
    }
  };

  const removeRegistryDep = (dep: string) => {
    updateField(
      "registryDependencies",
      localMetadata.registryDependencies.filter((d) => d !== dep),
    );
  };

  const selectedType = ITEM_TYPE_OPTIONS.find(
    (opt) => opt.value === localMetadata.type,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Analysis Results
        </CardTitle>
        <CardDescription>
          Review and edit the generated metadata before saving
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Component Name</Label>
            <Input
              id="name"
              value={localMetadata.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="button"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={localMetadata.type}
              onValueChange={(value) =>
                updateField("type", value as RegistryItemType)
              }
            >
              <SelectTrigger id="type">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <FileCode className="h-4 w-4" />
                    {selectedType?.label}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {ITEM_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {option.description}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={localMetadata.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="Button Component"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={localMetadata.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="A reusable button component..."
            rows={3}
          />
        </div>

        <Tabs defaultValue="docs" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="docs">
              <BookOpen className="h-4 w-4 mr-2" />
              Docs
            </TabsTrigger>
            <TabsTrigger value="dependencies">
              <Package className="h-4 w-4 mr-2" />
              Dependencies
            </TabsTrigger>
            <TabsTrigger value="categories">
              <Tag className="h-4 w-4 mr-2" />
              Categories
            </TabsTrigger>
          </TabsList>

          <TabsContent value="docs" className="space-y-2">
            <Label htmlFor="docs">Usage Documentation (Markdown)</Label>
            <Textarea
              id="docs"
              value={localMetadata.docs}
              onChange={(e) => updateField("docs", e.target.value)}
              placeholder="# Usage\n\n```tsx\nimport { Button } from '@/components/ui/button'\n```"
              className="font-mono text-sm min-h-[200px]"
            />
          </TabsContent>

          <TabsContent value="dependencies" className="space-y-4">
            <div className="space-y-2">
              <Label>NPM Dependencies</Label>
              <div className="flex gap-2">
                <Input
                  value={newDependency}
                  onChange={(e) => setNewDependency(e.target.value)}
                  placeholder="package-name"
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addDependency())
                  }
                />
                <Button type="button" onClick={addDependency}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {localMetadata.dependencies.map((dep) => (
                  <Badge key={dep} variant="secondary">
                    {dep}
                    <button
                      type="button"
                      onClick={() => removeDependency(dep)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Registry Dependencies (shadcn/ui)</Label>
              <div className="flex gap-2">
                <Input
                  value={newRegistryDep}
                  onChange={(e) => setNewRegistryDep(e.target.value)}
                  placeholder="button"
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addRegistryDep())
                  }
                />
                <Button type="button" onClick={addRegistryDep}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {localMetadata.registryDependencies.map((dep) => (
                  <Badge key={dep} variant="outline">
                    {dep}
                    <button
                      type="button"
                      onClick={() => removeRegistryDep(dep)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-2">
            <Label>Categories</Label>
            <div className="flex gap-2">
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="forms"
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addCategory())
                }
              />
              <Button type="button" onClick={addCategory}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {localMetadata.categories.map((category) => (
                <Badge key={category}>
                  {category}
                  <button
                    type="button"
                    onClick={() => removeCategory(category)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
