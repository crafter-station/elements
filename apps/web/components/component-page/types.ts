import type { ReactNode } from "react";

export interface Feature {
  icon: ReactNode;
  title: string;
  description: string;
}

export interface ComponentWithLayout {
  component: ReactNode;
  colSpan?: 1 | 2 | 3 | 4 | "full";
  className?: string;
  installUrl?: string;
}

export interface Layout {
  type: "auto" | "custom";
  columns?: 1 | 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
}

export interface RegistryItem {
  name: string;
  files?: unknown[];
  [key: string]: unknown;
}
