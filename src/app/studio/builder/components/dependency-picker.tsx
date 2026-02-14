"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Search, Package, Blocks } from "lucide-react";

const COMMON_SHADCN_COMPONENTS = [
  "accordion",
  "alert",
  "alert-dialog",
  "avatar",
  "badge",
  "button",
  "calendar",
  "card",
  "checkbox",
  "collapsible",
  "command",
  "dialog",
  "drawer",
  "dropdown-menu",
  "form",
  "hover-card",
  "input",
  "label",
  "menubar",
  "navigation-menu",
  "popover",
  "progress",
  "radio-group",
  "scroll-area",
  "select",
  "separator",
  "sheet",
  "skeleton",
  "slider",
  "switch",
  "table",
  "tabs",
  "textarea",
  "toggle",
  "tooltip",
];

interface DependencyPickerProps {
  npmDeps: string[];
  registryDeps: string[];
  devDeps: string[];
  onUpdateNpm: (deps: string[]) => void;
  onUpdateRegistry: (deps: string[]) => void;
  onUpdateDev: (deps: string[]) => void;
}

export function DependencyPicker({
  npmDeps,
  registryDeps,
  devDeps,
  onUpdateNpm,
  onUpdateRegistry,
  onUpdateDev,
}: DependencyPickerProps) {
  const [npmInput, setNpmInput] = useState("");
  const [devInput, setDevInput] = useState("");
  const [registrySearch, setRegistrySearch] = useState("");

  const filteredShadcn = COMMON_SHADCN_COMPONENTS.filter(
    (c) =>
      c.includes(registrySearch.toLowerCase()) && !registryDeps.includes(c),
  );

  function addNpmDep(e: React.KeyboardEvent) {
    if (e.key === "Enter" && npmInput.trim()) {
      e.preventDefault();
      if (!npmDeps.includes(npmInput.trim())) {
        onUpdateNpm([...npmDeps, npmInput.trim()]);
      }
      setNpmInput("");
    }
  }

  function addDevDep(e: React.KeyboardEvent) {
    if (e.key === "Enter" && devInput.trim()) {
      e.preventDefault();
      if (!devDeps.includes(devInput.trim())) {
        onUpdateDev([...devDeps, devInput.trim()]);
      }
      setDevInput("");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Dependencies</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label className="flex items-center gap-1.5">
            <Package className="size-3.5" />
            npm Dependencies
          </Label>
          <div className="flex flex-wrap gap-1.5">
            {npmDeps.map((dep) => (
              <Badge key={dep} variant="secondary" className="gap-1">
                {dep}
                <button
                  type="button"
                  onClick={() => onUpdateNpm(npmDeps.filter((d) => d !== dep))}
                  className="rounded-full hover:bg-muted"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
          </div>
          <Input
            value={npmInput}
            onChange={(e) => setNpmInput(e.target.value)}
            onKeyDown={addNpmDep}
            placeholder="Press Enter to add (e.g. zod, date-fns)"
            className="text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-1.5">
            <Package className="size-3.5" />
            Dev Dependencies
          </Label>
          <div className="flex flex-wrap gap-1.5">
            {devDeps.map((dep) => (
              <Badge key={dep} variant="outline" className="gap-1">
                {dep}
                <button
                  type="button"
                  onClick={() => onUpdateDev(devDeps.filter((d) => d !== dep))}
                  className="rounded-full hover:bg-muted"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
          </div>
          <Input
            value={devInput}
            onChange={(e) => setDevInput(e.target.value)}
            onKeyDown={addDevDep}
            placeholder="Press Enter to add (e.g. @types/react)"
            className="text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-1.5">
            <Blocks className="size-3.5" />
            Registry Dependencies (shadcn)
          </Label>
          <div className="flex flex-wrap gap-1.5">
            {registryDeps.map((dep) => (
              <Badge key={dep} className="gap-1">
                {dep}
                <button
                  type="button"
                  onClick={() =>
                    onUpdateRegistry(registryDeps.filter((d) => d !== dep))
                  }
                  className="rounded-full hover:bg-muted"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
            <Input
              value={registrySearch}
              onChange={(e) => setRegistrySearch(e.target.value)}
              placeholder="Search shadcn components..."
              className="pl-8 text-sm"
            />
          </div>
          {registrySearch && filteredShadcn.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {filteredShadcn.slice(0, 10).map((component) => (
                <Button
                  key={component}
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => {
                    onUpdateRegistry([...registryDeps, component]);
                    setRegistrySearch("");
                  }}
                >
                  + {component}
                </Button>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
