import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname } from "node:path";

const REGISTRY_BASE =
  process.env.TRYELEMENTS_REGISTRY || "https://tryelements.dev/r";
const HOOKS_DIR = `${process.env.HOME}/.claude/hooks/elements`;
const SETTINGS_PATH = `${process.env.HOME}/.claude/settings.json`;

export function hooksIndexUrl(): string {
  return `${REGISTRY_BASE}/hooks-index.json`;
}

export function hookScriptUrl(name: string): string {
  return `${REGISTRY_BASE.replace("/r", "")}/hooks/${name}.sh`;
}

export interface HookMeta {
  name: string;
  event: string;
  type: string;
  matcher: string | null;
  platforms: string[];
  tags: string[];
  title: string;
  description: string;
  configurable: Record<string, { prompt: string; required: boolean }>;
  registry: string;
  script: string;
}

export interface HooksIndex {
  generated: string;
  count: number;
  hooks: HookMeta[];
  bundles: Record<string, string[]>;
}

export async function fetchHooksIndex(): Promise<HooksIndex> {
  const res = await fetch(hooksIndexUrl());
  if (!res.ok)
    throw new Error(`Failed to fetch hooks index: ${res.statusText}`);
  return res.json();
}

export async function fetchHookScript(name: string): Promise<string> {
  const res = await fetch(hookScriptUrl(name));
  if (!res.ok) {
    if (res.status === 404) throw new Error(`Hook "${name}" not found`);
    throw new Error(`Failed to fetch hook: ${res.statusText}`);
  }
  return res.text();
}

export function readSettings(): Record<string, unknown> {
  if (!existsSync(SETTINGS_PATH)) return {};
  return JSON.parse(readFileSync(SETTINGS_PATH, "utf-8"));
}

export function writeSettings(settings: Record<string, unknown>): void {
  const dir = dirname(SETTINGS_PATH);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  const backupPath = `${SETTINGS_PATH}.bak`;
  if (existsSync(SETTINGS_PATH) && !existsSync(backupPath)) {
    copyFileSync(SETTINGS_PATH, backupPath);
  }

  writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2) + "\n");
}

export function getHooksDir(): string {
  return HOOKS_DIR;
}

export function getInstalledHooks(): string[] {
  if (!existsSync(HOOKS_DIR)) return [];
  return readdirSync(HOOKS_DIR)
    .filter((f) => f.endsWith(".sh"))
    .map((f) => f.replace(".sh", ""));
}

interface HookEntry {
  matcher?: string;
  hooks: Array<{ type: string; command: string }>;
}

export function registerHook(
  name: string,
  event: string,
  matcher: string | null,
): void {
  const settings = readSettings();
  if (!settings.hooks) settings.hooks = {};
  const hooks = settings.hooks as Record<string, HookEntry[]>;
  if (!hooks[event]) hooks[event] = [];

  const scriptPath = `${HOOKS_DIR}/${name}.sh`;
  const existing = hooks[event].find((e) =>
    e.hooks?.some((h) => h.command?.includes(`/${name}.sh`)),
  );
  if (existing) return;

  const hookEntry: HookEntry = {
    hooks: [{ type: "command", command: scriptPath }],
  };
  if (matcher) hookEntry.matcher = matcher;

  hooks[event].push(hookEntry);
  writeSettings(settings);
}

export function unregisterHook(name: string): void {
  const settings = readSettings();
  if (!settings.hooks) return;

  const hooks = settings.hooks as Record<string, HookEntry[]>;
  for (const event of Object.keys(hooks)) {
    hooks[event] = hooks[event].filter(
      (e) => !e.hooks?.some((h) => h.command?.includes(`/${name}.sh`)),
    );
    if (hooks[event].length === 0) {
      delete hooks[event];
    }
  }

  if (Object.keys(hooks).length === 0) {
    delete settings.hooks;
  }

  writeSettings(settings);
}
