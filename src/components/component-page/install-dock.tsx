"use client";

import { useState } from "react";

import { track } from "@vercel/analytics";

import { CopyIcon } from "@/components/icons/copy";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

    // TODO: Implement bulk export functionality
    console.log(
      `Bulk export: ${type} for ${selectedComponents.size} components`,
    );
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
            className="-ms-px rounded-none border-0 border-l shadow-none text-teal-600 hover:text-teal-500 h-9 w-12 sm:w-auto px-0 sm:px-3"
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
                <title>Copied</title>
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="-ms-px rounded-s-none border-0 border-l shadow-none h-9 px-3"
              >
                <svg
                  className="w-4 h-4"
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
                <span className="hidden sm:inline ml-2">Export</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleBulkExport("copy-svg")}>
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <title>Copy SVG</title>
                  <rect
                    width="14"
                    height="14"
                    x="8"
                    y="8"
                    rx="2"
                    ry="2"
                    strokeWidth="2"
                  />
                  <path
                    d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
                    strokeWidth="2"
                  />
                </svg>
                Copy as SVG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleBulkExport("copy-image")}>
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <title>Copy Image</title>
                  <rect
                    width="14"
                    height="14"
                    x="8"
                    y="8"
                    rx="2"
                    ry="2"
                    strokeWidth="2"
                  />
                  <path
                    d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
                    strokeWidth="2"
                  />
                  <circle cx="17.5" cy="10.5" r="0.8" strokeWidth="1.5" />
                </svg>
                Copy as Image
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleBulkExport("download-svg")}
              >
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <title>Download SVG</title>
                  <path
                    d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                    strokeWidth="2"
                  />
                  <polyline points="14 2 14 8 20 8" strokeWidth="2" />
                  <line x1="12" y1="11" x2="12" y2="17" strokeWidth="2" />
                  <polyline points="9 14 12 17 15 14" strokeWidth="2" />
                </svg>
                Download SVG
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleBulkExport("download-image")}
              >
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <title>Download Image</title>
                  <path
                    d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                    strokeWidth="2"
                  />
                  <polyline points="14 2 14 8 20 8" strokeWidth="2" />
                  <line x1="12" y1="11" x2="12" y2="17" strokeWidth="2" />
                  <polyline points="9 14 12 17 15 14" strokeWidth="2" />
                  <circle cx="10" cy="19" r="0.6" strokeWidth="1.5" />
                </svg>
                Download Image
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
