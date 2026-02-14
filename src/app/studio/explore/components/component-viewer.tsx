"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ITEM_TYPE_LABELS } from "@/lib/studio/constants";
import type { ShadcnRegistryItemJson } from "@/lib/studio/types";
import { canPreview } from "@/lib/studio/sandpack-setup";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  ExternalLink,
  Eye,
  Code,
  FileCode2,
  FileText,
  FolderOpen,
  Package,
} from "lucide-react";
import { lazy, Suspense, useMemo, useState } from "react";

const SandpackPreviewPanel = lazy(() =>
  import("./sandpack-preview-panel").then((m) => ({
    default: m.SandpackPreviewPanel,
  })),
);

interface ComponentViewerProps {
  item: ShadcnRegistryItemJson;
  registryUrl: string;
}

interface FileTreeNode {
  name: string;
  path: string;
  isDir: boolean;
  children: FileTreeNode[];
  fileIndex?: number;
}

function buildFileTree(
  files: ShadcnRegistryItemJson["files"],
): FileTreeNode[] {
  const root: FileTreeNode[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const parts = file.path.split("/");
    let current = root;

    for (let j = 0; j < parts.length; j++) {
      const part = parts[j];
      const isLast = j === parts.length - 1;

      let existing = current.find((n) => n.name === part);
      if (!existing) {
        existing = {
          name: part,
          path: parts.slice(0, j + 1).join("/"),
          isDir: !isLast,
          children: [],
          fileIndex: isLast ? i : undefined,
        };
        current.push(existing);
      }
      current = existing.children;
    }
  }

  return root;
}

