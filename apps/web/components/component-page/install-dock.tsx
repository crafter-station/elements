"use client";

import { useState } from "react";

import { track } from "@vercel/analytics";

import { CopyIcon } from "@/components/icons/copy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { ComponentWithLayout } from "./types";

interface ComponentInstallDockProps {
  selectedComponents: Set<string>;
  components?: Record<string, unknown>;
  componentInstallUrls: Record<string, string>;
  category: string;
  name: string;
}

export function ComponentInstallDock({
  selectedComponents,
  components,
  componentInstallUrls,
  category,
  name,
}: ComponentInstallDockProps) {
  const [packageManager, setPackageManager] = useState("bunx");
  const [copied, setCopied] = useState(false);

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
    track("Component Install Command Copy", {
      component_category: category,
      page_name: name || "unknown",
      package_manager: packageManager,
      selected_components: Array.from(selectedComponents).join(","),
      selected_count: selectedComponents.size,
      source: "component_page_install_dock",
    });

    try {
      await navigator.clipboard.writeText(getCommand(packageManager));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      track("Component Install Command Copy Error", {
        component_category: category,
        page_name: name || "unknown",
        package_manager: packageManager,
        selected_count: selectedComponents.size,
        source: "component_page_install_dock",
      });
      console.error("Failed to copy command:", err);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-card border rounded-lg shadow-lg max-w-lg w-full mx-4">
        <div className="flex rounded-md">
          <Select
            value={packageManager}
            onValueChange={(value) => {
              track("Component Package Manager Changed", {
                component_category: category,
                page_name: name || "unknown",
                from: packageManager,
                to: value,
                selected_components_count: selectedComponents.size,
                source: "component_page_install_dock",
              });
              setPackageManager(value);
            }}
          >
            <SelectTrigger className="text-muted-foreground hover:text-foreground w-20 sm:w-20 rounded-e-none border-0 border-r shadow-none text-xs sm:text-sm">
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
            className="-ms-px flex-1 rounded-none border-0 shadow-none font-mono text-xs sm:text-sm focus-visible:ring-0"
          />
          <Button
            onClick={copyCommand}
            size="sm"
            variant="outline"
            className="-ms-px rounded-s-none border-0 border-l shadow-none text-teal-600 hover:text-teal-500 h-9 w-12 sm:w-auto px-0 sm:px-3"
          >
            {copied ? (
              <svg
                width="16"
                height="16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-4 h-4"
              >
                <title>Copy Icon</title>
                <path
                  d="M18 6h2v2h-2V6zm-2 4V8h2v2h-2zm-2 2v-2h2v2h-2zm-2 2h2v-2h-2v2zm-2 2h2v-2h-2v2zm-2 0v2h2v-2H8zm-2-2h2v2H6v-2zm0 0H4v-2h2v2z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              <>
                <CopyIcon className="w-4 h-4 sm:hidden" />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
