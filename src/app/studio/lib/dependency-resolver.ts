import { extractImports } from "./code-parser";

const SHADCN_COMPONENTS = new Set([
  "accordion",
  "alert",
  "alert-dialog",
  "aspect-ratio",
  "avatar",
  "badge",
  "breadcrumb",
  "button",
  "calendar",
  "card",
  "carousel",
  "chart",
  "checkbox",
  "collapsible",
  "command",
  "context-menu",
  "dialog",
  "drawer",
  "dropdown-menu",
  "form",
  "hover-card",
  "input",
  "input-otp",
  "label",
  "menubar",
  "navigation-menu",
  "pagination",
  "popover",
  "progress",
  "radio-group",
  "resizable",
  "scroll-area",
  "select",
  "separator",
  "sheet",
  "sidebar",
  "skeleton",
  "slider",
  "sonner",
  "switch",
  "table",
  "tabs",
  "textarea",
  "toast",
  "toggle",
  "toggle-group",
  "tooltip",
]);

const RELATIVE_PATH_PREFIXES = [".", "/", "@/", "~/"];

export interface ResolvedDependencies {
  npmDependencies: string[];
  registryDependencies: string[];
  localImports: string[];
}

export function resolveImports(code: string): ResolvedDependencies {
  const imports = extractImports(code);
  const npmDeps = new Set<string>();
  const registryDeps = new Set<string>();
  const localImports: string[] = [];

  for (const imp of imports) {
    if (RELATIVE_PATH_PREFIXES.some((p) => imp.startsWith(p))) {
      const uiMatch = imp.match(/(?:@\/|~\/)?components\/ui\/([a-z-]+)/);
      if (uiMatch) {
        const componentName = uiMatch[1];
        if (SHADCN_COMPONENTS.has(componentName)) {
          registryDeps.add(componentName);
        }
      }

      const hookMatch = imp.match(/(?:@\/|~\/)?hooks\/([a-z-]+)/);
      if (hookMatch) {
        registryDeps.add(hookMatch[1]);
      }

      const libMatch = imp.match(/(?:@\/|~\/)?lib\/([a-z-]+)/);
      if (libMatch) {
        registryDeps.add(libMatch[1]);
      }

      localImports.push(imp);
    } else {
      const pkgName = imp.startsWith("@")
        ? imp.split("/").slice(0, 2).join("/")
        : imp.split("/")[0];

      if (pkgName === "react" || pkgName === "react-dom") continue;
      if (pkgName === "next" || pkgName.startsWith("next/")) continue;

      npmDeps.add(pkgName);
    }
  }

  return {
    npmDependencies: Array.from(npmDeps).sort(),
    registryDependencies: Array.from(registryDeps).sort(),
    localImports,
  };
}

export function suggestComponentName(code: string, fileName?: string): string {
  if (fileName) {
    const base = fileName.replace(/\.(tsx?|jsx?)$/, "").replace(/\/index$/, "");
    const name = base.split("/").pop() || base;
    return toKebabCase(name);
  }

  const exportMatch = code.match(/export\s+(?:default\s+)?function\s+(\w+)/);
  if (exportMatch) {
    return toKebabCase(exportMatch[1]);
  }

  const constMatch = code.match(/export\s+const\s+(\w+)\s*[=:]/);
  if (constMatch) {
    return toKebabCase(constMatch[1]);
  }

  return "untitled";
}

function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[_\s]+/g, "-")
    .toLowerCase();
}