function FileTreeItem({
  node,
  depth,
  selectedIndex,
  onSelect,
}: {
  node: FileTreeNode;
  depth: number;
  selectedIndex: number;
  onSelect: (index: number) => void;
}) {
  const [open, setOpen] = useState(true);
  const isSelected = node.fileIndex === selectedIndex;

  if (node.isDir) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex w-full items-center gap-1 rounded px-1.5 py-1 text-left text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          style={{ paddingLeft: `${depth * 12 + 6}px` }}
        >
          {open ? (
            <ChevronDown className="size-3 shrink-0" />
          ) : (
            <ChevronRight className="size-3 shrink-0" />
          )}
          <FolderOpen className="size-3 shrink-0 text-blue-400" />
          <span className="truncate">{node.name}</span>
        </button>
        {open &&
          node.children.map((child) => (
            <FileTreeItem
              key={child.path}
              node={child}
              depth={depth + 1}
              selectedIndex={selectedIndex}
              onSelect={onSelect}
            />
          ))}
      </div>
    );
  }

  const ext = node.name.split(".").pop();
  const isTsx = ext === "tsx" || ext === "jsx";
  const isCss = ext === "css";
  const FileIcon = isTsx ? FileCode2 : isCss ? FileText : FileCode2;
  const iconColor = isTsx
    ? "text-blue-400"
    : isCss
      ? "text-purple-400"
      : "text-muted-foreground";

  return (
    <button
      type="button"
      onClick={() => node.fileIndex !== undefined && onSelect(node.fileIndex)}
      className={`flex w-full items-center gap-1.5 rounded px-1.5 py-1 text-left text-xs transition-colors ${
        isSelected
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
      style={{ paddingLeft: `${depth * 12 + 6}px` }}
    >
      <FileIcon className={`size-3 shrink-0 ${iconColor}`} />
      <span className="truncate">{node.name}</span>
    </button>
  );
}

function DependencySection({
  title,
  deps,
  variant = "secondary",
}: {
  title: string;
  deps: string[];
  variant?: "secondary" | "outline";
}) {
  const [open, setOpen] = useState(false);
  if (deps.length === 0) return null;

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-1.5 px-2 py-1.5 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
      >
        {open ? (
          <ChevronDown className="size-2.5" />
        ) : (
          <ChevronRight className="size-2.5" />
        )}
        <Package className="size-2.5" />
        {title} ({deps.length})
      </button>
      {open && (
        <div className="flex flex-wrap gap-1 px-2 pb-2">
          {deps.map((dep) => (
            <Badge key={dep} variant={variant} className="text-[10px] px-1.5 py-0">
              {dep}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

export function ComponentViewer({ item, registryUrl }: ComponentViewerProps) {
  const [copied, setCopied] = useState(false);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);

  const fileTree = useMemo(() => buildFileTree(item.files), [item.files]);
  const showable = canPreview(item);
  const selectedFile = item.files[selectedFileIndex];

  const handleCopyInstall = () => {
    const baseUrl = registryUrl.replace(/\/registry\.json$/, "");
    const command = `npx shadcn add ${baseUrl}/${item.name}.json`;
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCode = () => {
    if (!selectedFile?.content) return;
    navigator.clipboard.writeText(selectedFile.content);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-4 rounded-lg border border-border/50 bg-muted/30 p-4">
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="truncate font-semibold tracking-tight">
              {item.title || item.name}
            </h2>
            <Badge variant="secondary" className="shrink-0 text-[10px]">
              {ITEM_TYPE_LABELS[item.type]}
            </Badge>
          </div>
          {item.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {item.description}
            </p>
          )}
          <div className="flex items-center gap-3 pt-1">
            {item.docs && (
              <a
                href={item.docs}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
              >
                <ExternalLink className="size-3" />
                Docs
              </a>
            )}
            {item.categories && item.categories.length > 0 && (
              <div className="flex items-center gap-1">
                {item.categories.map((cat) => (
                  <span
                    key={cat}
                    className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <Button
          onClick={handleCopyInstall}
          size="sm"
          variant="outline"
          className="shrink-0 gap-1.5 text-xs"
        >
          {copied ? (
            <>
              <Check className="size-3" />
              Copied
            </>
          ) : (
            <>
              <Copy className="size-3" />
              Install
            </>
          )}
        </Button>
      </div>

      <div className="flex gap-3 overflow-hidden rounded-lg border border-border/50 bg-background" style={{ height: "560px" }}>
        <div className="flex w-56 shrink-0 flex-col border-r border-border/50 bg-muted/20">
          <div className="border-b border-border/50 px-3 py-2">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Files ({item.files.length})
            </p>
          </div>
          <div className="flex-1 overflow-y-auto py-1">
            {fileTree.map((node) => (
              <FileTreeItem
                key={node.path}
                node={node}
                depth={0}
                selectedIndex={selectedFileIndex}
                onSelect={setSelectedFileIndex}
              />
            ))}
          </div>
          <div className="border-t border-border/50">
            <DependencySection
              title="Dependencies"
              deps={item.dependencies || []}
            />
            <DependencySection
              title="Registry Deps"
              deps={item.registryDependencies || []}
              variant="outline"
            />
            <DependencySection
              title="Dev Deps"
              deps={item.devDependencies || []}
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden">
          <Tabs
            defaultValue={showable ? "preview" : "code"}
            className="flex flex-1 flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-border/50 px-3">
              <TabsList className="h-9 bg-transparent p-0">
                <TabsTrigger
                  value="preview"
                  disabled={!showable}
                  className="gap-1.5 rounded-none border-b-2 border-transparent px-3 text-xs data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  <Eye className="size-3" />
                  Preview
                </TabsTrigger>
                <TabsTrigger
                  value="code"
                  className="gap-1.5 rounded-none border-b-2 border-transparent px-3 text-xs data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  <Code className="size-3" />
                  Code
                </TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                {selectedFile?.target && (
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {selectedFile.target}
                  </span>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyCode}
                  className="h-6 gap-1 px-2 text-[10px]"
                  disabled={!selectedFile?.content}
                >
                  <Copy className="size-2.5" />
                  Copy
                </Button>
              </div>
            </div>

            <TabsContent
              value="preview"
              className="m-0 flex-1 overflow-hidden data-[state=inactive]:hidden"
            >
              {showable ? (
                <Suspense
                  fallback={
                    <div className="flex h-full items-center justify-center">
                      <div className="text-xs text-muted-foreground">
                        Loading preview...
                      </div>
                    </div>
                  }
                >
                  <SandpackPreviewPanel item={item} />
                </Suspense>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-xs text-muted-foreground">
                    Preview not available for server components
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent
              value="code"
              className="m-0 flex-1 overflow-hidden data-[state=inactive]:hidden"
            >
              {selectedFile?.content ? (
                <div className="h-full overflow-auto bg-[#0a0a0a]">
                  <pre className="p-4">
                    <code className="text-xs leading-relaxed text-[#e5e5e5]">
                      {selectedFile.content.split("\n").map((line, i) => (
                        <div key={i} className="flex">
                          <span className="mr-4 inline-block w-8 select-none text-right text-muted-foreground/40">
                            {i + 1}
                          </span>
                          <span className="flex-1">{line || " "}</span>
                        </div>
                      ))}
                    </code>
                  </pre>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-xs text-muted-foreground">
                    No content available for this file
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
