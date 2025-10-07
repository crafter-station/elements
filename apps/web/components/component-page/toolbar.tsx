"use client";

import { track } from "@vercel/analytics";
import { Code, Copy, ExternalLink, Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ComponentToolbarProps {
  componentKey: string;
  installUrl?: string;
  registryItemName?: string;
  showTree: boolean;
  onToggleTree: () => void;
  onCopyCode: () => void;
  onOpenV0: () => void;
  category: string;
  pageName: string;
  className?: string;
}

export function ComponentToolbar({
  componentKey,
  showTree,
  onToggleTree,
  onCopyCode,
  onOpenV0,
  category,
  pageName,
  className,
}: ComponentToolbarProps) {
  const actions = [
    {
      icon: showTree ? EyeOff : Eye,
      label: showTree ? "Hide Tree" : "Show Tree",
      shortcut: "T",
      onClick: () => {
        track("Component Toolbar Action", {
          action: showTree ? "hide_tree" : "show_tree",
          component_key: componentKey,
          category,
          page_name: pageName,
          source: "component_toolbar",
        });
        onToggleTree();
      },
    },
    {
      icon: Code,
      label: "View Code",
      shortcut: "C",
      onClick: () => {
        track("Component Toolbar Action", {
          action: "view_code",
          component_key: componentKey,
          category,
          page_name: pageName,
          source: "component_toolbar",
        });
        onCopyCode();
      },
    },
    {
      icon: Copy,
      label: "Copy",
      shortcut: "⌘C",
      onClick: () => {
        track("Component Toolbar Action", {
          action: "copy",
          component_key: componentKey,
          category,
          page_name: pageName,
          source: "component_toolbar",
        });
        onCopyCode();
      },
    },
    {
      icon: ExternalLink,
      label: "Open in v0",
      shortcut: "V",
      onClick: () => {
        track("Component Toolbar Action", {
          action: "open_v0",
          component_key: componentKey,
          category,
          page_name: pageName,
          source: "component_toolbar",
        });
        onOpenV0();
      },
    },
  ];

  return (
    <TooltipProvider>
      <div
        className={cn(
          "flex items-center gap-1 px-3 py-2 border-b border-border border-dotted bg-background/50",
          className,
        )}
      >
        <span className="text-xs text-muted-foreground font-medium mr-2">
          Actions
        </span>
        {actions.map((action, index) => (
          <div key={action.label} className="flex items-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={action.onClick}
                  className="h-7 px-2 gap-1.5 text-xs"
                >
                  <action.icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{action.label}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                <div className="flex items-center gap-2">
                  <span>{action.label}</span>
                  <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-muted rounded border">
                    {action.shortcut}
                  </kbd>
                </div>
              </TooltipContent>
            </Tooltip>
            {index < actions.length - 1 && (
              <Separator orientation="vertical" className="h-4 mx-1" />
            )}
          </div>
        ))}
      </div>
    </TooltipProvider>
  );
}
