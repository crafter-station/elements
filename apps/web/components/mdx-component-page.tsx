"use client";

import type { ReactNode } from "react";

import { ComponentPageTemplate } from "@/components/component-page-template";

export interface MDXComponentPageProps {
  brandColor: string;
  darkBrandColor?: string;
  category: string;
  name: string;
  description: string;
  icon: ReactNode;
  features: Array<{
    icon: ReactNode;
    title: string;
    description: string;
  }>;
  installCommand: string;
  components?: Record<
    string,
    | ReactNode
    | {
        component: ReactNode;
        colSpan?: 1 | 2 | 3 | 4 | "full";
        className?: string;
        installUrl?: string;
      }
  >;
  componentInstallUrls?: Record<string, string>;
  layout?: {
    type: "auto" | "custom";
    columns?: 1 | 2 | 3 | 4;
    gap?: "sm" | "md" | "lg";
  };
  showRegistryVisualizer?: boolean;
  children?: ReactNode;
}

export function MDXComponentPage(props: MDXComponentPageProps) {
  return (
    <ComponentPageTemplate {...props}>{props.children}</ComponentPageTemplate>
  );
}
