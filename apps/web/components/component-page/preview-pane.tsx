"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { FileTreeViewer } from "@/components/file-tree-viewer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ComponentToolbar } from "./toolbar";
import type { RegistryItem } from "./types";
import { PREVIEW_TABS, type PreviewTab } from "./view-modes";

interface ComponentPreviewPaneProps {
  componentKey: string | null;
  component: ReactNode;
  registryItem?: RegistryItem;
  installUrl?: string;
  activeTab: PreviewTab;
  onTabChange: (tab: PreviewTab) => void;
  showTree: boolean;
  onToggleTree: () => void;
  category: string;
  pageName: string;
  className?: string;
}

export function ComponentPreviewPane({
  componentKey,
  component,
  registryItem,
  activeTab,
  onTabChange,
  showTree,
  onToggleTree,
  category,
  pageName,
  className,
}: ComponentPreviewPaneProps) {
  if (!componentKey) {
    return (
      <div
        className={cn(
          "flex-1 flex items-center justify-center text-muted-foreground",
          className,
        )}
      >
        <div className="text-center space-y-2">
          <p className="text-sm font-medium">No component selected</p>
          <p className="text-xs">
            Select a component from the sidebar to preview
          </p>
        </div>
      </div>
    );
  }

  const handleCopyCode = () => {
    // TODO: Implement code copy
    console.log("Copy code for", componentKey);
  };

  const handleOpenV0 = () => {
    // TODO: Implement v0 open
    console.log("Open in v0", componentKey);
  };

  return (
    <div className={cn("flex-1 flex flex-col overflow-hidden", className)}>
      {/* Toolbar */}
      <ComponentToolbar
        componentKey={componentKey}
        registryItemName={registryItem?.name}
        showTree={showTree}
        onToggleTree={onToggleTree}
        onCopyCode={handleCopyCode}
        onOpenV0={handleOpenV0}
        category={category}
        pageName={pageName}
      />

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => onTabChange(value as PreviewTab)}
        className="flex-1 flex flex-col"
      >
        <TabsList className="w-full justify-start rounded-none border-b border-dotted h-10 bg-transparent px-4">
          <TabsTrigger value={PREVIEW_TABS.PREVIEW} className="text-xs">
            Preview
          </TabsTrigger>
          <TabsTrigger value={PREVIEW_TABS.CODE} className="text-xs">
            Code
          </TabsTrigger>
          <TabsTrigger value={PREVIEW_TABS.TREE} className="text-xs">
            Tree
          </TabsTrigger>
          <TabsTrigger value={PREVIEW_TABS.INFO} className="text-xs">
            Info
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          {/* Preview Tab */}
          <TabsContent
            value={PREVIEW_TABS.PREVIEW}
            className="h-full m-0 data-[state=active]:flex"
          >
            <div className="flex-1 flex items-center justify-center bg-card/30 p-8">
              <div className="w-full max-w-4xl">{component}</div>
            </div>
          </TabsContent>

          {/* Code Tab */}
          <TabsContent
            value={PREVIEW_TABS.CODE}
            className="h-full m-0 data-[state=active]:flex"
          >
            <ScrollArea className="flex-1">
              <div className="p-6">
                <pre className="bg-muted/50 p-4 rounded-lg text-xs font-mono overflow-x-auto">
                  <code>
                    {`// Component code will be displayed here
import { ${componentKey} } from "@/components/${componentKey}";

export function Example() {
  return <${componentKey} />;
}`}
                  </code>
                </pre>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Tree Tab */}
          <TabsContent
            value={PREVIEW_TABS.TREE}
            className="h-full m-0 data-[state=active]:flex"
          >
            {registryItem ? (
              <FileTreeViewer
                files={(registryItem.files as any) || []}
                registryItem={registryItem}
                onClose={() => {}}
                className="flex-1 bg-transparent"
                componentKey={componentKey}
                source="component_preview_pane"
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
                No file tree available
              </div>
            )}
          </TabsContent>

          {/* Info Tab */}
          <TabsContent
            value={PREVIEW_TABS.INFO}
            className="h-full m-0 data-[state=active]:flex"
          >
            <ScrollArea className="flex-1">
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-sm mb-2">Component Name</h3>
                  <p className="text-sm text-muted-foreground capitalize">
                    {componentKey.replace(/-/g, " ")}
                  </p>
                </div>
                {registryItem && (
                  <>
                    <div>
                      <h3 className="font-semibold text-sm mb-2">
                        Registry Name
                      </h3>
                      <p className="text-sm text-muted-foreground font-mono">
                        {registryItem.name}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm mb-2">Files</h3>
                      <p className="text-sm text-muted-foreground">
                        {(registryItem.files as any[])?.length || 0} file(s)
                      </p>
                    </div>
                  </>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
