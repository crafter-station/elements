"use client";

import { useEffect, useRef, useState } from "react";

import {
  createOnDropHandler,
  dragAndDropFeature,
  hotkeysCoreFeature,
  keyboardDragAndDropFeature,
  selectionFeature,
  syncDataLoaderFeature,
} from "@headless-tree/core";
import { AssistiveTreeDescription, useTree } from "@headless-tree/react";
import {
  RiBracesLine,
  RiCodeLine,
  RiFileLine,
  RiFileTextLine,
  RiFolderOpenLine,
  RiImageLine,
  RiReactjsLine,
} from "@remixicon/react";
import { track } from "@vercel/analytics";
import type { BundledLanguage } from "shiki/bundle/web";
import { toast } from "sonner";

import { findBestFileMatch } from "@/lib/registry-utils";

import { ElementsLogo } from "@/components/elements-logo";
import { AtIcon } from "@/components/icons/at";
import { CodeIcon } from "@/components/icons/code";
import { CopyIcon } from "@/components/icons/copy";
import { FolderIcon } from "@/components/icons/folder";
import { InstallCommand } from "@/components/install-command";
import { PixelatedCheckIcon } from "@/components/pixelated-check-icon";
import { ShadcnIcon } from "@/components/shadcn-icon";
import { Tree, TreeItem, TreeItemLabel } from "@/components/tree";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import { ScrollArea } from "@/components/ui/scroll-area";

import { FileIcon } from "./icons/file";

interface RegistryFile {
  path: string;
  type: string;
  target: string;
}

interface RegistryItem {
  name: string;
  files?: RegistryFile[];
  dependencies?: string[];
  registryDependencies?: string[];
}

interface TreeNode {
  name: string;
  children?: string[];
  fileExtension?: string;
  registryFile?: RegistryFile;
  type?: "file" | "folder" | "dependency" | "registry-dependency";
}

interface FileTreeViewerProps {
  files: RegistryFile[];
  registryItem?: RegistryItem;
  onClose: () => void;
  className?: string;
  componentKey?: string;
  source?: string;
}

// Helper function to get icon based on file extension
function getFileIcon(node: TreeNode, className: string) {
  // Individual dependencies get CodeIcon
  if (node.type === "dependency") {
    return <CodeIcon className={className} />;
  }

  // Registry dependencies get ShadcnIcon or ElementsLogo based on name
  if (node.type === "registry-dependency") {
    if (node.name.startsWith("@elements/")) {
      return <ElementsLogo className={className} />;
    }
    return <ShadcnIcon className={className} />;
  }

  // Dependency folders (Dependencies and Registry Dependencies) get @ icon
  if (
    node.type === "folder" &&
    (node.name === "Dependencies" || node.name === "Registry Dependencies")
  ) {
    return <AtIcon className={className} />;
  }

  // Regular folders get folder icon
  if (node.type === "folder" || node.children) {
    return <FolderIcon className={className} />;
  }

  const extension = node.fileExtension;
  switch (extension) {
    case "tsx":
    case "jsx":
      return <RiReactjsLine className={className} />;
    case "ts":
    case "js":
    case "mjs":
      return <CodeIcon className={className} />;
    case "json":
      return <RiBracesLine className={className} />;
    case "svg":
    case "ico":
    case "png":
    case "jpg":
      return <RiImageLine className={className} />;
    case "md":
      return <RiFileTextLine className={className} />;
    default:
      return <RiFileLine className={className} />;
  }
}

// Helper function to get flattened folder display name VSCode-style
function getFlattenedFolderName(
  tree: Record<string, TreeNode>,
  folderPath: string,
): string {
  const folder = tree[folderPath];
  if (!folder || folder.type !== "folder" || !folder.children?.length) {
    return folder?.name || folderPath;
  }

  // Check if this folder has only one child and that child is also a folder
  if (folder.children.length === 1) {
    const childPath = folder.children[0];
    const child = tree[childPath];

    if (child?.type === "folder") {
      // Recursively get the flattened name
      const childFlattenedName = getFlattenedFolderName(tree, childPath);
      return `${folder.name}/${childFlattenedName}`;
    }
  }

  return folder.name;
}

