import type { ShadcnRegistryItemJson } from "./types";

interface SandpackFileMap {
  [path: string]: { code: string };
}

const CN_UTILITY = `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;

const GLOBALS_CSS = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 3.9%;
    --primary: 0 0% 9%;
    --primary-foreground: 0 0% 98%;
    --secondary: 0 0% 96.1%;
    --secondary-foreground: 0 0% 9%;
    --muted: 0 0% 96.1%;
    --muted-foreground: 0 0% 45.1%;
    --accent: 0 0% 96.1%;
    --accent-foreground: 0 0% 9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 89.8%;
    --input: 0 0% 89.8%;
    --ring: 0 0% 3.9%;
    --radius: 0.5rem;
  }
  .dark {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
    --card: 0 0% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 0 0% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 0 0% 9%;
    --secondary: 0 0% 14.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 0 0% 14.9%;
    --muted-foreground: 0 0% 63.9%;
    --accent: 0 0% 14.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 14.9%;
    --input: 0 0% 14.9%;
    --ring: 0 0% 83.1%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
`;

function resolveMainComponent(item: ShadcnRegistryItemJson): string | null {
  const mainFile = item.files.find(
    (f) =>
      f.content &&
      (f.type === "registry:component" ||
        f.type === "registry:ui" ||
        f.type === "registry:block"),
  );
  return mainFile?.path || item.files.find((f) => f.content)?.path || null;
}

function extractComponentName(filePath: string): string {
  const fileName = filePath.split("/").pop() || filePath;
  const baseName = fileName.replace(/\.(tsx?|jsx?)$/, "");
  return baseName
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function toSandpackPath(filePath: string): string {
  if (filePath.startsWith("/")) return filePath;
  if (filePath.startsWith("components/") || filePath.startsWith("lib/") || filePath.startsWith("hooks/")) {
    return `/src/${filePath}`;
  }
  return `/src/${filePath}`;
}

export function buildSandpackFiles(item: ShadcnRegistryItemJson): {
  files: SandpackFileMap;
  entry: string;
  dependencies: Record<string, string>;
} {
  const files: SandpackFileMap = {};
  const dependencies: Record<string, string> = {
    react: "^18",
    "react-dom": "^18",
    clsx: "^2",
    "tailwind-merge": "^2",
    "class-variance-authority": "^0.7",
    "lucide-react": "latest",
    "@radix-ui/react-slot": "latest",
  };

  if (item.dependencies) {
    for (const dep of item.dependencies) {
      if (!dependencies[dep]) {
        dependencies[dep] = "latest";
      }
    }
  }

  if (item.devDependencies) {
    for (const dep of item.devDependencies) {
      if (!dependencies[dep]) {
        dependencies[dep] = "latest";
      }
    }
  }

  files["/src/lib/utils.ts"] = { code: CN_UTILITY };
  files["/src/globals.css"] = { code: GLOBALS_CSS };

  for (const file of item.files) {
    if (!file.content) continue;
    const sandpackPath = toSandpackPath(file.path);
    let content = file.content;
    content = content.replace(
      /from\s+["']@\/lib\/utils["']/g,
      'from "/src/lib/utils"',
    );
    content = content.replace(
      /from\s+["']@\/components\//g,
      'from "/src/components/',
    );
    content = content.replace(
      /from\s+["']@\/hooks\//g,
      'from "/src/hooks/',
    );
    files[sandpackPath] = { code: content };
  }

  const mainPath = resolveMainComponent(item);
  const componentName = mainPath
    ? extractComponentName(mainPath)
    : "Component";
  const mainImportPath = mainPath
    ? toSandpackPath(mainPath).replace(/\.(tsx?|jsx?)$/, "")
    : "/src/component";

  files["/src/App.tsx"] = {
    code: `import { ${componentName} } from "${mainImportPath}";
import "./globals.css";

export default function App() {
  return (
    <div className="min-h-screen bg-background p-8">
      <${componentName} />
    </div>
  );
}
`,
  };

  return { files, entry: "/src/App.tsx", dependencies };
}

export function canPreview(item: ShadcnRegistryItemJson): boolean {
  const hasContent = item.files.some((f) => f.content);
  if (!hasContent) return false;

  const hasServerOnly = item.files.some(
    (f) => f.content?.includes("use server") || f.content?.includes("server-only"),
  );
  if (hasServerOnly) return false;

  return true;
}
