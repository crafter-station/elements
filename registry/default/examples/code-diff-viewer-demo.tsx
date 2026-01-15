"use client";

import { CodeDiffViewer } from "@/registry/default/blocks/devtools/code-diff-viewer/components/elements/code-diff-viewer";

const oldCode = `function greet(name) {
  console.log("Hello, " + name);
}`;

const newCode = `function greet(name: string) {
  console.log(\`Hello, \${name}!\`);
  return name;
}`;

export default function CodeDiffViewerDemo() {
  return (
    <div className="w-full max-w-2xl p-4">
      <CodeDiffViewer
        oldCode={oldCode}
        newCode={newCode}
        language="typescript"
        mode="unified"
      />
    </div>
  );
}