// Helper function to get the final children for a flattened folder
function getFlattenedFolderChildren(
  tree: Record<string, TreeNode>,
  folderPath: string,
): string[] {
  const folder = tree[folderPath];
  if (!folder || folder.type !== "folder" || !folder.children?.length) {
    return folder?.children || [];
  }

  // Check if this folder has only one child and that child is also a folder
  if (folder.children.length === 1) {
    const childPath = folder.children[0];
    const child = tree[childPath];

    if (child?.type === "folder") {
      // Recursively get the final children
      return getFlattenedFolderChildren(tree, childPath);
    }
  }

  return folder.children;
}

// Helper function to build file structure from target paths
function buildFileStructureFromPaths(
  files: RegistryFile[],
  registryItem?: RegistryItem,
): Record<string, TreeNode> {
  const tree: Record<string, TreeNode> = {
    root: { name: "Project", children: [] },
  };

  // Add files - use target for display path
  files.forEach((file, fileIndex) => {
    // Use target if available (where file should be installed),
    // otherwise fall back to path (source location in registry)
    let filePath = file.target || file.path;

    // Skip files without either target or path
    if (!filePath) {
      console.warn("⚠️ Skipping file without target or path:", file);
      return;
    }

    // Strip common registry prefixes from path (not target)
    // Only strip if we're using path, not target
    if (!file.target && file.path) {
      const prefixPatterns = [
        /^registry\/[^/]+\/blocks\/[^/]+\/[^/]+\//, // registry/default/blocks/{provider}/{component}/
        /^registry\/[^/]+\/[^/]+\//, // registry/default/{type}/
      ];

      for (const pattern of prefixPatterns) {
        if (pattern.test(filePath)) {
          filePath = filePath.replace(pattern, "");
          break;
        }
      }
    }

    const parts = filePath.split("/");
    let currentPath = "";

    parts.forEach((part, index) => {
      const parentPath = currentPath || "root";
      currentPath = currentPath ? `${currentPath}/${part}` : part;

      const isFile = index === parts.length - 1 && part.includes(".");

      // For files, create unique ID using the full target path + index
      // This ensures files with same name in different folders are unique
      const nodeId = isFile
        ? `file_${fileIndex}_${filePath.replace(/\//g, "_")}`
        : currentPath;

      if (!tree[nodeId]) {
        const extension = isFile ? part.split(".").pop() : undefined;

        tree[nodeId] = {
          name: part,
          children: isFile ? undefined : [],
          fileExtension: extension,
          type: isFile ? "file" : "folder",
          registryFile: isFile ? file : undefined,
        };

        if (!tree[parentPath].children?.includes(nodeId)) {
          tree[parentPath].children?.push(nodeId);
        }
      }
    });
  });

  // Add registry dependencies if they exist
  if (
    registryItem?.registryDependencies &&
    registryItem.registryDependencies.length > 0
  ) {
    const depsPath = "registry-dependencies";
    tree[depsPath] = {
      name: "Registry Dependencies",
      children: [],
      type: "folder",
    };
    tree.root.children?.push(depsPath);

    registryItem.registryDependencies.forEach((dep) => {
      const depPath = `${depsPath}/${dep}`;
      tree[depPath] = {
        name: dep,
        type: "registry-dependency",
      };
      tree[depsPath].children?.push(depPath);
    });
  }

  // Add regular dependencies if they exist
  if (registryItem?.dependencies && registryItem.dependencies.length > 0) {
    const depsPath = "dependencies";
    tree[depsPath] = {
      name: "Dependencies",
      children: [],
      type: "folder",
    };
    tree.root.children?.push(depsPath);

    registryItem.dependencies.forEach((dep) => {
      const depPath = `${depsPath}/${dep}`;
      tree[depPath] = {
        name: dep,
        type: "dependency",
      };
      tree[depsPath].children?.push(depPath);
    });
  }

  // Sort children alphabetically (folders first, then files, dependencies last)
  Object.values(tree).forEach((node) => {
    if (node.children) {
      node.children.sort((a, b) => {
        const nodeA = tree[a];
        const nodeB = tree[b];
        const isAFolder = nodeA?.type === "folder";
        const isBFolder = nodeB?.type === "folder";

        // Check if this is a dependency folder (Dependencies or Registry Dependencies)
        const isADepFolder =
          nodeA?.name === "Dependencies" ||
          nodeA?.name === "Registry Dependencies";
        const isBDepFolder =
          nodeB?.name === "Dependencies" ||
          nodeB?.name === "Registry Dependencies";

        // Dependencies folders go last
        if (isADepFolder && !isBDepFolder) return 1;
        if (!isADepFolder && isBDepFolder) return -1;

        // Within dependency folders, Registry Dependencies comes after Dependencies
        if (isADepFolder && isBDepFolder) {
          if (nodeA?.name === "Registry Dependencies") return 1;
          if (nodeB?.name === "Registry Dependencies") return -1;
        }

        // Regular folders before files
        if (isAFolder && !isBFolder) return -1;
        if (!isAFolder && isBFolder) return 1;

        // Then alphabetically
        return nodeA?.name.localeCompare(nodeB?.name || "") || 0;
      });
    }
  });

  return tree;
}

