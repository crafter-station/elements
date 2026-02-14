import type {
  ShadcnRegistryJson,
  ShadcnRegistryItemJson,
} from "@/lib/studio/types";

export interface QualityCheck {
  name: string;
  passed: boolean;
  points: number;
  description: string;
}

export interface QualityBreakdown {
  score: number;
  checks: QualityCheck[];
}

export function scoreRegistryItem(
  item: ShadcnRegistryItemJson,
): QualityBreakdown {
  const checks: QualityCheck[] = [];

  checks.push({
    name: "Has description",
    passed: Boolean(item.description && item.description.length > 0),
    points: 15,
    description: "Item has a meaningful description",
  });

  checks.push({
    name: "Has documentation",
    passed: Boolean(item.docs && item.docs.length > 0),
    points: 20,
    description: "Item has documentation link or content",
  });

  checks.push({
    name: "Has title",
    passed: Boolean(item.title && item.title.length > 0),
    points: 10,
    description: "Item has a display title",
  });

  checks.push({
    name: "Has categories",
    passed: Boolean(item.categories && item.categories.length > 0),
    points: 10,
    description: "Item is categorized for discoverability",
  });

  checks.push({
    name: "Has files",
    passed: item.files.length > 0,
    points: 20,
    description: "Item contains at least one file",
  });

  const hasDependencies =
    (item.dependencies && item.dependencies.length > 0) ||
    (item.registryDependencies && item.registryDependencies.length > 0) ||
    (item.devDependencies && item.devDependencies.length > 0);

  checks.push({
    name: "Dependencies declared",
    passed: hasDependencies,
    points: 10,
    description: "Item has dependencies properly declared",
  });

  const hasProperNaming = /^[a-z0-9][a-z0-9-]*$/.test(item.name);

  checks.push({
    name: "Proper naming",
    passed: hasProperNaming,
    points: 15,
    description: "Item name follows kebab-case convention",
  });

  const score = checks.reduce(
    (sum, check) => sum + (check.passed ? check.points : 0),
    0,
  );

  return { score, checks };
}

export function scoreRegistry(registry: ShadcnRegistryJson): {
  averageScore: number;
  items: Array<{ name: string; score: number }>;
} {
  if (registry.items.length === 0) {
    return { averageScore: 0, items: [] };
  }

  const itemScores = registry.items.map((item) => {
    const breakdown = scoreRegistryItem(item);
    return { name: item.name, score: breakdown.score };
  });

  const averageScore = Math.round(
    itemScores.reduce((sum, item) => sum + item.score, 0) / itemScores.length,
  );

  return { averageScore, items: itemScores };
}
