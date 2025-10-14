"use client";

import { useState } from "react";

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
  RiCodeSSlashLine,
  RiFileLine,
  RiFileTextLine,
  RiFolderLine,
  RiGitBranchLine,
  RiImageLine,
  RiReactjsLine,
} from "@remixicon/react";

import { Tree, TreeItem, TreeItemLabel } from "@/components/tree";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface RegistryItem {
  name: string;
  type: string;
  title: string;
  description: string;
  files: Array<{
    path: string;
    type: string;
    target: string;
  }>;
  registryDependencies?: string[];
  dependencies?: string[];
  envVars?: Record<string, string>;
  docs?: string;
  categories?: string[];
}

interface TreeNode {
  name: string;
  children?: string[];
  fileExtension?: string;
  registryItem?: RegistryItem;
  registryFile?: RegistryItem["files"][0];
  isRegistryRoot?: boolean;
  type?: "file" | "folder" | "registry-item" | "dependency";
}

interface RegistryVisualizerProps {
  registryItems: RegistryItem[];
  selectedItem?: string;
  className?: string;
}

// Helper function to get icon based on file extension or type
function getNodeIcon(node: TreeNode, className: string) {
  if (node.isRegistryRoot) {
    return <RiGitBranchLine className={className} />;
  }

  if (node.type === "dependency") {
    return <RiBracesLine className={className} />;
  }

  if (node.type === "folder" || node.children) {
    return <RiFolderLine className={className} />;
  }

  const extension = node.fileExtension;
  switch (extension) {
    case "tsx":
    case "jsx":
      return <RiReactjsLine className={className} />;
    case "ts":
    case "js":
    case "mjs":
      return <RiCodeSSlashLine className={className} />;
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

// Helper function to build file structure from target paths
function buildFileStructureFromPaths(
  paths: string[],
): Record<string, TreeNode> {
  const tree: Record<string, TreeNode> = {
    root: { name: "Project Structure", children: [] },
  };

  paths.forEach((path) => {
    const parts = path.split("/");
    let currentPath = "";

    parts.forEach((part, index) => {
      const parentPath = currentPath || "root";
      currentPath = currentPath ? `${currentPath}/${part}` : part;

      if (!tree[currentPath]) {
        const isFile = index === parts.length - 1 && part.includes(".");
        const extension = isFile ? part.split(".").pop() : undefined;

        tree[currentPath] = {
          name: part,
          children: isFile ? undefined : [],
          fileExtension: extension,
          type: isFile ? "file" : "folder",
        };

        if (!tree[parentPath].children?.includes(currentPath)) {
          tree[parentPath].children?.push(currentPath);
        }
      }
    });
  });

  // Sort children alphabetically (folders first, then files, both alphabetically)
  Object.values(tree).forEach((node) => {
    if (node.children) {
      node.children.sort((a, b) => {
        const nodeA = tree[a];
        const nodeB = tree[b];
        const isAFolder = nodeA?.type === "folder";
        const isBFolder = nodeB?.type === "folder";

        // Folders first
        if (isAFolder && !isBFolder) return -1;
        if (!isAFolder && isBFolder) return 1;

        // Then alphabetically
        return nodeA?.name.localeCompare(nodeB?.name || "") || 0;
      });
    }
  });

  return tree;
}

// Helper function to build tree structure from registry items
function buildTreeFromRegistryItems(
  items: RegistryItem[],
): Record<string, TreeNode> {
  const tree: Record<string, TreeNode> = {
    root: {
      name: "Registry Components",
      children: [],
    },
  };

  items.forEach((item) => {
    // Add registry item as top-level node
    const itemId = item.name;
    tree[itemId] = {
      name: item.title || item.name,
      children: [],
      registryItem: item,
      isRegistryRoot: true,
      type: "registry-item",
    };

    tree.root.children?.push(itemId);

    // Add file structure (simulate real project structure)
    const filesId = `${itemId}-files`;
    tree[filesId] = {
      name: "Project Structure",
      children: [],
      type: "folder",
    };
    tree[itemId].children?.push(filesId);

    // Build real file structure from target paths
    const targetPaths = item.files.map((f) => f.target);
    const fileStructure = buildFileStructureFromPaths(targetPaths);

    // Add file structure nodes to our tree
    Object.entries(fileStructure).forEach(([key, node]) => {
      if (key !== "root") {
        const nodeId = `${filesId}-${key}`;
        tree[nodeId] = {
          ...node,
          registryFile: item.files.find((f) => f.target === key),
        };

        // Update parent references
        if (node.children) {
          tree[nodeId].children = node.children.map(
            (child) => `${filesId}-${child}`,
          );
        }
      }
    });

    // Set root children
    tree[filesId].children =
      fileStructure.root.children?.map((child) => `${filesId}-${child}`) || [];

    // Add dependencies if they exist
    if (item.dependencies && item.dependencies.length > 0) {
      const depsId = `${itemId}-deps`;
      tree[depsId] = {
        name: "Dependencies",
        children: [],
        type: "folder",
      };
      tree[itemId].children?.push(depsId);

      item.dependencies.forEach((dep, index) => {
        const depId = `${itemId}-dep-${index}`;
        tree[depId] = {
          name: dep,
          type: "dependency",
        };
        tree[depsId].children?.push(depId);
      });
    }

    // Add registry dependencies if they exist
    if (item.registryDependencies && item.registryDependencies.length > 0) {
      const regDepsId = `${itemId}-regdeps`;
      tree[regDepsId] = {
        name: "Registry Dependencies",
        children: [],
        type: "folder",
      };
      tree[itemId].children?.push(regDepsId);

      item.registryDependencies.forEach((dep, index) => {
        const depId = `${itemId}-regdep-${index}`;
        tree[depId] = {
          name: dep,
          type: "dependency",
        };
        tree[regDepsId].children?.push(depId);
      });
    }
  });

  return tree;
}

export function RegistryVisualizer({
  registryItems,
  selectedItem,
  className,
}: RegistryVisualizerProps) {
  const [items] = useState(() => buildTreeFromRegistryItems(registryItems));
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showTreeView, setShowTreeView] = useState(true);
  const [activeTab, setActiveTab] = useState("structure");

  const tree = useTree<TreeNode>({
    initialState: {
      expandedItems: [
        "root",
        ...registryItems.slice(0, 3).map((item) => item.name),
      ],
      selectedItems: selectedItem ? [selectedItem] : [],
    },
    indent: 20,
    rootItemId: "root",
    getItemName: (item) => item.getItemData()?.name ?? "Unknown",
    isItemFolder: (item) => (item.getItemData()?.children?.length ?? 0) > 0,
    canReorder: false,
    onDrop: createOnDropHandler(() => {}),
    dataLoader: {
      getItem: (itemId) => items[itemId],
      getChildren: (itemId) => items[itemId]?.children ?? [],
    },
    features: [
      syncDataLoaderFeature,
      selectionFeature,
      hotkeysCoreFeature,
      dragAndDropFeature,
      keyboardDragAndDropFeature,
    ],
  });

  const selectedRegistryItem =
    selectedNode && items[selectedNode]?.registryItem;
  const selectedFileNode =
    selectedNode && selectedNode !== "" ? items[selectedNode] : undefined;
  const isFileSelected =
    selectedFileNode &&
    typeof selectedFileNode === "object" &&
    (selectedFileNode as TreeNode).type === "file" &&
    (selectedFileNode as TreeNode).registryFile;

  const handleNodeSelect = (nodeId: string) => {
    setSelectedNode(nodeId);
    const node = items[nodeId];

    if (node?.isRegistryRoot) {
      setActiveTab("details");
    } else if (node?.type === "file" && node?.registryFile) {
      setActiveTab("code");
    }
  };

  // Get file content from registry path - this would normally be a fetch call
  const _getFileContent = async (filePath: string) => {
    // For now, return placeholder code - in real implementation you'd fetch from the registry
    return `// File: ${filePath}\n// This is where the actual file content would be displayed\n// You would fetch this from your registry or file system\n\nexport default function Component() {\n  return (\n    <div>\n      {/* Component implementation */}\n    </div>\n  );\n}`;
  };

  return (
    <div className={`flex h-full gap-4 ${className}`}>
      {/* Tree Structure - with toggle */}
      {showTreeView && (
        <div className="flex-1 min-w-0 max-w-md">
          <div className="border rounded-lg h-full">
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Registry Structure</h3>
                <p className="text-sm text-muted-foreground">
                  Explore the file structure and dependencies
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTreeView(false)}
                className="h-8 w-8 p-0"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <title>Show Tree Icon</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Button>
            </div>
            <ScrollArea className="h-[500px]">
              <div className="p-4">
                <Tree
                  className="relative before:absolute before:inset-0 before:-ms-1 before:bg-[repeating-linear-gradient(to_right,transparent_0,transparent_calc(var(--tree-indent)-1px),var(--border)_calc(var(--tree-indent)-1px),var(--border)_calc(var(--tree-indent)))]"
                  indent={20}
                  tree={tree}
                >
                  <AssistiveTreeDescription tree={tree} />
                  {tree.getItems().map((item) => {
                    const nodeData = item.getItemData();
                    return (
                      <TreeItem
                        key={item.getId()}
                        item={item}
                        className="pb-0!"
                        onClick={() => handleNodeSelect(item.getId())}
                      >
                        <TreeItemLabel className="rounded-none py-1">
                          <span className="flex items-center gap-2">
                            {!item.isFolder() &&
                              nodeData &&
                              getNodeIcon(
                                nodeData,
                                "text-muted-foreground pointer-events-none size-4",
                              )}
                            <span className="flex items-center gap-2">
                              {item.getItemName()}
                              {nodeData?.isRegistryRoot && (
                                <Badge variant="outline" className="text-xs">
                                  {nodeData.registryItem?.type}
                                </Badge>
                              )}
                              {nodeData?.type === "dependency" && (
                                <Badge variant="secondary" className="text-xs">
                                  npm
                                </Badge>
                              )}
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
        </div>
      )}

      {/* Details Panel - now takes full width when tree is hidden */}
      <div className={`flex-1 min-w-0 ${!showTreeView ? "max-w-none" : ""}`}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <div className="border rounded-lg h-full flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="structure">Structure</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
                <TabsTrigger value="install">Install</TabsTrigger>
              </TabsList>

              {!showTreeView && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTreeView(true)}
                  className="h-8 px-3"
                >
                  <svg
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <title>Show Tree Icon</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                  Show Tree
                </Button>
              )}
            </div>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="structure" className="h-full mt-0">
                <ScrollArea className="h-full">
                  <div className="p-4 space-y-4">
                    <h4 className="font-medium">Registry Overview</h4>
                    <div className="grid gap-2 text-sm">
                      <div>
                        Total Components:{" "}
                        <span className="font-mono">
                          {registryItems.length}
                        </span>
                      </div>
                      <div>
                        Types:{" "}
                        {Array.from(
                          new Set(registryItems.map((item) => item.type)),
                        ).map((type) => (
                          <Badge
                            key={type}
                            variant="outline"
                            className="ml-2 text-xs"
                          >
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">Quick Stats</h5>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 bg-muted/30 rounded">
                          <div className="font-mono font-bold">
                            {registryItems.reduce(
                              (acc, item) => acc + item.files.length,
                              0,
                            )}
                          </div>
                          <div className="text-muted-foreground">
                            Total Files
                          </div>
                        </div>
                        <div className="p-2 bg-muted/30 rounded">
                          <div className="font-mono font-bold">
                            {
                              Array.from(
                                new Set(
                                  registryItems.flatMap(
                                    (item) => item.dependencies || [],
                                  ),
                                ),
                              ).length
                            }
                          </div>
                          <div className="text-muted-foreground">
                            Dependencies
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="details" className="h-full mt-0">
                <ScrollArea className="h-full">
                  <div className="p-4">
                    {selectedRegistryItem ? (
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold flex items-center gap-2">
                            {selectedRegistryItem.title}
                            <Badge variant="outline">
                              {selectedRegistryItem.type}
                            </Badge>
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {selectedRegistryItem.description}
                          </p>
                        </div>

                        {selectedRegistryItem.docs && (
                          <div className="p-3 bg-muted/30 rounded-lg">
                            <h5 className="font-medium text-sm mb-2">
                              Documentation
                            </h5>
                            <p className="text-xs text-muted-foreground">
                              {selectedRegistryItem.docs}
                            </p>
                          </div>
                        )}

                        {selectedRegistryItem.envVars && (
                          <div>
                            <h5 className="font-medium text-sm mb-2">
                              Environment Variables
                            </h5>
                            <div className="space-y-2">
                              {Object.entries(selectedRegistryItem.envVars).map(
                                ([key, value]) => (
                                  <div
                                    key={key}
                                    className="flex justify-between items-center p-2 bg-muted/30 rounded"
                                  >
                                    <code className="text-xs font-mono">
                                      {key}
                                    </code>
                                    <code className="text-xs font-mono text-muted-foreground">
                                      {value}
                                    </code>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        )}

                        {selectedRegistryItem.categories && (
                          <div>
                            <h5 className="font-medium text-sm mb-2">
                              Categories
                            </h5>
                            <div className="flex gap-1 flex-wrap">
                              {selectedRegistryItem.categories.map(
                                (category) => (
                                  <Badge
                                    key={category}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {category}
                                  </Badge>
                                ),
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">
                          Select a registry item to view details
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="code" className="h-full mt-0">
                <ScrollArea className="h-full">
                  <div className="p-4">
                    {isFileSelected && selectedFileNode?.registryFile ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">
                              {selectedFileNode.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {selectedFileNode.registryFile.target}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {selectedFileNode.registryFile.type}
                          </Badge>
                        </div>

                        <div className="border rounded-lg">
                          <CodeBlock
                            code={`// File: ${selectedFileNode.registryFile.path}
// Target: ${selectedFileNode.registryFile.target}
// Type: ${selectedFileNode.registryFile.type}

// This is a placeholder for the actual file content
// In a real implementation, you would fetch the file content from:
// ${selectedFileNode.registryFile.path}

export default function Component() {
  return (
    <div>
      {/* Component implementation would be here */}
      <h1>Hello from {selectedFileNode.name}</h1>
    </div>
  );
}`}
                            lang={
                              selectedFileNode.fileExtension === "tsx"
                                ? "typescript"
                                : selectedFileNode.fileExtension === "ts"
                                  ? "typescript"
                                  : selectedFileNode.fileExtension === "json"
                                    ? "json"
                                    : "typescript"
                            }
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">
                          Select a file from the tree to view its code
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="install" className="h-full mt-0">
                <ScrollArea className="h-full">
                  <div className="p-4 space-y-4">
                    {selectedRegistryItem ? (
                      <>
                        <div>
                          <h4 className="font-semibold mb-2">Installation</h4>
                          <CodeBlock
                            code={`bunx shadcn@latest add @elements/${selectedRegistryItem.name}`}
                            lang="bash"
                          />
                        </div>

                        {selectedRegistryItem.dependencies &&
                          selectedRegistryItem.dependencies.length > 0 && (
                            <div>
                              <h5 className="font-medium text-sm mb-2">
                                Install Dependencies
                              </h5>
                              <CodeBlock
                                code={`npm install ${selectedRegistryItem.dependencies.join(" ")}`}
                                lang="bash"
                              />
                            </div>
                          )}

                        {selectedRegistryItem.envVars && (
                          <div>
                            <h5 className="font-medium text-sm mb-2">
                              Environment Setup
                            </h5>
                            <CodeBlock
                              code={Object.entries(selectedRegistryItem.envVars)
                                .map(([key, value]) => `${key}=${value}`)
                                .join("\n")}
                              lang="bash"
                            />
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div>
                          <h4 className="font-semibold mb-2">Registry Setup</h4>
                          <CodeBlock
                            code={`{
  "registries": {
    "@elements": "https://tryelements.dev/r/{name}.json"
  }
}`}
                            lang="json"
                          />
                        </div>
                        <div>
                          <h5 className="font-medium text-sm mb-2">
                            Install Any Component
                          </h5>
                          <CodeBlock
                            code="bunx shadcn@latest add @elements/[component-name]"
                            lang="bash"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
