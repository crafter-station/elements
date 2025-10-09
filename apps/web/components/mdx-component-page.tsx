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
  // Create dummy technical details since they're required but often repetitive
  const technicalDetails = [
    {
      icon: props.features[0]?.icon || <div className="w-6 h-6" />,
      title: "Production Ready",
      description: `Real ${props.name} integration with proper error handling and loading states`,
    },
    {
      icon: props.features[1]?.icon || <div className="w-6 h-6" />,
      title: "TypeScript",
      description:
        "Fully typed components with comprehensive error handling and validation",
    },
    {
      icon: props.features[2]?.icon || <div className="w-6 h-6" />,
      title: "Copy & Use",
      description:
        "Install once, use immediately - no additional configuration needed",
    },
  ];

  const usageExample = `<span class="text-blue-400">import</span>
<span class="text-foreground"> { ${props.name.replace(/\s+/g, "")}Component } </span>
<span class="text-blue-400">from</span>
<span class="text-green-400"> "@registry/${props.name.toLowerCase().replace(/\s+/g, "-")}"</span>
<br />
<span class="text-gray-500">&lt;${props.name.replace(/\s+/g, "")}Component /&gt;</span>`;

  return (
    <ComponentPageTemplate
      {...props}
      technicalDetails={technicalDetails}
      usageExample={usageExample}
    >
      {props.children}
    </ComponentPageTemplate>
  );
}
