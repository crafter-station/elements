import type { RegistryItemType } from "./types";

export interface ParsedComponent {
  name: string;
  type: RegistryItemType;
}

export interface ParsedRegistry {
  name: string;
  description: string;
  components: ParsedComponent[];
}

const HOOK_PATTERN = /^use[A-Z]/;
const TYPE_HINTS: Array<{ pattern: RegExp; type: RegistryItemType }> = [
  { pattern: /^use-/, type: "registry:hook" },
  { pattern: HOOK_PATTERN, type: "registry:hook" },
  { pattern: /\b(page|layout|view)\b/i, type: "registry:page" },
  { pattern: /\b(block|section|hero|footer|header|sidebar|navbar)\b/i, type: "registry:block" },
  { pattern: /\b(util|helper|lib|cn|format|parse)\b/i, type: "registry:lib" },
  { pattern: /\b(theme|colors?|palette)\b/i, type: "registry:theme" },
  { pattern: /\b(button|input|select|checkbox|switch|label|badge|avatar|separator|skeleton|slider|toggle|tooltip|scroll-area|textarea|table|tabs|accordion|alert|card|dialog|dropdown|popover|sheet|command|context-menu|carousel)\b/i, type: "registry:ui" },
];

export function parseDescription(text: string): ParsedRegistry {
  const components = extractComponents(text);
  const name = inferRegistryName(text, components);
  const description = inferDescription(text, components);

  return { name, description, components };
}

function extractComponents(text: string): ParsedComponent[] {
  const components: ParsedComponent[] = [];
  const seen = new Set<string>();

  const kebabPattern = /\b([a-z][a-z0-9]*(?:-[a-z0-9]+)+)\b/g;
  let match: RegExpExecArray | null;
  while ((match = kebabPattern.exec(text)) !== null) {
    const name = match[1];
    if (!seen.has(name) && !isStopWord(name)) {
      seen.add(name);
      components.push({ name, type: inferType(name) });
    }
  }

  const camelPattern = /\b([A-Z][a-z]+(?:[A-Z][a-z]+)+)\b/g;
  while ((match = camelPattern.exec(text)) !== null) {
    const name = toKebab(match[1]);
    if (!seen.has(name) && !isStopWord(name)) {
      seen.add(name);
      components.push({ name, type: inferType(name) });
    }
  }

  const commaList = text.match(/[:,]\s*([^.]+)/);
  if (commaList && components.length === 0) {
    const parts = commaList[1].split(/[,\n]+/);
    for (const part of parts) {
      const cleaned = part.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      if (cleaned.length > 1 && !seen.has(cleaned) && !isStopWord(cleaned)) {
        seen.add(cleaned);
        components.push({ name: cleaned, type: inferType(cleaned) });
      }
    }
  }

  const singleWords = text.match(/\b(button|input|select|dialog|toast|table|card|badge|avatar|tabs|accordion|alert|checkbox|switch|slider|tooltip|popover|sheet|form|modal|sidebar|navbar|footer|header|hero)\b/gi);
  if (singleWords) {
    for (const word of singleWords) {
      const name = word.toLowerCase();
      if (!seen.has(name)) {
        seen.add(name);
        components.push({ name, type: inferType(name) });
      }
    }
  }

  return components;
}

function inferType(name: string): RegistryItemType {
  for (const hint of TYPE_HINTS) {
    if (hint.pattern.test(name)) {
      return hint.type;
    }
  }
  return "registry:component";
}

function inferRegistryName(text: string, components: ParsedComponent[]): string {
  const firstLine = text.split(/[.\n]/)[0].trim();

  const named = firstLine.match(/(?:called|named|for)\s+["']?([a-zA-Z][a-zA-Z0-9 -]+)["']?/i);
  if (named) {
    return toKebab(named[1].trim());
  }

  const category = firstLine.match(/\b(form|chart|auth|e-?commerce|dashboard|marketing|landing|admin|blog|data|ui|design)\s*(components?|kit|system|library|set)?/i);
  if (category) {
    const base = category[1].toLowerCase().replace(/\s+/g, "-");
    const suffix = category[2] ? `-${category[2].toLowerCase().replace(/s$/, "")}` : "-kit";
    return `${base}${suffix}`;
  }

  if (components.length > 0) {
    const prefix = findCommonPrefix(components.map((c) => c.name));
    if (prefix.length > 2) return `${prefix}-kit`;
  }

  return "my-registry";
}

function inferDescription(text: string, components: ParsedComponent[]): string {
  const firstSentence = text.split(/[.\n]/)[0].trim();

  if (firstSentence.length > 10 && firstSentence.length < 200) {
    const cleaned = firstSentence
      .replace(/[:,]\s*[a-z-]+(?:,\s*[a-z-]+)*\s*$/i, "")
      .trim();
    if (cleaned.length > 10) return cleaned;
  }

  if (components.length > 0) {
    return `A shadcn registry with ${components.length} component${components.length > 1 ? "s" : ""}`;
  }

  return "A shadcn/ui component registry";
}

function isStopWord(word: string): boolean {
  const stops = new Set([
    "my-app", "my-project", "the-app", "for-my", "and-more",
    "use-it", "set-up", "check-out", "sign-in", "sign-up",
    "log-in", "log-out", "opt-in", "opt-out",
  ]);
  return stops.has(word) || word.length < 2;
}

function toKebab(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function findCommonPrefix(names: string[]): string {
  if (names.length < 2) return "";
  const parts = names.map((n) => n.split("-"));
  const prefix: string[] = [];
  for (let i = 0; i < parts[0].length; i++) {
    if (parts.every((p) => p[i] === parts[0][i])) {
      prefix.push(parts[0][i]);
    } else {
      break;
    }
  }
  return prefix.join("-");
}
