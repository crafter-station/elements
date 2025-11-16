"use client";

import type { ComponentType } from "react";
import { useState } from "react";

import { track } from "@vercel/analytics";
import { Check, Code, Copy, Download } from "lucide-react";
import { useTheme } from "next-themes";
import { renderToStaticMarkup } from "react-dom/server";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ThemeSwitcherButton } from "@/registry/default/blocks/theme-switcher/theme-switcher-button/components/elements/theme-switcher-button";

interface LogoVariantsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  logoName: string;
  displayName: string;
  component: ComponentType<{
    className?: string;
    variant?: string;
    colorScheme?: string;
    mode?: string;
    background?: string;
  }>;
  colorSchemes?: Array<{ readonly value: string; readonly label: string }>;
  baseVariants?: Array<{
    readonly variant: string;
    readonly background?: string;
    readonly label: string;
  }>;
}

const DEFAULT_COLOR_SCHEMES = [
  { value: "grayscale", label: "Grayscale" },
  { value: "purple", label: "Purple" },
];

const DEFAULT_BASE_VARIANTS = [
  { variant: "icon", background: "none", label: "Icon" },
  { variant: "icon", background: "square", label: "Icon Square" },
  { variant: "icon", background: "circle", label: "Icon Circle" },
  { variant: "wordmark", background: "none", label: "Wordmark" },
];

export function LogoVariantsDialog({
  open,
  onOpenChange,
  logoName,
  displayName,
  component: LogoComponent,
  colorSchemes = DEFAULT_COLOR_SCHEMES,
  baseVariants = DEFAULT_BASE_VARIANTS,
}: LogoVariantsDialogProps) {
  const { resolvedTheme } = useTheme();
  const [copiedVariant, setCopiedVariant] = useState<string | null>(null);
  const currentMode = (resolvedTheme as "light" | "dark") || "light";

  const copyToClipboard = async (
    text: string,
    variantKey: string,
    type: "svg" | "jsx",
  ) => {
    try {
      await navigator.clipboard.writeText(text);

      track("Logo Variant Action", {
        logo_name: displayName,
        logo_id: logoName,
        variant: variantKey,
        action: `copy_${type}`,
        source: "variants_dialog",
      });

      setCopiedVariant(`${variantKey}-${type}`);
      setTimeout(() => setCopiedVariant(null), 2000);

      toast.success(`${type.toUpperCase()} copied!`, {
        description: `${displayName} (${variantKey})`,
      });
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error(`Failed to copy ${type}`, {
        description: "Please try again",
      });
    }
  };

  const getVariantKey = (
    colorScheme: string,
    variant: { variant: string; background?: string },
  ) => {
    return `${variant.variant}-${colorScheme}-${currentMode}-${variant.background || "none"}`;
  };

  const handleCopySVG = (
    colorScheme: string,
    variant: { variant: string; background?: string; label: string },
  ) => {
    const svg = renderToStaticMarkup(
      <LogoComponent
        variant={variant.variant}
        colorScheme={colorScheme}
        mode={currentMode}
        background={variant.background}
      />,
    );
    const variantKey = getVariantKey(colorScheme, variant);
    copyToClipboard(svg, variantKey, "svg");
  };

  const handleCopyJSX = (
    colorScheme: string,
    variant: { variant: string; background?: string; label: string },
  ) => {
    const componentName = getComponentName(logoName);
    const propsStr = [
      `variant="${variant.variant}"`,
      `colorScheme="${colorScheme}"`,
      `mode="${currentMode}"`,
      variant.background && variant.background !== "none"
        ? `background="${variant.background}"`
        : "",
      `className="w-8 h-8"`,
    ]
      .filter(Boolean)
      .join(" ");

    const jsx = `<${componentName} ${propsStr} />`;
    const variantKey = getVariantKey(colorScheme, variant);
    copyToClipboard(jsx, variantKey, "jsx");
  };

  const handleDownloadSVG = (
    colorScheme: string,
    variant: { variant: string; background?: string; label: string },
  ) => {
    try {
      const svg = renderToStaticMarkup(
        <LogoComponent
          variant={variant.variant}
          colorScheme={colorScheme}
          mode={currentMode}
          background={variant.background}
        />,
      );
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const variantKey = getVariantKey(colorScheme, variant);
      a.download = `${logoName}-${variantKey}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      track("Logo Variant Action", {
        logo_name: displayName,
        logo_id: logoName,
        variant: variantKey,
        action: "download_svg",
        source: "variants_dialog",
      });

      toast.success("SVG downloaded!", {
        description: `${displayName} (${variant.label})`,
      });
    } catch (err) {
      console.error("Failed to download:", err);
      toast.error("Failed to download SVG", {
        description: "Please try again",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1.5">
              <DialogTitle>{displayName} Logo Variants</DialogTitle>
              <DialogDescription>
                Choose from multiple variants with different color schemes and
                backgrounds. Use the theme switcher to preview in different
                modes.
              </DialogDescription>
            </div>
            <ThemeSwitcherButton className="h-8 w-8" />
          </div>
        </DialogHeader>

        <Tabs defaultValue={colorSchemes[0]?.value} className="w-full">
          <TabsList className={`grid w-full grid-cols-${colorSchemes.length}`}>
            {colorSchemes.map((scheme) => (
              <TabsTrigger key={scheme.value} value={scheme.value}>
                {scheme.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {colorSchemes.map((scheme) => (
            <TabsContent
              key={scheme.value}
              value={scheme.value}
              className="space-y-4 mt-4"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-[500px] overflow-y-auto">
                {baseVariants.map((variantConfig) => {
                  const variantKey = getVariantKey(scheme.value, variantConfig);
                  return (
                    <div
                      key={variantKey}
                      className="border rounded-lg p-4 space-y-3 bg-card"
                    >
                      <div className="flex items-center justify-center h-24 bg-muted/50 rounded">
                        <LogoComponent
                          variant={variantConfig.variant}
                          colorScheme={scheme.value}
                          mode={currentMode}
                          background={variantConfig.background}
                          className={
                            variantConfig.variant === "wordmark"
                              ? "h-10 w-auto"
                              : "w-12 h-12"
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-xs font-medium text-center">
                          {variantConfig.label}
                        </h3>

                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 px-2"
                            onClick={() =>
                              handleCopySVG(scheme.value, variantConfig)
                            }
                            title="Copy SVG"
                          >
                            {copiedVariant === `${variantKey}-svg` ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <Code className="w-3 h-3" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 px-2"
                            onClick={() =>
                              handleCopyJSX(scheme.value, variantConfig)
                            }
                            title="Copy JSX"
                          >
                            {copiedVariant === `${variantKey}-jsx` ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 px-2"
                            onClick={() =>
                              handleDownloadSVG(scheme.value, variantConfig)
                            }
                            title="Download SVG"
                          >
                            <Download className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
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
