"use client";

import type * as React from "react";
import type { ComponentType } from "react";

import { track } from "@vercel/analytics";
import { Code, Download, ExternalLink, FileCode } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";
import { toast } from "sonner";

import { ShadcnIcon } from "@/components/shadcn-icon";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface LogoContextMenuProps {
  children: React.ReactNode;
  logoName: string;
  displayName: string;
  category: string;
  component: ComponentType<{ className?: string }>;
  brandUrl?: string;
  hasVariants?: boolean;
  variantsCount?: number;
  onViewVariants?: () => void;
}

export function LogoContextMenu({
  children,
  logoName,
  displayName,
  category,
  component: LogoComponent,
  brandUrl,
  hasVariants,
  variantsCount,
  onViewVariants,
}: LogoContextMenuProps) {
  const copyToClipboard = async (
    text: string,
    type: string,
    successMessage: string,
  ) => {
    try {
      await navigator.clipboard.writeText(text);

      track("Logo Context Menu Action", {
        logo_name: displayName,
        logo_id: logoName,
        category: category,
        action: type,
        source: "logos_page_context_menu",
      });

      toast.success(successMessage, {
        description: `${displayName} ${type}`,
      });
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error(`Failed to copy ${type}`, {
        description: "Please try again",
      });
    }
  };

  const handleCopyCommand = () => {
    const command = `bunx --bun shadcn@latest add @elements/${logoName}`;
    copyToClipboard(command, "copy_command", "Install command copied!");
  };

  const handleCopySVG = () => {
    const svg = renderToStaticMarkup(<LogoComponent />);
    copyToClipboard(svg, "copy_svg", "SVG code copied!");
  };

  const handleCopyJSX = () => {
    const jsx = `import { ${getComponentName(logoName)} } from "@/components/ui/logos/${logoName.replace("-logo", "")}";\n\n<${getComponentName(logoName)} className="w-8 h-8" />`;
    copyToClipboard(jsx, "copy_jsx", "JSX code copied!");
  };

  const handleDownloadSVG = () => {
    try {
      const svg = renderToStaticMarkup(<LogoComponent />);
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${logoName}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      track("Logo Context Menu Action", {
        logo_name: displayName,
        logo_id: logoName,
        category: category,
        action: "download_svg",
        source: "logos_page_context_menu",
      });

      toast.success("SVG downloaded!", {
        description: `${displayName} logo saved as ${logoName}.svg`,
      });
    } catch (err) {
      console.error("Failed to download:", err);
      toast.error("Failed to download SVG", {
        description: "Please try again",
      });
    }
  };

  const handleVisitWebsite = () => {
    if (brandUrl) {
      track("Logo Context Menu Action", {
        logo_name: displayName,
        logo_id: logoName,
        category: category,
        action: "visit_website",
        brand_url: brandUrl,
        source: "logos_page_context_menu",
      });

      toast.success("Opening website...", {
        description: `Redirecting to ${displayName}`,
      });

      window.open(brandUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        {hasVariants && onViewVariants && (
          <>
            <ContextMenuItem onClick={onViewVariants}>
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <title>View variants</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              View {variantsCount} Variants
            </ContextMenuItem>
            <ContextMenuSeparator />
          </>
        )}

        <ContextMenuItem onClick={handleCopyCommand}>
          <ShadcnIcon className="mr-2 h-4 w-4" />
          Copy Install Command
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem onClick={handleCopySVG}>
          <Code className="mr-2 h-4 w-4" />
          Copy as SVG
        </ContextMenuItem>

        <ContextMenuItem onClick={handleCopyJSX}>
          <FileCode className="mr-2 h-4 w-4" />
          Copy as JSX
        </ContextMenuItem>

        <ContextMenuItem onClick={handleDownloadSVG}>
          <Download className="mr-2 h-4 w-4" />
          Download SVG
        </ContextMenuItem>

        {brandUrl && (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={handleVisitWebsite}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Visit {displayName} Website
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}

// Helper to get component name from logo name
function getComponentName(logoName: string): string {
  const name = logoName.replace("-logo", "");
  return `${name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("")}Logo`;
}
