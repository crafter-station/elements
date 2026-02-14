"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";

interface PreviewPanelProps {
  files: Array<{ path: string; type: string; content: string }>;
  itemName: string;
}

export function PreviewPanel({ files, itemName }: PreviewPanelProps) {
  const mainFile = useMemo(() => {
    return (
      files.find(
        (f) =>
          f.type === "registry:component" ||
          f.type === "registry:ui" ||
          f.type === "registry:block",
      ) || files[0]
    );
  }, [files]);

  if (!mainFile || !mainFile.content) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Eye className="size-4" />
            Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed">
            <p className="text-sm text-muted-foreground">
              Add file content to see a preview
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base">
          <Eye className="size-4" />
          Preview
        </CardTitle>
        <Badge variant="outline" className="text-xs">
          {mainFile.path || itemName}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-lg border bg-muted/30">
          <div className="flex items-center gap-1.5 border-b px-3 py-2">
            <div className="size-2.5 rounded-full bg-red-500/40" />
            <div className="size-2.5 rounded-full bg-yellow-500/40" />
            <div className="size-2.5 rounded-full bg-green-500/40" />
            <span className="ml-2 text-xs text-muted-foreground">
              {mainFile.path || "untitled.tsx"}
            </span>
          </div>
          <pre className="max-h-[400px] overflow-auto p-4">
            <code className="text-xs leading-relaxed">{mainFile.content}</code>
          </pre>
        </div>
        {files.length > 1 && (
          <p className="mt-2 text-xs text-muted-foreground">
            +{files.length - 1} more file(s)
          </p>
        )}
      </CardContent>
    </Card>
  );
}
