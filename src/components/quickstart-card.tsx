"use client";

import { useEffect, useState } from "react";

import { ElementWrapper } from "@/components/element-wrapper";
import { CopyIcon } from "@/components/icons/copy";
import { MoonIcon } from "@/components/icons/moon";
import { ThemeSwitcherElement } from "@/components/theme-switcher-element";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { CodeBlock } from "@/components/ui/code-block";

interface QuickstartCardProps {
  className?: string;
}

export function QuickstartCard({ className = "" }: QuickstartCardProps) {
  const [activeTab, setActiveTab] = useState<"registry" | "install">(
    "registry",
  );
  const [copied, setCopied] = useState<"registry" | "install" | null>(null);
  const [api, setApi] = useState<CarouselApi>();

  const registryCode = `{
  "registries": {
    "@elements": "https://tryelements.dev/r/{name}.json"
  }
}`;

  const installCode = `bunx shadcn add @elements/theme-switcher`;

  const copyToClipboard = async (
    text: string,
    type: "registry" | "install",
  ) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const registryMicrocopy = "Add the Elements registry once";

  // Handle tab clicks - control carousel
  const handleTabClick = (tab: "registry" | "install") => {
    setActiveTab(tab);
    if (api) {
      const index = tab === "registry" ? 0 : 1;
      api.scrollTo(index);
    }
  };

  // Listen to carousel changes
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      const index = api.selectedScrollSnap();
      setActiveTab(index === 0 ? "registry" : "install");
    };

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const scrollToSuggest = () => {
    const gallerySection = document.getElementById("suggest");
    if (gallerySection) {
      gallerySection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div
      className={`relative transition-all duration-500 ease-out ${className}`}
    >
      <div className="relative rounded-lg border border-border/50 bg-card/50 overflow-hidden shadow-sm transition-all duration-300">
        {/* Corner decorations - matching ComponentCard style */}
        <div className="absolute top-0 left-0 w-2 h-2 bg-border"></div>
        <div className="absolute top-0 right-0 w-2 h-2 bg-border"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 bg-border"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-border"></div>

        {/* Background pattern - subtle */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 8px,
                hsl(var(--border)) 8px,
                hsl(var(--border)) 9px
              )`,
          }}
        />

        <div className="relative z-10 p-6">
          {/* Header with tabs */}
          <div className="mb-6">
            <div className="text-xs uppercase tracking-widest font-mono text-primary/70 mb-4">
              [ QUICKSTART ]
            </div>

            {/* Tabs */}
            <div className="flex gap-8 mb-4">
              <button
                type="button"
                onClick={() => handleTabClick("registry")}
                className={`text-sm uppercase tracking-wider font-medium transition-all duration-300 ${
                  activeTab === "registry"
                    ? "text-foreground border-b-2 border-primary pb-1"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Registry
              </button>
              <button
                type="button"
                onClick={() => handleTabClick("install")}
                className={`text-sm uppercase tracking-wider font-medium transition-all duration-300 ${
                  activeTab === "install"
                    ? "text-foreground border-b-2 border-primary pb-1"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Install
              </button>
            </div>
          </div>

          {/* Carousel with fixed height */}
          <div className="h-[200px]">
            <Carousel
              setApi={setApi}
              opts={{
                align: "start",
                loop: false,
                dragFree: false,
              }}
              className="w-full h-full"
            >
              <CarouselContent className="h-full">
                {/* Registry Panel */}
                <CarouselItem className="h-full">
                  <div className="relative group h-full">
                    <CodeBlock
                      code={registryCode}
                      lang="json"
                      className="relative"
                    />
                    <Button
                      onClick={() => copyToClipboard(registryCode, "registry")}
                      size="sm"
                      variant="outline"
                      className="absolute top-3 right-3 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 border-border/50 hover:border-foreground/20 bg-background/80 "
                    >
                      {copied === "registry" ? (
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="w-4 h-4 text-primary"
                        >
                          <title>Copy Icon</title>
                          <path
                            d="M18 6h2v2h-2V6zm-2 4V8h2v2h-2zm-2 2v-2h2v2h-2zm-2 2h2v-2h-2v2zm-2 2h2v-2h-2v2zm-2 0v2h2v-2H8zm-2-2h2v2H6v-2zm0 0H4v-2h2v2z"
                            fill="currentColor"
                          />
                        </svg>
                      ) : (
                        <CopyIcon className="w-4 h-4" />
                      )}
                    </Button>

                    {/* Registry bottom content */}
                    <p className="text-xs text-muted-foreground/70 mt-3 font-mono">
                      {registryMicrocopy}
                    </p>
                  </div>
                </CarouselItem>

                {/* Install Panel */}
                <CarouselItem className="h-full">
                  <div className="relative group h-full">
                    <CodeBlock
                      code={installCode}
                      lang="bash"
                      className="relative"
                    />
                    <Button
                      onClick={() => copyToClipboard(installCode, "install")}
                      size="sm"
                      variant="outline"
                      className="absolute top-3 right-3 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 border-border/50 hover:border-foreground/20 bg-background/80 "
                    >
                      {copied === "install" ? (
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="w-4 h-4 text-primary"
                        >
                          <title>Copy Icon</title>
                          <path
                            d="M18 6h2v2h-2V6zm-2 4V8h2v2h-2zm-2 2v-2h2v2h-2zm-2 2h2v-2h-2v2zm-2 2h2v-2h-2v2zm-2 0v2h2v-2H8zm-2-2h2v2H6v-2zm0 0H4v-2h2v2z"
                            fill="currentColor"
                          />
                        </svg>
                      ) : (
                        <CopyIcon className="w-4 h-4" />
                      )}
                    </Button>

                    {/* Install bottom content with demo */}
                    <div className="mt-4">
                      <div className="flex items-center justify-center py-4 border-t border-border/30">
                        <div className="text-center space-y-2">
                          <ElementWrapper
                            icon={<MoonIcon className="w-4 h-4" />}
                          >
                            <ThemeSwitcherElement />
                          </ElementWrapper>
                          <p className="text-xs text-muted-foreground/70 font-mono">
                            next-themes • system detection • instant switching
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              </CarouselContent>
            </Carousel>
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-3 mt-6">
            <Button
              size="sm"
              className="text-xs font-medium"
              onClick={() =>
                copyToClipboard(
                  activeTab === "registry" ? registryCode : installCode,
                  activeTab,
                )
              }
            >
              {copied === activeTab ? "Copied!" : "Copy Code"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-xs font-medium hover:underline"
              onClick={scrollToSuggest}
            >
              Suggest an Element
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