export function FileTreeViewer({
  files,
  registryItem,
  onClose,
  className,
  componentKey = "unknown",
  source = "unknown",
}: FileTreeViewerProps) {
  const [items] = useState(() =>
    buildFileStructureFromPaths(files, registryItem),
  );
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const [showFileTree, setShowFileTree] = useState(true); // For mobile toggle
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleNodeSelect = async (nodeId: string) => {
    const node = items[nodeId];

    if (
      node?.type === "file" ||
      node?.type === "dependency" ||
      node?.type === "registry-dependency"
    ) {
      track("File Tree Node Selected", {
        node_id: nodeId,
        node_name: node.name,
        node_type: node.type,
        component_key: componentKey,
        registry_item: registryItem?.name || "unknown",
        source: source,
        file_extension: node.fileExtension || null,
      });
      // Clear previous timeout and copied state when switching nodes
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setCopiedCommand(null);
      setCopied(false);

      // Set loading state and clear content
      setIsLoading(true);
      setFileContent(null);
      setSelectedFile(nodeId);

      // Auto-switch to code view on mobile when file is selected
      setShowFileTree(false);

      // For dependencies, we don't generate content - we'll show InstallCommand instead
      if (node.type === "dependency" || node.type === "registry-dependency") {
        setIsLoading(false);
        // Don't set file content for dependencies
        return;
      }

      // Only generate content for actual files
      try {
        const simulatedContent = await generateFileContent(node);
        setFileContent(simulatedContent);
      } catch (error) {
        console.error("❌ Error loading file content:", error);
        setFileContent("// Error loading file content");
      } finally {
        setIsLoading(false);
      }
    } else {
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: We don't want to re-run this effect when the selected file changes
  useEffect(() => {
    if (!selectedFile && Object.keys(items).length > 0) {
      // Find the first file (not folder) in the tree
      const firstFile = Object.entries(items).find(
        ([key, item]) => item.type === "file" && key !== "root",
      );

      if (firstFile) {
        handleNodeSelect(firstFile[0]);
      }
    }
  }, [items, selectedFile]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const tree = useTree<TreeNode>({
    initialState: {
      expandedItems: Object.keys(items).filter((key) => {
        const item = items[key];
        if (!item || (item.type !== "folder" && !item.children?.length))
          return false;

        // Keep Dependencies and Registry Dependencies closed by default
        if (
          item.name === "Dependencies" ||
          item.name === "Registry Dependencies"
        ) {
          return false;
        }

        return true;
      }),
      selectedItems: [],
    },
    indent: 16,
    rootItemId: "root",
    getItemName: (item) => {
      const itemData = item.getItemData();
      if (!itemData) return "Unknown";

      // For folders, use the flattened name if applicable
      if (itemData.type === "folder") {
        return getFlattenedFolderName(items, item.getId());
      }

      return itemData.name;
    },
    isItemFolder: (item) => (item.getItemData()?.children?.length ?? 0) > 0,
    canReorder: false,
    onDrop: createOnDropHandler(() => {}),
    dataLoader: {
      getItem: (itemId) => items[itemId],
      getChildren: (itemId) => {
        const item = items[itemId];
        if (!item) return [];

        // For folders, use flattened children if applicable
        if (item.type === "folder") {
          return getFlattenedFolderChildren(items, itemId);
        }

        return item.children ?? [];
      },
    },
    features: [
      syncDataLoaderFeature,
      selectionFeature,
      hotkeysCoreFeature,
      dragAndDropFeature,
      keyboardDragAndDropFeature,
    ],
  });

  const selectedFileNode: TreeNode | null = selectedFile
    ? items[selectedFile]
    : null;

  const copyFileContent = async () => {
    if (fileContent && selectedFile) {
      track("File Tree Content Copy", {
        file_name: selectedFile,
        component_key: componentKey,
        registry_item: registryItem?.name || "unknown",
        source: source,
        content_length: fileContent.length,
      });

      try {
        await navigator.clipboard.writeText(fileContent);
        setCopied(true);
        toast.success("File content copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        track("File Tree Content Copy Error", {
          file_name: selectedFile,
          component_key: componentKey,
          registry_item: registryItem?.name || "unknown",
          source: source,
          error: "clipboard_failed",
        });
        console.error("Failed to copy file content:", err);
        toast.error("Failed to copy file content");
      }
    }
  };

  const copyCommand = async (command: string, commandType: string) => {
    const currentNode: TreeNode | null = selectedFile
      ? items[selectedFile]
      : null;

    track("File Tree Command Copy", {
      command: command,
      package_manager: commandType,
      dependency_name: currentNode?.name || "unknown",
      dependency_type: currentNode?.type || "unknown",
      component_key: componentKey,
      registry_item: registryItem?.name || "unknown",
      source: source,
    });

    try {
      // Clear previous timeout if exists
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      await navigator.clipboard.writeText(command);
      setCopiedCommand(commandType);
      toast.success(`${commandType} command copied to clipboard!`);

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        setCopiedCommand(null);
        timeoutRef.current = null;
      }, 2000);
    } catch (err) {
      track("File Tree Command Copy Error", {
        command: command,
        package_manager: commandType,
        dependency_name: currentNode?.name || "unknown",
        component_key: componentKey,
        source: source,
        error: "clipboard_failed",
      });
      console.error("Failed to copy command:", err);
      toast.error("Failed to copy command");
    }
  };

  // Helper function to load real file content from registry
  const generateFileContent = async (node: TreeNode): Promise<string> => {
    // Handle dependencies
    if (node.type === "dependency") {
      return `// ${node.name} - NPM Dependency
// This is an external dependency installed via package manager

/**
 * Package: ${node.name}
 * Type: External NPM dependency
 *
 * Installation:
 * npm install ${node.name}
 *
 * Usage example:
 */

import { someFunction } from "${node.name}";

// Example usage of ${node.name}
const example = someFunction();

// For more information, visit:
// https://www.npmjs.com/package/${node.name}`;
    }

    if (node.type === "registry-dependency") {
      return `// ${node.name} - Registry Dependency
// This is a shadcn/ui component or registry component

/**
 * Component: ${node.name}
 * Type: Registry dependency from shadcn/ui
 *
 * Installation:
 * bunx shadcn@latest add ${node.name}
 *
 * Usage example:
 */

import { ${node.name.charAt(0).toUpperCase() + node.name.slice(1)} } from "@/components/ui/${node.name}";

export function Example() {
  return (
    <${node.name.charAt(0).toUpperCase() + node.name.slice(1)}>
      Example content
    </${node.name.charAt(0).toUpperCase() + node.name.slice(1)}>
  );
}

// For more information, visit:
// https://ui.shadcn.com/docs/components/${node.name}`;
    }

    // Handle regular files - try to load real content from registry
    if (node.type === "file" && node.registryFile) {
      try {
        if (registryItem?.name) {
          // Use relative path for both local and production
          const registryUrl = `/r/${registryItem.name}.json`;

          // Try to fetch the registry JSON file
          const response = await fetch(registryUrl);

          if (response.ok) {
            const registryData = await response.json();
            const matchingFile = findBestFileMatch(
              node.registryFile,
              registryData.files,
            );
            if (matchingFile?.content) {
              return matchingFile.content;
            }
          }
        }
      } catch (error) {
        console.warn(
          "❌ Failed to load real content, falling back to template:",
          error,
        );
      }
    }

    // Fallback to template content
    const fileName = node.name;
    const extension = node.fileExtension;

    switch (extension) {
      case "tsx":
        return `"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ${fileName.replace(".tsx", "").charAt(0).toUpperCase() + fileName.replace(".tsx", "").slice(1)}Props {
  className?: string;
  children?: React.ReactNode;
}

export function ${fileName.replace(".tsx", "").charAt(0).toUpperCase() + fileName.replace(".tsx", "").slice(1)}({ className, children, ...props }: ${fileName.replace(".tsx", "").charAt(0).toUpperCase() + fileName.replace(".tsx", "").slice(1)}Props) {
  return (
    <div
      className={cn("", className)}
      {...props}
    >
      {children}
    </div>
  );
}`;

      case "ts":
        return `import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ${fileName.replace(".ts", "")}<T>(value: T): T {
  return value;
}`;

      case "json":
        return `{
  "name": "${fileName.replace(".json", "")}",
  "version": "1.0.0",
  "description": "Component configuration",
  "main": "index.js",
  "dependencies": {
    "react": "^18.0.0",
    "typescript": "^5.0.0"
  }
}`;

      case "css":
        return `.${fileName.replace(".css", "")} {
  /* Add your styles here */
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.${fileName.replace(".css", "")}__item {
  padding: 0.5rem;
  border-radius: 0.375rem;
  background-color: var(--background);
}`;

      default:
        return `// ${fileName}
// This is a sample file content
// In a real implementation, this would be loaded from the actual file`;
    }
  };

  // Close icon (X)
  const CloseIcon = () => (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <title>Close Icon</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );

  // Determine if this is an embedded view (no fixed positioning)
  const isEmbedded = className?.includes("relative");

  return (
    <div
      className={
        isEmbedded
          ? `${className} h-full flex`
          : `fixed inset-0 bg-background/95 backdrop-blur-sm z-50 ${className}`
      }
    >
      <div className="h-full flex flex-col md:flex-row w-full">
        {/* Mobile Toggle Bar */}
        <div className="md:hidden flex border-b border-border border-dotted bg-muted">
          <button
            type="button"
            onClick={() => setShowFileTree(true)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              showFileTree
                ? "bg-background text-foreground border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <RiFolderOpenLine className="w-4 h-4" />
            <span>Files</span>
          </button>
          <button
            type="button"
            onClick={() => setShowFileTree(false)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              !showFileTree
                ? "bg-background text-foreground border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <RiCodeLine className="w-4 h-4" />
            <span>Code</span>
          </button>
        </div>

        {/* Sidebar - File Tree */}
        <div
          className={`w-full md:w-64 border-r border-border border-dotted bg-card/30 ${showFileTree ? "flex flex-col" : "hidden md:flex md:flex-col"}`}
        >
          <div className="p-3 border-b border-border border-dotted flex items-center justify-between">
            <div className="flex items-center gap-2 w-full">
              <FileIcon className="text-muted-foreground size-3.5 shrink-0" />
              <h3 className="font-semibold text-xs">File Explorer</h3>
            </div>
            {!isEmbedded && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  track("File Tree Viewer Close", {
                    component_key: componentKey,
                    registry_item: registryItem?.name || "unknown",
                    source: source,
                    files_viewed: selectedFile ? 1 : 0,
                  });
                  onClose();
                }}
                className="h-6 w-6 p-0"
              >
                <CloseIcon />
              </Button>
            )}
          </div>

          <ScrollArea className="h-[calc(100%-60px)]">
            <div className="p-2">
              <Tree className="text-sm" indent={16} tree={tree}>
                <AssistiveTreeDescription tree={tree} />
                {tree.getItems().map((item) => {
                  const nodeData = item.getItemData();
                  if (!nodeData || item.getId() === "root") return null;

                  return (
                    <TreeItem key={item.getId()} item={item} className="pb-0!">
                      <TreeItemLabel
                        className="rounded-sm py-1 px-2 bg-transparent hover:bg-accent/50 cursor-pointer"
                        onClick={(e) => {
                          // If it's a folder, let the tree handle expansion
                          if (
                            nodeData.type === "folder" ||
                            (nodeData.children?.length ?? 0) > 0
                          ) {
                            return; // Don't stop propagation, let tree handle it
                          }

                          // If it's a file/dependency, handle selection
                          e.stopPropagation();
                          handleNodeSelect(item.getId());
                        }}
                      >
                        <span className="flex items-center gap-2 min-w-0">
                          {getFileIcon(
                            nodeData,
                            "text-muted-foreground pointer-events-none size-4 shrink-0",
                          )}
                          <span className="text-sm truncate max-w-[17ch]">
                            {item.getItemName()}
                          </span>
                        </span>
                      </TreeItemLabel>
                    </TreeItem>
                  );
                })}
              </Tree>
            </div>
          </ScrollArea>
        </div>

        {/* Main Content - Code View */}
        <div
          className={`flex-1 flex flex-col ${!showFileTree ? "flex" : "hidden md:flex"}`}
        >
          <div className="px-3 py-2 border-b border-border border-dotted">
            {(() => {
              if (
                selectedFileNode &&
                (selectedFileNode.type === "file" ||
                  selectedFileNode.type === "dependency" ||
                  selectedFileNode.type === "registry-dependency")
              ) {
                return (
                  <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                    {/* Left side: Icon + File name */}
                    <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1 overflow-hidden">
                      {/* Icon */}
                      {getFileIcon(
                        selectedFileNode,
                        "text-muted-foreground size-3.5 sm:size-4 shrink-0",
                      )}

                      {/* File name - always visible, truncated */}
                      <span className="font-mono text-xs sm:text-sm truncate font-medium">
                        {selectedFileNode.name}
                      </span>
                    </div>

                    {/* Right side: Actions + Badges - compact */}
                    <div className="flex items-center gap-1 shrink-0">
                      {/* Copy button - always visible for files */}
                      {selectedFileNode.type === "file" && (
                        <Button
                          onClick={copyFileContent}
                          size="sm"
                          variant="outline"
                          className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                          disabled={isLoading || !fileContent}
                        >
                          {isLoading ? (
                            <svg
                              className="w-3.5 h-3.5 animate-spin"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <title>Loading</title>
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                          ) : copied ? (
                            <svg
                              width="14"
                              height="14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              className="w-3.5 h-3.5 text-primary"
                            >
                              <title>Copied Icon</title>
                              <path
                                d="M18 6h2v2h-2V6zm-2 4V8h2v2h-2zm-2 2v-2h2v2h-2zm-2 2h2v-2h-2v2zm-2 2h2v-2h-2v2zm-2 0v2h2v-2H8zm-2-2h2v2H6v-2zm0 0H4v-2h2v2z"
                                fill="currentColor"
                              />
                            </svg>
                          ) : (
                            <CopyIcon className="w-3.5 h-3.5" />
                          )}
                        </Button>
                      )}

                      {/* Badges - Compact and always visible */}
                      {selectedFileNode.type === "file" &&
                        selectedFileNode.registryFile && (
                          <Badge
                            variant="secondary"
                            className="text-[10px] h-5 px-1.5"
                          >
                            {selectedFileNode.registryFile.type}
                          </Badge>
                        )}
                      {selectedFileNode.type === "dependency" && (
                        <Badge
                          variant="outline"
                          className="text-[10px] h-5 px-1.5"
                        >
                          NPM
                        </Badge>
                      )}
                      {selectedFileNode.type === "registry-dependency" && (
                        <Badge
                          variant="outline"
                          className="text-[10px] h-5 px-1.5"
                        >
                          Registry
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              }
              return null;
            })()}
          </div>

          <ScrollArea className="h-full flex-1 bg-[#FFF] dark:bg-[#101010]">
            <div className="min-h-full p-0">
              {(() => {
                if (
                  selectedFileNode &&
                  (selectedFileNode.type === "file" ||
                    selectedFileNode.type === "dependency" ||
                    selectedFileNode.type === "registry-dependency")
                ) {
                  // Show InstallCommand for dependencies
                  if (selectedFileNode.type === "dependency") {
                    return (
                      <div className="min-h-full flex items-center justify-center p-8">
                        <div className="text-center space-y-8 max-w-lg w-full">
                          {/* Header Section */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-center gap-2 mb-4">
                              <CodeIcon className="w-8 h-8 text-primary" />
                            </div>
                            <div className="space-y-2">
                              <div className="text-xs uppercase tracking-[0.2em] font-mono text-primary/70">
                                [NPM PACKAGE]
                              </div>
                              <h3 className="font-dotted font-black text-2xl lg:text-3xl text-foreground">
                                {selectedFileNode.name}
                              </h3>
                              <p className="text-muted-foreground leading-relaxed">
                                Install this package using your preferred
                                package manager
                              </p>
                            </div>
                          </div>

                          {/* Installation Commands Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                              type="button"
                              onClick={() =>
                                copyCommand(
                                  `bun add ${selectedFileNode.name}`,
                                  "bun",
                                )
                              }
                              className="group relative overflow-hidden rounded-lg border border-border bg-card/50 hover:bg-accent/20 transition-all duration-300 cursor-pointer"
                            >
                              <div className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  {copiedCommand === "bun" ? (
                                    <PixelatedCheckIcon className="w-4 h-4 text-green-500" />
                                  ) : (
                                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                                  )}
                                  <span className="text-sm font-medium">
                                    {copiedCommand === "bun"
                                      ? "Copied!"
                                      : "bun"}
                                  </span>
                                </div>
                                <code className="text-sm font-mono text-muted-foreground">
                                  bun add {selectedFileNode.name}
                                </code>
                              </div>
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                copyCommand(
                                  `npm install ${selectedFileNode.name}`,
                                  "npm",
                                )
                              }
                              className="group relative overflow-hidden rounded-lg border border-border bg-card/50 hover:bg-accent/20 transition-all duration-300 cursor-pointer"
                            >
                              <div className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  {copiedCommand === "npm" ? (
                                    <PixelatedCheckIcon className="w-4 h-4 text-green-500" />
                                  ) : (
                                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                                  )}
                                  <span className="text-sm font-medium">
                                    {copiedCommand === "npm"
                                      ? "Copied!"
                                      : "npm"}
                                  </span>
                                </div>
                                <code className="text-sm font-mono text-muted-foreground">
                                  npm install {selectedFileNode.name}
                                </code>
                              </div>
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                copyCommand(
                                  `pnpm add ${selectedFileNode.name}`,
                                  "pnpm",
                                )
                              }
                              className="group relative overflow-hidden rounded-lg border border-border bg-card/50 hover:bg-accent/20 transition-all duration-300 cursor-pointer"
                            >
                              <div className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  {copiedCommand === "pnpm" ? (
                                    <PixelatedCheckIcon className="w-4 h-4 text-green-500" />
                                  ) : (
                                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                                  )}
                                  <span className="text-sm font-medium">
                                    {copiedCommand === "pnpm"
                                      ? "Copied!"
                                      : "pnpm"}
                                  </span>
                                </div>
                                <code className="text-sm font-mono text-muted-foreground">
                                  pnpm add {selectedFileNode.name}
                                </code>
                              </div>
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                copyCommand(
                                  `yarn add ${selectedFileNode.name}`,
                                  "yarn",
                                )
                              }
                              className="group relative overflow-hidden rounded-lg border border-border bg-card/50 hover:bg-accent/20 transition-all duration-300 cursor-pointer"
                            >
                              <div className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  {copiedCommand === "yarn" ? (
                                    <PixelatedCheckIcon className="w-4 h-4 text-green-500" />
                                  ) : (
                                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                                  )}
                                  <span className="text-sm font-medium">
                                    {copiedCommand === "yarn"
                                      ? "Copied!"
                                      : "yarn"}
                                  </span>
                                </div>
                                <code className="text-sm font-mono text-muted-foreground">
                                  yarn add {selectedFileNode.name}
                                </code>
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  if (selectedFileNode.type === "registry-dependency") {
                    const isElementsComponent =
                      selectedFileNode.name.startsWith("@elements/");

                    return (
                      <div className="min-h-full flex items-center justify-center p-8">
                        <div className="text-center space-y-8 max-w-md w-full">
                          {/* Header Section */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-center gap-2 mb-4">
                              {isElementsComponent ? (
                                <ElementsLogo className="w-8 h-8 text-primary" />
                              ) : (
                                <ShadcnIcon className="w-8 h-8 text-primary" />
                              )}
                            </div>
                            <div className="space-y-2">
                              <div className="text-xs uppercase tracking-[0.2em] font-mono text-primary/70">
                                {isElementsComponent
                                  ? "[ELEMENTS COMPONENT]"
                                  : "[SHADCN/UI COMPONENT]"}
                              </div>
                              <h3 className="font-dotted font-black text-2xl lg:text-3xl text-foreground">
                                {selectedFileNode.name}
                              </h3>
                              <p className="text-muted-foreground leading-relaxed">
                                {isElementsComponent
                                  ? "Install this component from the Elements registry"
                                  : "Install this component from the shadcn/ui registry"}
                              </p>
                            </div>
                          </div>

                          {/* Install Command */}
                          <div className="relative flex justify-center">
                            <div className="group relative overflow-hidden rounded-lg border border-border bg-card/50 hover:bg-accent/20 transition-all duration-300 p-1">
                              <InstallCommand
                                url={selectedFileNode.name}
                                className="!max-w-fit border-0 shadow-none bg-transparent"
                                source="file_tree_viewer_registry_dependency"
                                componentName={selectedFileNode.name}
                                category="Registry Dependency"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // Show file content for actual files
                  if (fileContent) {
                    // Determine language for syntax highlighting
                    let lang = "typescript";
                    if (selectedFileNode.type === "file") {
                      if (
                        selectedFileNode.fileExtension === "tsx" ||
                        selectedFileNode.fileExtension === "ts"
                      ) {
                        lang = "typescript";
                      } else if (selectedFileNode.fileExtension === "json") {
                        lang = "json";
                      } else if (selectedFileNode.fileExtension === "css") {
                        lang = "css";
                      } else if (
                        selectedFileNode.fileExtension === "js" ||
                        selectedFileNode.fileExtension === "jsx"
                      ) {
                        lang = "javascript";
                      }
                    }

                    return (
                      <div className="h-full overflow-auto">
                        <CodeBlock
                          code={fileContent}
                          lang={lang as BundledLanguage}
                          className="border-none !text-[12px] [&_pre]:text-[12px] [&_code]:text-[12px]"
                        />
                      </div>
                    );
                  }
                }
                return null;
              })()}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
