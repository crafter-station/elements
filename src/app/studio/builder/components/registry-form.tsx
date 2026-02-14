"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Globe, Lock } from "lucide-react";
import type { BuilderRegistry } from "../../stores/builder-store";

interface RegistryFormProps {
  registry: BuilderRegistry | null;
  onUpdate: (updates: Partial<BuilderRegistry>) => void;
}

const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export function RegistryForm({ registry, onUpdate }: RegistryFormProps) {
  const [name, setName] = useState(registry?.name ?? "");
  const [slug, setSlug] = useState(registry?.slug ?? "");
  const [displayName, setDisplayName] = useState(registry?.displayName ?? "");
  const [homepage, setHomepage] = useState(registry?.homepage ?? "");
  const [description, setDescription] = useState(registry?.description ?? "");
  const [isPublic, setIsPublic] = useState(registry?.isPublic ?? false);
  const [initialized, setInitialized] = useState(false);

  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;
  const registryRef = useRef(registry);
  registryRef.current = registry;

  const debouncedName = useDebounce(name, 500);
  const debouncedSlug = useDebounce(slug, 500);
  const debouncedDisplayName = useDebounce(displayName, 500);
  const debouncedHomepage = useDebounce(homepage, 500);
  const debouncedDescription = useDebounce(description, 500);

  useEffect(() => {
    if (!initialized || !registryRef.current) return;
    if (debouncedName !== registryRef.current.name) {
      onUpdateRef.current({ name: debouncedName });
    }
  }, [debouncedName, initialized]);

  useEffect(() => {
    if (!initialized || !registryRef.current) return;
    if (debouncedSlug !== registryRef.current.slug) {
      onUpdateRef.current({ slug: debouncedSlug });
    }
  }, [debouncedSlug, initialized]);

  useEffect(() => {
    if (!initialized || !registryRef.current) return;
    if (debouncedDisplayName !== registryRef.current.displayName) {
      onUpdateRef.current({ displayName: debouncedDisplayName || null });
    }
  }, [debouncedDisplayName, initialized]);

  useEffect(() => {
    if (!initialized || !registryRef.current) return;
    if (debouncedHomepage !== registryRef.current.homepage) {
      onUpdateRef.current({ homepage: debouncedHomepage || null });
    }
  }, [debouncedHomepage, initialized]);

  useEffect(() => {
    if (!initialized || !registryRef.current) return;
    if (debouncedDescription !== registryRef.current.description) {
      onUpdateRef.current({ description: debouncedDescription || null });
    }
  }, [debouncedDescription, initialized]);

  useEffect(() => {
    if (!initialized || !registryRef.current) return;
    if (isPublic !== registryRef.current.isPublic) {
      onUpdateRef.current({ isPublic });
    }
  }, [isPublic, initialized]);

  useEffect(() => {
    if (registry) {
      setName(registry.name);
      setSlug(registry.slug);
      setDisplayName(registry.displayName ?? "");
      setHomepage(registry.homepage ?? "");
      setDescription(registry.description ?? "");
      setIsPublic(registry.isPublic);
      setInitialized(true);
    }
  }, [registry?.id]);

  if (!registry) {
    return (
      <div className="p-5 text-sm text-muted-foreground">
        No registry loaded
      </div>
    );
  }

  return (
    <div className="space-y-5 p-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="registry-name" className="text-xs font-medium">
            Name
          </Label>
          <Input
            id="registry-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="my-registry"
            className="h-9 font-mono text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="registry-slug" className="text-xs font-medium">
            Slug
          </Label>
          <Input
            id="registry-slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="my-registry"
            className="h-9 font-mono text-sm"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label
            htmlFor="registry-display-name"
            className="text-xs font-medium"
          >
            Display Name
          </Label>
          <Input
            id="registry-display-name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="My Registry"
            className="h-9 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="registry-homepage" className="text-xs font-medium">
            Homepage
          </Label>
          <Input
            id="registry-homepage"
            value={homepage}
            onChange={(e) => setHomepage(e.target.value)}
            placeholder="https://example.com"
            className="h-9 text-sm"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="registry-description" className="text-xs font-medium">
          Description
        </Label>
        <Textarea
          id="registry-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="A collection of reusable components"
          rows={2}
          className="text-sm"
        />
      </div>

      <div className="flex items-center gap-3 rounded-md border border-border/50 bg-muted/30 px-3 py-2.5">
        <Switch
          id="registry-public"
          checked={isPublic}
          onCheckedChange={setIsPublic}
        />
        <Label
          htmlFor="registry-public"
          className="flex items-center gap-1.5 text-xs font-medium"
        >
          {isPublic ? (
            <>
              <Globe className="size-3 text-muted-foreground" />
              Public
            </>
          ) : (
            <>
              <Lock className="size-3 text-muted-foreground" />
              Private
            </>
          )}
        </Label>
        <span className="text-[11px] text-muted-foreground">
          {isPublic
            ? "Anyone can install components from this registry"
            : "Only you can access this registry"}
        </span>
      </div>
    </div>
  );
}
