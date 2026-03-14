"use client";

import { type ReactNode, useState } from "react";

import { track } from "@vercel/analytics";

import { CopyIcon } from "@/components/icons/copy";
import { ShadcnIcon } from "@/components/shadcn-icon";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BunLogo } from "@/components/ui/logos/bun";
import { NpmLogo } from "@/components/ui/logos/npm";
import { PnpmLogo } from "@/components/ui/logos/pnpm";
import { YarnLogo } from "@/components/ui/logos/yarn";

import type { ComponentWithLayout } from "./types";

const PM_OPTIONS: {
  value: string;
  label: string;
  icon: ReactNode;
  prefix: string;
}[] = [
  {
    value: "bunx",
    label: "bunx",
    icon: <BunLogo className="size-3.5" />,
    prefix: "bunx",
  },
  {
    value: "npx",
    label: "npx",
    icon: <NpmLogo className="size-3.5" />,
    prefix: "npx",
  },
  {
    value: "pnpm",
    label: "pnpm",
    icon: <PnpmLogo className="size-3.5" />,
    prefix: "pnpm dlx",
  },
  {
    value: "yarn",
    label: "yarn",
    icon: <YarnLogo className="size-3.5" />,
    prefix: "yarn dlx",
  },
];

interface ComponentInstallDockProps {
  selectedComponents: Set<string>;
  components?: Record<string, unknown>;
  componentInstallUrls: Record<string, string>;
  category: string;
  name: string;
  showExport?: boolean;
}

export function ComponentInstallDock({
  selectedComponents,
  components,
  componentInstallUrls,
  category,
  name,
  showExport = false,
}: ComponentInstallDockProps) {
  const [pmIndex, setPmIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  if (selectedComponents.size === 0) return null;

  const pm = PM_OPTIONS[pmIndex];

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

  const getCommand = () => {
    const urls = getInstallUrls();
    return `${pm.prefix} shadcn@latest add ${urls}`;
  };

  const cyclePm = () => {
    const next = (pmIndex + 1) % PM_OPTIONS.length;
    track("Component Package Manager Changed", {
      component_category: category,
      page_name: name || "unknown",
      from: PM_OPTIONS[pmIndex].value,
      to: PM_OPTIONS[next].value,
      selected_components_count: selectedComponents.size,
      source: "component_page_install_dock",
    });
    setPmIndex(next);
  };

  const copyCommand = async () => {
    track("Component Install Command Copy", {
      component_category: category,
      page_name: name || "unknown",
      package_manager: pm.value,
      selected_components: Array.from(selectedComponents).join(","),
      selected_count: selectedComponents.size,
      source: "component_page_install_dock",
    });

    try {
      await navigator.clipboard.writeText(getCommand());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      track("Component Install Command Copy Error", {
        component_category: category,
        page_name: name || "unknown",
        package_manager: pm.value,
        selected_count: selectedComponents.size,
        source: "component_page_install_dock",
      });
      console.error("Failed to copy command:", err);
    }
  };

  const handleBulkExport = (
    type: "copy-svg" | "copy-image" | "download-svg" | "download-image",
  ) => {
    track("Bulk Export Action", {
      component_category: category,
      page_name: name || "unknown",
      export_type: type,
      selected_count: selectedComponents.size,
      source: "component_page_install_dock",
    });
    console.log(
      `Bulk export: ${type} for ${selectedComponents.size} components`,
    );
  };

  const componentName = Array.from(selectedComponents)[0] ?? "";

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-card border rounded-xl shadow-lg mx-4 flex items-center gap-0 overflow-hidden">
        <button
          type="button"
          onClick={cyclePm}
          title={`Switch package manager (${pm.label})`}
          className="flex items-center justify-center size-9 shrink-0 border-r hover:bg-muted transition-colors"
        >
          {pm.icon}
        </button>

        <button
          type="button"
          onClick={copyCommand}
          className="flex items-center gap-2 px-3 py-2 hover:bg-muted/50 transition-colors min-w-0"
        >
          <ShadcnIcon className="size-3.5 shrink-0 text-muted-foreground" />
          <span className="font-mono text-xs text-muted-foreground whitespace-nowrap">
            add
          </span>
          <span className="font-mono text-xs text-foreground font-medium truncate max-w-[200px] sm:max-w-[300px]">
            @elements/{componentName}
          </span>
        </button>

        <Button
          onClick={copyCommand}
          size="sm"
          variant="ghost"
          className={`shrink-0 h-9 px-3 border-l rounded-none text-xs font-medium transition-colors ${
            copied ? "text-emerald-500" : "text-teal-600 hover:text-teal-500"
          } ${!showExport ? "rounded-e-xl" : ""}`}
        >
          <span className="size-3 flex items-center justify-center">
            {copied ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <title>Copied</title>
                <path
                  d="M18 6h2v2h-2V6zm-2 4V8h2v2h-2zm-2 2v-2h2v2h-2zm-2 2h2v-2h-2v2zm-2 2h2v-2h-2v2zm-2 0v2h2v-2H8zm-2-2h2v2H6v-2zm0 0H4v-2h2v2z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              <CopyIcon className="size-3.5" />
            )}
          </span>
          <span className="hidden sm:grid sm:after:invisible sm:after:content-['Copied'] sm:after:row-start-1 sm:after:col-start-1">
            <span className="row-start-1 col-start-1">
              {copied ? "Copied" : "Copy"}
            </span>
          </span>
        </Button>

        {showExport && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="shrink-0 h-9 px-3 border-l rounded-none rounded-e-xl"
              >
                <svg
                  className="size-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <title>Export</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                <span className="hidden sm:inline ml-1.5">Export</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleBulkExport("copy-svg")}>
                Copy as SVG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleBulkExport("copy-image")}>
                Copy as Image
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleBulkExport("download-svg")}
              >
                Download SVG
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleBulkExport("download-image")}
              >
                Download Image
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
