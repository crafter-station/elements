import { Children, isValidElement } from "react";

import type { MDXComponents } from "mdx/types";

import { ComponentPreview } from "@/components/component-preview";
import { ComponentPreviewItem } from "@/components/component-preview-item";
import { ClerkSignInPreview } from "@/components/elements/clerk-sign-in-preview";
import { ClerkSignUpPreview } from "@/components/elements/clerk-sign-up-preview";
import { ClerkWaitlistPreview } from "@/components/elements/clerk-waitlist-preview";
import { SponsorTiersPreview } from "@/components/elements/polar-sponsor-tiers-preview";
import { ThemeSwitcher } from "@/components/elements/theme-switcher";
import { ThemeSwitcherButton } from "@/components/elements/theme-switcher-button";
import { ThemeSwitcherDropdown } from "@/components/elements/theme-switcher-dropdown";
import { ThemeSwitcherMultiButton } from "@/components/elements/theme-switcher-multi-button";
import { ThemeSwitcherSwitch } from "@/components/elements/theme-switcher-switch";
import { ThemeSwitcherToggle } from "@/components/elements/theme-switcher-toggle";
import { TintePreview } from "@/components/elements/tinte-preview";
import { UploadButtonPreview } from "@/components/elements/uploadthing-button-preview";
import { UploadDropzonePreview } from "@/components/elements/uploadthing-dropzone-preview";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ComponentPreview,
    ComponentPreviewItem,
    ThemeSwitcher,
    ThemeSwitcherSwitch,
    ThemeSwitcherButton,
    ThemeSwitcherDropdown,
    ThemeSwitcherToggle,
    ThemeSwitcherMultiButton,
    ClerkSignInPreview,
    ClerkSignUpPreview,
    ClerkWaitlistPreview,
    SponsorTiersPreview,
    TintePreview,
    UploadButtonPreview,
    UploadDropzonePreview,
    pre: ({ children, ...props }: any) => {
      const isShikiBlock = props.className?.includes("shiki") || props.style;

      if (isShikiBlock) {
        return (
          <div className="my-4 max-w-full overflow-hidden rounded-lg border border-border">
            <pre
              {...props}
              className={`${props.className || ""} p-4 overflow-x-auto leading-relaxed`}
              style={{ ...props.style, fontSize: "13px" }}
            >
              {children}
            </pre>
          </div>
        );
      }

      return (
        <div className="my-4 max-w-full overflow-hidden">
          <pre
            className="min-w-full w-max bg-muted p-4 rounded-lg overflow-x-auto border border-border text-sm"
            {...props}
          >
            {children}
          </pre>
        </div>
      );
    },
    code: ({ className, children, ...props }: any) => {
      const childArray = Children.toArray(children);
      const hasReactElements = childArray.some((child) =>
        isValidElement(child),
      );

      if (hasReactElements || className || props.style) {
        return (
          <code className={className} {...props}>
            {children}
          </code>
        );
      }

      // Otherwise, it's inline code - apply custom styling
      return (
        <code
          className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono border border-border"
          {...props}
        >
          {children}
        </code>
      );
    },
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold mt-8 mb-4 first:mt-0">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-semibold mt-8 mb-4 border-b border-border pb-2">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold mt-6 mb-3">{children}</h3>
    ),
    p: ({ children }) => <p className="text-base leading-7 mb-4">{children}</p>,
    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline hover:text-primary/80 transition-colors"
      >
        {children}
      </a>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside space-y-2 mb-4">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside space-y-2 mb-4">{children}</ol>
    ),
    li: ({ children }) => <li className="text-base leading-7">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary/30 pl-4 my-4 italic text-muted-foreground">
        {children}
      </blockquote>
    ),
    table: ({ children }) => (
      <div className="my-6 w-full overflow-x-auto">
        <table className="w-full border-collapse border border-border">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => <thead className="bg-muted/50">{children}</thead>,
    tbody: ({ children }) => <tbody>{children}</tbody>,
    tr: ({ children }) => (
      <tr className="border-b border-border hover:bg-muted/30 transition-colors">
        {children}
      </tr>
    ),
    th: ({ children }) => (
      <th className="px-4 py-3 text-left font-semibold text-sm border-r border-border last:border-r-0">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-3 text-sm border-r border-border last:border-r-0">
        {children}
      </td>
    ),
    ...components,
  };
}

export const useMDXComponents = getMDXComponents;
