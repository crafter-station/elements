"use client";

import { useMemo } from "react";
import {
  SandpackProvider,
  SandpackPreview,
} from "@codesandbox/sandpack-react";
import { buildSandpackFiles } from "@/lib/studio/sandpack-setup";
import type { ShadcnRegistryItemJson } from "@/lib/studio/types";

interface SandpackPreviewPanelProps {
  item: ShadcnRegistryItemJson;
}

export function SandpackPreviewPanel({ item }: SandpackPreviewPanelProps) {
  const { files, dependencies } = useMemo(
    () => buildSandpackFiles(item),
    [item],
  );

  return (
    <SandpackProvider
      template="react-ts"
      files={files}
      customSetup={{ dependencies }}
      options={{
        externalResources: ["https://cdn.tailwindcss.com"],
      }}
    >
      <SandpackPreview
        showOpenInCodeSandbox={false}
        showRefreshButton
        style={{ height: "100%" }}
      />
    </SandpackProvider>
  );
}
