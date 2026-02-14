import type { RegistryItemType, RegistryFileType } from "./types";

interface InferredItem {
  name: string;
  type: RegistryItemType;
  fileType: RegistryFileType;
  filePath: string;
  dependencies: string[];
  devDependencies: string[];
  registryDependencies: string[];
  description: string | null;
}

const KNOWN_NPM_PACKAGES = new Set([
  "react", "react-dom", "next", "zod", "zustand", "framer-motion",
  "class-variance-authority", "clsx", "tailwind-merge", "cmdk",
  "date-fns", "dayjs", "lodash", "axios", "swr", "sonner",
  "lucide-react", "recharts", "embla-carousel-react",
  "@radix-ui/react-slot", "@radix-ui/react-dialog",
  "@radix-ui/react-dropdown-menu", "@radix-ui/react-popover",
  "@radix-ui/react-select", "@radix-ui/react-tabs",
  "@radix-ui/react-tooltip", "@radix-ui/react-accordion",
  "@radix-ui/react-checkbox", "@radix-ui/react-switch",
  "@radix-ui/react-label", "@radix-ui/react-scroll-area",
  "@radix-ui/react-separator", "@radix-ui/react-toggle",
  "@radix-ui/react-collapsible", "@radix-ui/react-context-menu",
  "@radix-ui/react-alert-dialog", "@radix-ui/react-avatar",
  "@radix-ui/react-hover-card", "@radix-ui/react-menubar",
  "@radix-ui/react-navigation-menu", "@radix-ui/react-progress",
  "@radix-ui/react-radio-group", "@radix-ui/react-slider",
  "@radix-ui/react-toast",
  "input-otp", "react-day-picker", "react-hook-form",
  "@hookform/resolvers", "vaul", "next-themes",
]);

const SHADCN_COMPONENTS = new Set([
  "button", "card", "input", "label", "textarea", "select",
  "dialog", "dropdown-menu", "popover", "tabs", "tooltip",
  "accordion", "alert", "avatar", "badge", "checkbox",
  "collapsible", "command", "context-menu", "scroll-area",
  "separator", "sheet", "skeleton", "slider", "switch",
  "table", "toggle", "sonner", "carousel",
]);

export function inferFromCode(code: string, filename?: string): InferredItem {
  const name = inferName(code, filename);
  const type = inferItemType(code, filename);
  const fileType = inferFileType(type);
  const filePath = inferFilePath(name, type, filename);
  const dependencies = inferDependencies(code);
  const registryDependencies = inferRegistryDependencies(code);
  const description = inferDescription(code);

  return {
    name,
    type,
    fileType,
    filePath,
    dependencies,
    devDependencies: [],
    registryDependencies,
    description,
  };
}

