"use client";

import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  LayoutList,
  Search,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import type { ViewMode } from "./view-modes";
import { VIEW_MODES } from "./view-modes";

interface ComponentSidebarProps {
  components: string[];
  selectedComponents: Set<string>;
  activeComponent: string | null;
  onComponentToggle: (key: string) => void;
  onComponentClick: (key: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  focusedIndex: number;
  className?: string;
}

export function ComponentSidebar({
  components,
  selectedComponents,
  activeComponent,
  onComponentToggle,
  onComponentClick,
  searchTerm,
  onSearchChange,
  viewMode,
  onViewModeChange,
  collapsed,
  onCollapsedChange,
  focusedIndex,
  className,
}: ComponentSidebarProps) {
  if (collapsed) {
    return (
      <div
        className={cn(
          "border-r border-border border-dotted bg-background/50 flex flex-col items-center py-4 w-12",
          className,
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onCollapsedChange(false)}
          className="w-8 h-8"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>

        <div className="mt-4 flex flex-col gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
            {selectedComponents.size}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "border-r border-border border-dotted bg-background/50 flex flex-col w-80",
        className,
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border border-dotted space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm">Components</h3>
            <Badge variant="secondary" className="text-xs">
              {components.length}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onCollapsedChange(true)}
            className="w-8 h-8 -mr-2"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <kbd className="text-xs">esc</kbd>
            </button>
          )}
        </div>

        {/* View Mode Toggle */}
        <div className="grid grid-cols-2 gap-1">
          <Button
            variant={viewMode === VIEW_MODES.LIST ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange(VIEW_MODES.LIST)}
            className="h-8 text-xs"
          >
            <LayoutList className="w-4 h-4" />
            List
          </Button>
          <Button
            variant={viewMode === VIEW_MODES.GRID ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange(VIEW_MODES.GRID)}
            className="h-8 text-xs"
          >
            <LayoutGrid className="w-4 h-4" />
            Grid
          </Button>
        </div>
      </div>

      {/* Component List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {components.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <Search className="w-8 h-8 text-muted-foreground/50 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">
                No components found
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Try adjusting your search
              </p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {components.map((componentKey, index) => {
                const isSelected = selectedComponents.has(componentKey);
                const isActive = activeComponent === componentKey;
                const isFocused = index === focusedIndex;

                return (
                  <button
                    key={componentKey}
                    type="button"
                    onClick={() => onComponentClick(componentKey)}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md transition-colors text-left group",
                      isActive && "bg-accent ring-1 ring-border",
                      !isActive && "hover:bg-accent/50",
                      isFocused && !isActive && "ring-1 ring-border/50",
                    )}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onComponentToggle(componentKey)}
                      onClick={(e) => e.stopPropagation()}
                      className="shrink-0"
                    />
                    <div className="flex-1 min-w-0 flex items-center gap-2">
                      <p
                        className={cn(
                          "text-sm font-medium truncate capitalize",
                          isActive ? "text-foreground" : "text-foreground/90",
                        )}
                      >
                        {componentKey.replace(/-/g, " ")}
                      </p>
                      {componentKey.includes("beta") && (
                        <Badge
                          variant="outline"
                          className="border-blue-500 text-blue-500 text-[10px] px-1.5 py-0 h-4"
                        >
                          β
                        </Badge>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-border border-dotted">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{selectedComponents.size} selected</span>
          {selectedComponents.size > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                for (const key of selectedComponents) {
                  onComponentToggle(key);
                }
              }}
              className="h-6 text-xs -mr-2"
            >
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
