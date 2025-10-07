"use client";

import { useState } from "react";

import { track } from "@vercel/analytics";
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  ExternalLink,
  Package,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { ComponentWithLayout } from "./types";

interface QuickInstallPanelProps {
  selectedComponents: Set<string>;
  components?: Record<string, unknown>;
  componentInstallUrls: Record<string, string>;
  category: string;
  name: string;
  className?: string;
}

export function QuickInstallPanel({
  selectedComponents,
  components,
  componentInstallUrls,
  category,
  name,
  className,
}: QuickInstallPanelProps) {
  const [packageManager, setPackageManager] = useState("bunx");
  const [copied, setCopied] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  if (selectedComponents.size === 0) return null;

  const getInstallUrls = () =>
    Array.from(selectedComponents)
      .map((key) => {
        const component = components?.[key];
        const isComponentWithLayout =
          component &&
          typeof component === "object" &&
          "component" in component;
        return isComponentWithLayout
          ? (component as ComponentWithLayout).installUrl
          : componentInstallUrls[key];
      })
      .filter(Boolean)
      .join(" ");

  const getCommand = (pm: string) => {
    const urls = getInstallUrls();
    const commands = {
      bunx: `bunx shadcn@latest add ${urls}`,
      npx: `npx shadcn@latest add ${urls}`,
      pnpm: `pnpm dlx shadcn@latest add ${urls}`,
      yarn: `yarn dlx shadcn@latest add ${urls}`,
    };
    return commands[pm as keyof typeof commands] || "";
  };

  const copyCommand = async () => {
    track("Quick Install Panel Copy", {
      component_category: category,
      page_name: name || "unknown",
      package_manager: packageManager,
      selected_components: Array.from(selectedComponents).join(","),
      selected_count: selectedComponents.size,
      source: "quick_install_panel",
    });

    try {
      await navigator.clipboard.writeText(getCommand(packageManager));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy command:", err);
    }
  };

  return (
    <div
      className={cn(
        "fixed right-6 bottom-6 z-50 w-96 transition-all duration-200",
        className,
      )}
    >
      <Card className="shadow-lg border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-sm">Quick Install</h3>
              <Badge variant="secondary" className="text-xs">
                {selectedComponents.size}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className="h-7 w-7 -mr-2"
            >
              {collapsed ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardHeader>

        {!collapsed && (
          <CardContent className="space-y-3">
            {/* Package Manager Select */}
            <div className="flex items-center gap-2">
              <Select
                value={packageManager}
                onValueChange={(value) => {
                  track("Quick Install Panel PM Change", {
                    from: packageManager,
                    to: value,
                    category,
                    page_name: name,
                    source: "quick_install_panel",
                  });
                  setPackageManager(value);
                }}
              >
                <SelectTrigger className="w-24 h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bunx">bunx</SelectItem>
                  <SelectItem value="npx">npx</SelectItem>
                  <SelectItem value="pnpm">pnpm</SelectItem>
                  <SelectItem value="yarn">yarn</SelectItem>
                </SelectContent>
              </Select>

              <Input
                readOnly
                value={`shadcn@latest add ${getInstallUrls()}`}
                className="flex-1 h-9 font-mono text-xs bg-muted/50"
              />

              <Button
                onClick={copyCommand}
                size="sm"
                variant="outline"
                className="h-9 w-9 p-0"
              >
                {copied ? (
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-4 h-4 text-green-500"
                  >
                    <title>Copied</title>
                    <path
                      d="M18 6h2v2h-2V6zm-2 4V8h2v2h-2zm-2 2v-2h2v2h-2zm-2 2h2v-2h-2v2zm-2 2h2v-2h-2v2zm-2 0v2h2v-2H8zm-2-2h2v2H6v-2zm0 0H4v-2h2v2z"
                      fill="currentColor"
                    />
                  </svg>
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-8 text-xs"
                onClick={() => {
                  track("Quick Install Panel Action", {
                    action: "download",
                    category,
                    page_name: name,
                    source: "quick_install_panel",
                  });
                }}
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-8 text-xs"
                onClick={() => {
                  track("Quick Install Panel Action", {
                    action: "sandbox",
                    category,
                    page_name: name,
                    source: "quick_install_panel",
                  });
                }}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                CodeSandbox
              </Button>
            </div>

            {/* Stats */}
            <div className="pt-2 border-t text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Components:</span>
                <span className="font-medium">{selectedComponents.size}</span>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
