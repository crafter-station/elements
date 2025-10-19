import { Children, isValidElement } from "react";

// Import from @elements packages
import {
  SignInShadcn,
  SignInSignals,
  SignUpShadcn,
  SignUpSignals,
  WaitlistShadcn,
} from "@elements/clerk";
import { SponsorTiersPreview } from "@elements/polar";
import {
  ThemeSwitcher,
  ThemeSwitcherButton,
  ThemeSwitcherDropdown,
  ThemeSwitcherMultiButton,
  ThemeSwitcherSwitch,
  ThemeSwitcherToggle,
} from "@elements/theme";
import { TinteEditor } from "@elements/tinte";
import {
  UploadButtonPreview,
  UploadDropzonePreview,
} from "@elements/uploadthing";
import type { MDXComponents } from "mdx/types";

import { ComponentPreview } from "@/components/component-preview";
import { ComponentPreviewItem } from "@/components/component-preview-item";
import { CodeBlockCopyButton } from "@/components/ui/code-block-copy-button";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ComponentPreview,
    ComponentPreviewItem,
    // Clerk Components
    SignInShadcn,
    SignInSignals,
    SignUpShadcn,
    SignUpSignals,
    WaitlistShadcn,
    // Polar Components
    SponsorTiersPreview,
    // Theme Components
    ThemeSwitcher,
    ThemeSwitcherButton,
    ThemeSwitcherDropdown,
    ThemeSwitcherMultiButton,
    ThemeSwitcherSwitch,
    ThemeSwitcherToggle,
    // Tinte Components
    TinteEditor,
    // UploadThing Components
    UploadButtonPreview,
    UploadDropzonePreview,
    pre: ({ children, ...props }: any) => {
      const isShikiBlock = props.className?.includes("shiki") || props.style;

      // Extract raw code from children for copy functionality
      const extractCode = (node: any): string => {
        if (typeof node === "string") return node;
        if (Array.isArray(node)) return node.map(extractCode).join("");
        if (node?.props?.children) return extractCode(node.props.children);
        return "";
      };

      const rawCode = extractCode(children);

      if (isShikiBlock) {
        return (
          <div className="my-6 max-w-full overflow-hidden rounded-lg border border-border relative group bg-muted/30">
            <CodeBlockCopyButton code={rawCode} />
            <pre
              {...props}
              className={`${props.className || ""} p-4 overflow-x-auto leading-relaxed`}
              style={{
                ...props.style,
                fontSize: "13px",
                backgroundColor: "transparent",
              }}
            >
              {children}
            </pre>
          </div>
        );
      }

      return (
        <div className="my-6 max-w-full overflow-hidden relative group">
          <CodeBlockCopyButton code={rawCode} />
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
          className="bg-muted/50 px-1.5 py-0.5 rounded text-xs font-mono border border-border/50"
          {...props}
        >
          {children}
        </code>
      );
    },
    h1: ({ children }) => (
      <h1 className="scroll-mt-16 text-3xl font-medium tracking-tight first:mt-0 mt-12 mb-6">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="scroll-mt-16 text-2xl font-medium tracking-tight mt-12 mb-6 pb-3 border-b border-border/60">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="scroll-mt-16 text-lg font-medium tracking-tight mt-8 mb-4">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="text-muted-foreground text-base leading-7 mb-6 text-pretty">
        {children}
      </p>
    ),
    a: ({ href, children }) => {
      const isExternal = href?.startsWith("http");
      return (
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="decoration-underline relative inline-flex items-baseline gap-1 underline decoration-[0.09375rem] underline-offset-2 hover:text-primary transition-colors"
        >
          {children}
          {isExternal && (
            <svg
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
              className="text-muted-foreground inline-block h-[0.85lh] w-4 shrink-0"
              aria-hidden="true"
              fill="none"
            >
              <path
                d="M7 17L17 7M17 7H7M17 7V17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </a>
      );
    },
    ul: ({ children }) => (
      <ul className="list-disc list-outside ml-6 space-y-2 mb-6 text-muted-foreground">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-outside ml-6 space-y-2 mb-6 text-muted-foreground">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="leading-7 pl-1">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-[3px] border-muted-foreground/30 pl-6 my-6 italic text-muted-foreground">
        {children}
      </blockquote>
    ),
    table: ({ children }) => (
      <div className="my-8 w-full overflow-x-auto">
        <table className="w-full border-collapse border border-border">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-muted/30 border-b-2 border-border">{children}</thead>
    ),
    tbody: ({ children }) => <tbody>{children}</tbody>,
    tr: ({ children }) => (
      <tr className="border-b border-border/50 hover:bg-muted/20 transition-colors">
        {children}
      </tr>
    ),
    th: ({ children }) => (
      <th className="px-4 py-3 text-left font-medium text-sm text-muted-foreground">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-3 text-sm text-muted-foreground">{children}</td>
    ),
    hr: () => <hr className="my-8 border-t border-border/60" />,
    strong: ({ children }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    ...components,
  };
}

export const useMDXComponents = getMDXComponents;
