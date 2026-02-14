"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RegistryItemType } from "@/lib/studio/types";

interface ValidationItem {
  name: string;
  type: string;
  title: string | null;
  description: string | null;
  docs: string | null;
  dependencies: string[];
  registryDependencies: string[];
  categories: string[];
  files: Array<{ path: string; content: string }>;
}

interface ValidationCheck {
  label: string;
  status: "pass" | "warn" | "fail";
  message: string;
}

function validateItem(item: ValidationItem): ValidationCheck[] {
  const checks: ValidationCheck[] = [];

  checks.push(
    item.name && /^[a-z0-9][a-z0-9-]*$/.test(item.name)
      ? { label: "Name", status: "pass", message: "Valid kebab-case name" }
      : {
          label: "Name",
          status: "fail",
          message: item.name
            ? "Must be lowercase kebab-case (a-z, 0-9, hyphens)"
            : "Name is required",
        },
  );

  checks.push(
    item.type
      ? { label: "Type", status: "pass", message: `Type: ${item.type}` }
      : { label: "Type", status: "fail", message: "Type is required" },
  );

  checks.push(
    item.files.length > 0
      ? {
          label: "Files",
          status: "pass",
          message: `${item.files.length} file(s)`,
        }
      : {
          label: "Files",
          status: "fail",
          message: "At least one file required",
        },
  );

  const hasEmptyPaths = item.files.some((f) => !f.path);
  if (hasEmptyPaths) {
    checks.push({
      label: "File Paths",
      status: "fail",
      message: "All files need a path",
    });
  }

  const hasEmptyContent = item.files.some((f) => !f.content.trim());
  if (hasEmptyContent) {
    checks.push({
      label: "File Content",
      status: "warn",
      message: "Some files have empty content",
    });
  }

  checks.push(
    item.title
      ? { label: "Title", status: "pass", message: "Has title" }
      : { label: "Title", status: "warn", message: "No title (recommended)" },
  );

  checks.push(
    item.description
      ? { label: "Description", status: "pass", message: "Has description" }
      : {
          label: "Description",
          status: "warn",
          message: "No description (recommended)",
        },
  );

  checks.push(
    item.docs
      ? { label: "Docs", status: "pass", message: "Has documentation" }
      : {
          label: "Docs",
          status: "warn",
          message: "No docs (recommended for quality)",
        },
  );

  checks.push(
    item.categories.length > 0
      ? {
          label: "Categories",
          status: "pass",
          message: `${item.categories.length} categor${item.categories.length === 1 ? "y" : "ies"}`,
        }
      : {
          label: "Categories",
          status: "warn",
          message: "No categories (improves discoverability)",
        },
  );

  return checks;
}

const STATUS_ICONS = {
  pass: CheckCircle,
  warn: AlertTriangle,
  fail: XCircle,
};

const STATUS_COLORS = {
  pass: "text-green-500",
  warn: "text-yellow-500",
  fail: "text-red-500",
};

interface SchemaValidatorProps {
  item: ValidationItem | null;
}

export function SchemaValidator({ item }: SchemaValidatorProps) {
  const checks = useMemo(() => {
    if (!item) return [];
    return validateItem(item);
  }, [item]);

  if (!item) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Validation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Select an item to see validation results
          </p>
        </CardContent>
      </Card>
    );
  }

  const passCount = checks.filter((c) => c.status === "pass").length;
  const warnCount = checks.filter((c) => c.status === "warn").length;
  const failCount = checks.filter((c) => c.status === "fail").length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Validation</CardTitle>
        <div className="flex items-center gap-2">
          {failCount > 0 && (
            <Badge variant="destructive">{failCount} error(s)</Badge>
          )}
          {warnCount > 0 && (
            <Badge
              variant="outline"
              className="border-yellow-500 text-yellow-500"
            >
              {warnCount} warning(s)
            </Badge>
          )}
          {failCount === 0 && warnCount === 0 && (
            <Badge
              variant="outline"
              className="border-green-500 text-green-500"
            >
              All checks passed
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1.5">
          {checks.map((check) => {
            const Icon = STATUS_ICONS[check.status];
            return (
              <div
                key={check.label}
                className="flex items-center gap-2 text-sm"
              >
                <Icon
                  className={cn("size-4 shrink-0", STATUS_COLORS[check.status])}
                />
                <span className="font-medium">{check.label}</span>
                <span className="text-muted-foreground">{check.message}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
