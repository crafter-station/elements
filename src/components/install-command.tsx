"use client";

import { useState } from "react";

import { track } from "@vercel/analytics";
import { Check, Eye } from "lucide-react";
import { toast } from "sonner";

import { ShadcnIcon } from "@/components/shadcn-icon";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InstallCommandProps {
  url?: string;
  className?: string;
  brandColor?: string;
  source?: string;
  componentName?: string;
  category?: string;
}

function summarizeUrls(urls: string[], maxVisible = 3) {
  if (urls.length <= maxVisible) {
    return {
      display: urls.join(" "),
      hasMore: false,
      remaining: 0,
      count: urls.length,
    };
  }

  const visible = urls.slice(0, maxVisible);
  const remaining = urls.length - maxVisible;

  return {
    display: `${visible.join(" ")} +${remaining}`,
    hasMore: true,
    remaining,
    full: urls.join(" "),
    count: urls.length,
  };
}

export function InstallCommand({
  url = "@elements/clerk-waitlist",
  className,
  brandColor,
  source = "unknown",
  componentName = "unknown",
  category = "unknown",
}: InstallCommandProps) {
  const [packageManager, setPackageManager] = useState("bunx");
  const [copied, setCopied] = useState(false);

  const urls = url.split(" ");
  const urlSummary = summarizeUrls(urls);

  const getCommand = (pm: string) => {
    const commands = {
      bunx: `bunx shadcn@latest add ${url}`,
      npx: `npx shadcn@latest add ${url}`,
      pnpm: `pnpm dlx shadcn@latest add ${url}`,
      yarn: `yarn dlx shadcn@latest add ${url}`,
    };
    return commands[pm as keyof typeof commands];
  };

  const copyCommand = async () => {
    track("Install Command Standalone Copy", {
      package_manager: packageManager,
      install_url: url,
      component_name: componentName,
      category: category,
      source: source,
      action: "copy_install_command",
    });

    const command = getCommand(packageManager);
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      toast.success("Command copied to clipboard!");
      setTimeout(() => setCopied(false), 1000);
    } catch (err) {
      track("Install Command Copy Error", {
        package_manager: packageManager,
        install_url: url,
        component_name: componentName,
        source: source,
        error: "clipboard_failed",
      });
      console.error("Failed to copy command:", err);
    }
  };

  return (
    <div className={`w-fit ${className || ""}`}>
      <div className="flex rounded-md shadow-xs border">
        {/* Package Manager Select - Hidden on mobile */}
        <Select
          value={packageManager}
          onValueChange={(value) => {
            track("Install Command Package Manager Changed", {
              component_name: componentName,
              category: category,
              install_url: url,
              from: packageManager,
              to: value,
              source: source,
            });
            setPackageManager(value);
          }}
        >
          <SelectTrigger
            size="sm"
            className="text-muted-foreground hover:text-foreground w-[10ch] rounded-e-none border-0 border-r shadow-none text-xs h-7 hidden md:flex"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bunx" className="text-xs">
              bunx
            </SelectItem>
            <SelectItem value="npx" className="text-xs">
              npx
            </SelectItem>
            <SelectItem value="pnpm" className="text-xs">
              pnpm
            </SelectItem>
            <SelectItem value="yarn" className="text-xs">
              yarn
            </SelectItem>
          </SelectContent>
        </Select>
        <Button
          onClick={copyCommand}
          variant="ghost"
          size="sm"
          className={`-ms-px rounded-none md:rounded-l-none border-0 shadow-none h-7 sm:h-8 px-1.5 sm:px-2.5 justify-start font-mono text-xs ${
            copied ? "bg-muted" : "hover:bg-muted"
          } ${
            brandColor
              ? `hover:text-[${brandColor}]`
              : "text-teal-600 hover:text-teal-500"
          }`}
          style={
            brandColor
              ? {
                  color: brandColor,
                }
              : undefined
          }
        >
          <div className="flex items-center gap-1.5">
            {copied ? (
              <Check className="size-3.5 flex-shrink-0" />
            ) : (
              <ShadcnIcon className="size-3.5 flex-shrink-0" />
            )}
            {/* Mobile: Show component name, Desktop: Show full command */}
            <span className="md:hidden text-foreground/70 text-xs whitespace-nowrap">
              {componentName}
            </span>
          </div>
          {/* Full command - Desktop only */}
          <div className="hidden md:flex items-center gap-1">
            <span className="whitespace-nowrap">{urlSummary.display}</span>
            {urls.length > 1 && (
              <span className="text-muted-foreground whitespace-nowrap text-[10px]">
                ({urlSummary.count})
              </span>
            )}
          </div>
        </Button>
        {urlSummary.hasMore && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-l-none border-0 shadow-none hover:bg-muted/50"
              >
                <Eye className="w-3.5 h-3.5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80">
              <div className="space-y-2">
                <div className="text-sm font-medium">
                  Full command ({urls.length} components)
                </div>
                <div className="p-2 bg-muted rounded text-xs font-mono break-all">
                  {packageManager} shadcn@latest add {urlSummary.full}
                </div>
                <Button onClick={copyCommand} size="sm" className="w-full">
                  {copied ? (
                    <Check className="w-4 h-4 mr-2" />
                  ) : (
                    <ShadcnIcon className="w-4 h-4 mr-2" />
                  )}
                  Copy Full Command
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
}
