const REGISTRY_BASE =
  process.env.TRYELEMENTS_REGISTRY || "https://tryelements.dev/r";

export function normalizeName(input: string): string {
  const name = input.toLowerCase().trim();
  return name.endsWith("-logo") ? name : `${name}-logo`;
}

export function svgUrl(logoName: string): string {
  return `${REGISTRY_BASE}/svg/${normalizeName(logoName)}.svg`;
}

export function logosIndexUrl(): string {
  return `${REGISTRY_BASE}/logos-index.json`;
}

export async function fetchSvg(logoName: string): Promise<string> {
  const url = svgUrl(logoName);
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(`Logo "${logoName}" not found in registry`);
    }
    throw new Error(`Failed to fetch ${logoName}: ${res.statusText}`);
  }
  return res.text();
}

export async function fetchLogosList(): Promise<string[]> {
  const res = await fetch(logosIndexUrl());
  if (!res.ok) {
    throw new Error(`Failed to fetch logos list: ${res.statusText}`);
  }
  return res.json();
}
