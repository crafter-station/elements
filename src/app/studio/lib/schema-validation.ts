import { z } from "zod";

const registryItemTypes = [
  "registry:lib",
  "registry:block",
  "registry:component",
  "registry:ui",
  "registry:hook",
  "registry:theme",
  "registry:page",
  "registry:file",
  "registry:style",
] as const;

const registryFileTypes = [
  "registry:lib",
  "registry:block",
  "registry:component",
  "registry:ui",
  "registry:hook",
  "registry:page",
  "registry:file",
  "registry:theme",
  "registry:style",
] as const;

export const registryItemFileSchema = z.object({
  path: z.string().min(1, "File path is required"),
  content: z.string().optional(),
  type: z.enum(registryFileTypes),
  target: z.string().optional(),
});

const namePattern = /^[a-z0-9-]+$/;

export const registryItemSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .regex(
        namePattern,
        "Name must be lowercase alphanumeric with hyphens only",
      ),
    type: z.enum(registryItemTypes),
    description: z.string().optional(),
    title: z.string().optional(),
    author: z.string().optional(),
    dependencies: z.array(z.string()).optional(),
    devDependencies: z.array(z.string()).optional(),
    registryDependencies: z.array(z.string()).optional(),
    files: z.array(registryItemFileSchema).min(1, "At least one file required"),
    tailwind: z
      .object({
        config: z
          .object({
            content: z.array(z.string()).optional(),
            theme: z.record(z.string(), z.unknown()).optional(),
            plugins: z.array(z.string()).optional(),
          })
          .optional(),
      })
      .optional(),
    cssVars: z
      .object({
        theme: z.record(z.string(), z.string()).optional(),
        light: z.record(z.string(), z.string()).optional(),
        dark: z.record(z.string(), z.string()).optional(),
      })
      .optional(),
    css: z.record(z.string(), z.unknown()).optional(),
    meta: z.record(z.string(), z.unknown()).optional(),
    docs: z.string().optional(),
    categories: z.array(z.string()).optional(),
    extends: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const filePageTypes = new Set(["registry:file", "registry:page"]);
    data.files.forEach((file, index) => {
      if (filePageTypes.has(file.type) && !file.target) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `File with type '${file.type}' requires a target field`,
          path: ["files", index, "target"],
        });
      }
    });

    if (data.type === "registry:style" && data.extends === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "registry:style items should have an 'extends' field",
        path: ["extends"],
      });
    }
  });

export const registrySchema = z.object({
  $schema: z.string().optional(),
  name: z.string().min(1, "Registry name is required"),
  homepage: z.string().url("Homepage must be a valid URL"),
  items: z.array(registryItemSchema).min(1, "At least one item required"),
});

export interface ValidationError {
  path: string;
  message: string;
}

export interface ValidationWarning {
  path: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

function formatPath(path: PropertyKey[]): string {
  return path
    .map((segment, index) => {
      if (typeof segment === "number") {
        return `[${segment}]`;
      }
      if (typeof segment === "symbol") {
        return `[${String(segment)}]`;
      }
      return index === 0 ? segment : `.${segment}`;
    })
    .join("");
}

function generateWarnings(data: unknown): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  if (typeof data !== "object" || data === null) {
    return warnings;
  }

  const item = data as Record<string, unknown>;

  if (!item.description) {
    warnings.push({
      path: "description",
      message: "Description is recommended for better discoverability",
    });
  }

  if (!item.docs) {
    warnings.push({
      path: "docs",
      message: "Documentation is recommended to help users understand the item",
    });
  }

  if (!item.title) {
    warnings.push({
      path: "title",
      message: "Title is recommended for better UI display",
    });
  }

  if (Array.isArray(item.categories) && item.categories.length === 0) {
    warnings.push({
      path: "categories",
      message: "Empty categories array - consider adding at least one category",
    });
  }

  if (item.type === "registry:file" || item.type === "registry:page") {
    if (Array.isArray(item.files)) {
      item.files.forEach((file, index) => {
        if (
          typeof file === "object" &&
          file !== null &&
          !("target" in file && file.target)
        ) {
          warnings.push({
            path: `files[${index}].target`,
            message: `File with type '${item.type}' should have a target field`,
          });
        }
      });
    }
  }

  return warnings;
}

export function validateRegistryItem(data: unknown): ValidationResult {
  const result = registryItemSchema.safeParse(data);

  if (result.success) {
    return {
      valid: true,
      errors: [],
      warnings: generateWarnings(data),
    };
  }

  const errors: ValidationError[] = result.error.issues.map((err) => ({
    path: formatPath(err.path),
    message: err.message,
  }));

  return {
    valid: false,
    errors,
    warnings: generateWarnings(data),
  };
}

export function validateRegistry(data: unknown): ValidationResult {
  const result = registrySchema.safeParse(data);

  if (result.success) {
    const warnings: ValidationWarning[] = [];

    if (Array.isArray(result.data.items)) {
      result.data.items.forEach((item, index) => {
        const itemWarnings = generateWarnings(item);
        itemWarnings.forEach((warning) => {
          warnings.push({
            path: `items[${index}].${warning.path}`,
            message: warning.message,
          });
        });
      });
    }

    return {
      valid: true,
      errors: [],
      warnings,
    };
  }

  const errors: ValidationError[] = result.error.issues.map((err) => ({
    path: formatPath(err.path),
    message: err.message,
  }));

  return {
    valid: false,
    errors,
    warnings: [],
  };
}
