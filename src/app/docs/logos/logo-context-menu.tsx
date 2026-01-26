"use client";

import type * as React from "react";
import type { ComponentType } from "react";

import { track } from "@vercel/analytics";
import { ExternalLink } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";
import { toast } from "sonner";

import {
  canvasToBlob,
  cleanSvgMarkup,
  copyImageToClipboard,
  copyTextToClipboard,
  downloadBlob,
  svgToCanvas,
} from "@/lib/svg-utils";

import {
  CopyImageIcon,
  CopyJsxIcon,
  CopySvgIcon,
  DownloadImageIcon,
  DownloadSvgIcon,
} from "@/components/context-menu-icons";
import { ShadcnIcon } from "@/components/shadcn-icon";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { BunLogo } from "@/components/ui/logos/bun";
import { NpmLogo } from "@/components/ui/logos/npm";
import { PnpmLogo } from "@/components/ui/logos/pnpm";
import { YarnLogo } from "@/components/ui/logos/yarn";

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

  const handleCopyCommand = (
    packageManager: "bunx" | "npx" | "pnpm" | "yarn",
  ) => {
    const commands = {
      bunx: `bunx --bun shadcn@latest add @elements/${logoName}`,
      npx: `npx shadcn@latest add @elements/${logoName}`,
      pnpm: `pnpm dlx shadcn@latest add @elements/${logoName}`,
      yarn: `yarn dlx shadcn@latest add @elements/${logoName}`,
    };

    const command = commands[packageManager];
    copyToClipboard(
      command,
      `copy_command_${packageManager}`,
      `Install command copied!`,
    );
  };

  const handleCopySVG = () => {
    const svg = renderToStaticMarkup(<LogoComponent />);
    const cleanedSvg = cleanSvgMarkup(svg);
    copyToClipboard(cleanedSvg, "copy_svg", "SVG code copied!");
  };

  const handleCopyJSX = () => {
    const jsx = `import { ${getComponentName(logoName)} } from "@/components/ui/logos/${logoName.replace("-logo", "")}";\n\n<${getComponentName(logoName)} className="w-8 h-8" />`;
    copyToClipboard(jsx, "copy_jsx", "JSX code copied!");
  };

  const handleDownloadSVG = () => {
    try {
      const svg = renderToStaticMarkup(<LogoComponent />);
      const cleanedSvg = cleanSvgMarkup(svg);
      const blob = new Blob([cleanedSvg], { type: "image/svg+xml" });
      downloadBlob(blob, `${logoName}.svg`, "image/svg+xml");

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

  const handleCopyImage = async () => {
    try {
      const svg = renderToStaticMarkup(<LogoComponent />);
      const cleanedSvg = cleanSvgMarkup(svg);
      const canvas = await svgToCanvas(cleanedSvg, 512);
      const blob = await canvasToBlob(canvas);
      await copyImageToClipboard(blob);

      track("Logo Context Menu Action", {
        logo_name: displayName,
        logo_id: logoName,
        category: category,
        action: "copy_image",
        source: "logos_page_context_menu",
      });

      toast.success("Image copied to clipboard!", {
        description: `${displayName} logo copied as PNG`,
      });
    } catch (err) {
      console.error("Failed to copy image:", err);
      toast.error("Failed to copy image", {
        description: "Please try again",
      });
    }
  };

  const handleDownloadImage = async () => {
    try {
      const svg = renderToStaticMarkup(<LogoComponent />);
      const cleanedSvg = cleanSvgMarkup(svg);
      const canvas = await svgToCanvas(cleanedSvg, 1024);
      const blob = await canvasToBlob(canvas);
      downloadBlob(blob, `${logoName}.png`, "image/png");

      track("Logo Context Menu Action", {
        logo_name: displayName,
        logo_id: logoName,
        category: category,
        action: "download_image",
        source: "logos_page_context_menu",
      });

      toast.success("Image downloaded!", {
        description: `${displayName} logo saved as ${logoName}.png`,
      });
    } catch (err) {
      console.error("Failed to download image:", err);
      toast.error("Failed to download image", {
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
        {hasVariants && onViewVariants && variantsCount > 1 && (
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

        <ContextMenuSub>
          <ContextMenuSubTrigger className="gap-2">
            <ShadcnIcon className="mr-2 h-4 w-4" />
            Copy Command
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-32">
            <ContextMenuItem
              onClick={() => handleCopyCommand("bunx")}
              className="gap-2"
            >
              <BunLogo className="h-4 w-4" />
              bunx
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => handleCopyCommand("npx")}
              className="gap-2"
            >
              <NpmLogo className="h-4 w-4" />
              npx
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => handleCopyCommand("pnpm")}
              className="gap-2"
            >
              <PnpmLogo className="h-4 w-4" />
              pnpm
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => handleCopyCommand("yarn")}
              className="gap-2"
            >
              <YarnLogo className="h-4 w-4" />
              yarn
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSeparator />

        <ContextMenuItem onClick={handleCopySVG}>
          <CopySvgIcon className="mr-2 h-4 w-4" />
          Copy as SVG
        </ContextMenuItem>

        <ContextMenuItem onClick={handleCopyJSX}>
          <CopyJsxIcon className="mr-2 h-4 w-4" />
          Copy as JSX
        </ContextMenuItem>

        <ContextMenuItem onClick={handleCopyImage}>
          <CopyImageIcon className="mr-2 h-4 w-4" />
          Copy as Image
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem onClick={handleDownloadSVG}>
          <DownloadSvgIcon className="mr-2 h-4 w-4" />
          Download SVG
        </ContextMenuItem>

        <ContextMenuItem onClick={handleDownloadImage}>
          <DownloadImageIcon className="mr-2 h-4 w-4" />
          Download Image
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