function inferName(code: string, filename?: string): string {
  if (filename) {
    const base = filename.replace(/\.(tsx?|jsx?)$/, "");
    return toKebabCase(base);
  }

  const defaultExport = code.match(
    /export\s+default\s+function\s+(\w+)/
  );
  if (defaultExport) return toKebabCase(defaultExport[1]);

  const namedExport = code.match(
    /export\s+(?:const|function)\s+(\w+)/
  );
  if (namedExport) return toKebabCase(namedExport[1]);

  const componentAssign = code.match(
    /(?:const|let)\s+(\w+)\s*=\s*(?:React\.)?(?:forwardRef|memo)\s*[(<]/
  );
  if (componentAssign) return toKebabCase(componentAssign[1]);

  return "untitled";
}

function inferItemType(code: string, filename?: string): RegistryItemType {
  if (filename) {
    if (filename.match(/^use[A-Z]/)) return "registry:hook";
    if (filename === "page.tsx" || filename === "page.jsx") return "registry:page";
    if (filename === "layout.tsx" || filename === "layout.jsx") return "registry:page";
  }

  const isHook = /^(?:export\s+)?(?:function|const)\s+use[A-Z]/.test(code) ||
    /export\s+default\s+function\s+use[A-Z]/.test(code);
  if (isHook) return "registry:hook";

  const hasJSX = /<[A-Z][a-zA-Z]*[\s/>]/.test(code) || /return\s*\(?\s*</.test(code);
  const hasMultipleComponents = (code.match(/export\s+(?:function|const)\s+[A-Z]/g) || []).length > 2;

  if (hasJSX && hasMultipleComponents) return "registry:block";

  const isUIPrimitive = /forwardRef/.test(code) &&
    /displayName/.test(code) &&
    /cva|class-variance-authority|variants/.test(code);
  if (isUIPrimitive) return "registry:ui";

  if (hasJSX) return "registry:component";

  const isUtility = !hasJSX && (
    /export\s+(function|const|class)/.test(code) ||
    /export\s+default/.test(code)
  );
  if (isUtility) return "registry:lib";

  return "registry:component";
}

function inferFileType(itemType: RegistryItemType): RegistryFileType {
  const mapping: Record<string, RegistryFileType> = {
    "registry:lib": "registry:lib",
    "registry:block": "registry:block",
    "registry:component": "registry:component",
    "registry:ui": "registry:ui",
    "registry:hook": "registry:hook",
    "registry:page": "registry:page",
    "registry:file": "registry:file",
  };
  return mapping[itemType] || "registry:component";
}

function inferFilePath(name: string, type: RegistryItemType, filename?: string): string {
  if (filename) return filename;

  const pathMap: Partial<Record<RegistryItemType, string>> = {
    "registry:ui": `components/ui/${name}.tsx`,
    "registry:component": `components/${name}.tsx`,
    "registry:block": `components/${name}.tsx`,
    "registry:hook": `hooks/${name}.ts`,
    "registry:lib": `lib/${name}.ts`,
    "registry:page": `app/${name}/page.tsx`,
  };

  return pathMap[type] || `${name}.tsx`;
}

function inferDependencies(code: string): string[] {
  const deps = new Set<string>();
  const importRegex = /(?:import|from)\s+['"]([^'"./][^'"]*)['"]/g;
  let match: RegExpExecArray | null;

  while ((match = importRegex.exec(code)) !== null) {
    const pkg = match[1];
    if (pkg.startsWith("@/") || pkg.startsWith("~/")) continue;

    const resolved = pkg.startsWith("@")
      ? pkg.split("/").slice(0, 2).join("/")
      : pkg.split("/")[0];

    if (KNOWN_NPM_PACKAGES.has(resolved) && resolved !== "react" && resolved !== "react-dom" && resolved !== "next") {
      deps.add(resolved);
    }
  }

  if (/\bcn\s*\(/.test(code) && !deps.has("clsx")) {
    deps.add("clsx");
    deps.add("tailwind-merge");
  }

  if (/\bcva\s*\(/.test(code) && !deps.has("class-variance-authority")) {
    deps.add("class-variance-authority");
  }

  return [...deps].sort();
}

function inferRegistryDependencies(code: string): string[] {
  const deps = new Set<string>();
  const shadcnImportRegex = /from\s+['"]@\/components\/ui\/([^'"]+)['"]/g;
  let match: RegExpExecArray | null;

  while ((match = shadcnImportRegex.exec(code)) !== null) {
    const component = match[1].replace(/\.(tsx?|jsx?)$/, "");
    if (SHADCN_COMPONENTS.has(component)) {
      deps.add(component);
    }
  }

  const utilImportRegex = /from\s+['"]@\/lib\/([^'"]+)['"]/g;
  while ((match = utilImportRegex.exec(code)) !== null) {
    const util = match[1].replace(/\.(tsx?|jsx?)$/, "");
    if (util === "utils") deps.add("utils");
  }

  return [...deps].sort();
}

function inferDescription(code: string): string | null {
  const jsdoc = code.match(/\/\*\*\s*\n\s*\*\s*(.+?)(?:\n|\*\/)/);
  if (jsdoc) return jsdoc[1].trim();

  const lineComment = code.match(/^\/\/\s*(.+)/m);
  if (lineComment && lineComment.index !== undefined && lineComment.index < 100) {
    return lineComment[1].trim();
  }

  return null;
}

function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

export function inferFromFilename(filename: string): {
  name: string;
  type: RegistryItemType;
  fileType: RegistryFileType;
  filePath: string;
} {
  const name = toKebabCase(filename.replace(/\.(tsx?|jsx?|css)$/, ""));
  const type = inferItemType("", filename);
  const fileType = inferFileType(type);
  const filePath = inferFilePath(name, type, filename);

  return { name, type, fileType, filePath };
}
