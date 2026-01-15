"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { ChevronDown, ChevronRight, Menu } from "lucide-react";

import { providers } from "@/lib/providers";
import {
  AI_ELEMENTS_SUBCATEGORIES,
  type AIElementsSubcategory,
  getComponentsByProvider,
  getComponentsBySubcategory,
  getSubcategoryMetadata,
} from "@/lib/registry-loader";
import { cn } from "@/lib/utils";

import { OverviewIcon } from "@/components/icons/overview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function ProviderList({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();
  const [expandedProviders, setExpandedProviders] = useState<Set<string>>(
    new Set(),
  );
  const [expandedSubcategories, setExpandedSubcategories] = useState<
    Set<string>
  >(new Set());

  useEffect(() => {
    const pathParts = pathname.split("/");
    const currentProvider = pathParts[2];
    if (currentProvider && !expandedProviders.has(currentProvider)) {
      setExpandedProviders((prev) => new Set(prev).add(currentProvider));
    }
    if (currentProvider === "ai-elements" && pathParts[3]) {
      const subcategory = pathParts[3];
      if (
        subcategory in AI_ELEMENTS_SUBCATEGORIES &&
        !expandedSubcategories.has(subcategory)
      ) {
        setExpandedSubcategories((prev) => new Set(prev).add(subcategory));
      }
    }
  }, [pathname, expandedProviders.has, expandedSubcategories.has]);

  const toggleProvider = (providerSlug: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedProviders((prev) => {
      const next = new Set(prev);
      if (next.has(providerSlug)) {
        next.delete(providerSlug);
      } else {
        next.add(providerSlug);
      }
      return next;
    });
  };

  const toggleSubcategory = (subcategory: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedSubcategories((prev) => {
      const next = new Set(prev);
      if (next.has(subcategory)) {
        next.delete(subcategory);
      } else {
        next.add(subcategory);
      }
      return next;
    });
  };

  // Sort providers:
  // 1. Enabled with components first
  // 2. Building (enabled but no components yet)
  // 3. Disabled (coming soon)
  // Then alphabetically within each group
  const sortedProviders = [...providers].sort((a, b) => {
    // First priority: enabled status
    if (a.isEnabled !== b.isEnabled) {
      return a.isEnabled ? -1 : 1;
    }

    // Second priority: for enabled providers, sort by building status
    if (a.isEnabled && b.isEnabled) {
      const aIsBuilding = a.status === "building";
      const bIsBuilding = b.status === "building";

      if (aIsBuilding !== bIsBuilding) {
        return aIsBuilding ? 1 : -1; // Building goes after available
      }
    }

    // Third priority: alphabetically
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="py-2 md:py-0">
      <h2 className="font-dotted font-black mt-1.5 mb-2 px-4">Providers</h2>

      <nav className="flex flex-col -space-y-px">
        {/* Overview Link */}
        <Link
          href="/docs"
          className={cn(
            "group flex items-center border border-dotted border-border border-x-0 border-l-2 gap-3 p-2.5 text-sm rounded-sm transition-all relative",
            pathname === "/docs"
              ? "bg-muted text-foreground font-medium z-10 border-l-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:z-10 border-l-transparent hover:border-l-primary/30",
          )}
          onClick={() => onLinkClick?.()}
        >
          {/* Icon */}
          <div
            className={cn(
              "flex items-center justify-center w-5 h-5 shrink-0",
              pathname === "/docs" && "text-foreground",
            )}
          >
            <OverviewIcon className="w-5 h-5" />
          </div>

          {/* Name */}
          <span className="flex-1 truncate">Overview</span>
        </Link>

        {sortedProviders.map((provider) => {
          const providerSlug = provider.href.split("/").pop() || "";
          const isActive = pathname.startsWith(provider.href);
          const isExpanded = expandedProviders.has(providerSlug);
          const providerComponents = provider.isEnabled
            ? getComponentsByProvider(providerSlug)
            : [];
          const hasComponents =
            providerComponents.length > 0 &&
            provider.status !== "building" &&
            providerSlug !== "logos"; // Don't allow logos to expand

          return (
            <div key={provider.href}>
              <Link
                href={provider.isEnabled ? provider.href : "#"}
                className={cn(
                  "group flex items-center border border-dotted border-border border-x-0 border-l-2 gap-3 p-2.5 text-[13px] rounded-sm transition-all relative",
                  isActive
                    ? "bg-muted text-foreground font-medium z-10 border-l-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:z-10 border-l-transparent hover:border-l-primary/30",
                  !provider.isEnabled && "opacity-50 cursor-not-allowed",
                )}
                onClick={(e) => {
                  if (!provider.isEnabled) {
                    e.preventDefault();
                  } else if (onLinkClick) {
                    onLinkClick();
                  }
                }}
              >
                {/* Icon */}
                <div
                  className={cn(
                    "flex items-center justify-center w-5 h-5 shrink-0",
                    isActive && "text-foreground",
                  )}
                >
                  {provider.icon}
                </div>

                {/* Name */}
                <span className="flex-1 truncate">{provider.name}</span>

                {/* Badge or expand icon */}
                {provider.isEnabled ? (
                  <>
                    {provider.status === "building" && (
                      <Badge
                        variant="outline"
                        className="h-5 px-1.5 text-[10px] font-normal border-[#6C47FF]/50 text-[#6C47FF]"
                        style={{
                          borderColor: isActive ? "#6C47FF" : "#6C47FF80",
                          backgroundColor: isActive ? "#6C47FF20" : "transparent",
                        }}
                      >
                        Building
                      </Badge>
                    )}
                    {provider.status === "beta" && (
                      <Badge
                        variant="outline"
                        className="h-5 px-1.5 text-[10px] font-normal border-blue-500/50 text-blue-500"
                        style={{
                          borderColor: isActive ? "#3B82F6" : "#3B82F680",
                          backgroundColor: isActive ? "#3B82F620" : "transparent",
                        }}
                      >
                        Beta
                      </Badge>
                    )}
                    {hasComponents && (
                      <button
                        type="button"
                        onClick={(e) => toggleProvider(providerSlug, e)}
                        className="p-0.5 hover:bg-primary/10 rounded transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </>
                ) : (
                  <Badge
                    variant="outline"
                    className="h-5 px-1.5 text-[10px] font-normal"
                  >
                    Soon
                  </Badge>
                )}
              </Link>

              {isExpanded && hasComponents && (
                <div className="ml-8 border-l border-dotted border-border">
                  {providerSlug === "ai-elements"
                    ? (
                        Object.keys(
                          AI_ELEMENTS_SUBCATEGORIES,
                        ) as AIElementsSubcategory[]
                      ).map((subcategory) => {
                        const subMeta = getSubcategoryMetadata(subcategory);
                        const subComponents =
                          getComponentsBySubcategory(subcategory);
                        const isSubExpanded =
                          expandedSubcategories.has(subcategory);
                        const isSubActive =
                          pathname === `/docs/ai-elements/${subcategory}` ||
                          pathname.startsWith(
                            `/docs/ai-elements/${subcategory}/`,
                          );

                        return (
                          <div key={subcategory}>
                            <Link
                              href={`/docs/ai-elements/${subcategory}`}
                              className={cn(
                                "group flex items-center gap-2 pl-3 pr-2 py-1.5 text-xs transition-colors",
                                isSubActive
                                  ? "text-foreground font-medium bg-primary/5"
                                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30",
                              )}
                              onClick={() => onLinkClick?.()}
                            >
                              <span className="flex-1 truncate">
                                {subMeta.displayName}
                              </span>
                              {subMeta.status === "beta" && (
                                <Badge
                                  variant="outline"
                                  className="h-4 px-1 text-[9px] font-normal border-blue-500/50 text-blue-500"
                                  style={{
                                    borderColor: isSubActive ? "#3B82F6" : "#3B82F680",
                                    backgroundColor: isSubActive ? "#3B82F620" : "transparent",
                                  }}
                                >
                                  Beta
                                </Badge>
                              )}
                              <button
                                type="button"
                                onClick={(e) =>
                                  toggleSubcategory(subcategory, e)
                                }
                                className="p-0.5 hover:bg-primary/10 rounded transition-colors"
                              >
                                {isSubExpanded ? (
                                  <ChevronDown className="w-3 h-3" />
                                ) : (
                                  <ChevronRight className="w-3 h-3" />
                                )}
                              </button>
                            </Link>

                            {isSubExpanded && (
                              <div className="ml-4 border-l border-dotted border-border/50">
                                {subComponents.map((component) => {
                                  const componentPath = `/docs/ai-elements/${subcategory}/${component.name}`;
                                  const isComponentActive =
                                    pathname === componentPath;

                                  return (
                                    <Link
                                      key={component.name}
                                      href={componentPath}
                                      className={cn(
                                        "group flex items-center gap-2 pl-3 pr-2 py-1 text-[11px] transition-colors",
                                        isComponentActive
                                          ? "text-foreground font-medium bg-primary/5"
                                          : "text-muted-foreground hover:text-foreground hover:bg-muted/30",
                                      )}
                                      onClick={() => onLinkClick?.()}
                                    >
                                      <span className="truncate">
                                        {component.title}
                                      </span>
                                    </Link>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })
                    : providerComponents.map((component) => {
                        const componentPath = `/docs/${providerSlug}/${component.name}`;
                        const isComponentActive = pathname === componentPath;

                        return (
                          <Link
                            key={component.name}
                            href={componentPath}
                            className={cn(
                              "group flex items-center gap-2 pl-3 pr-2 py-1.5 text-xs transition-colors",
                              isComponentActive
                                ? "text-foreground font-medium bg-primary/5"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/30",
                            )}
                            onClick={() => onLinkClick?.()}
                          >
                            <span className="truncate">{component.title}</span>
                          </Link>
                        );
                      })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}

export function ProviderSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <div className="md:hidden fixed top-16 right-4 z-40">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 border-border bg-card"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle providers menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetTitle className="sr-only">Providers Menu</SheetTitle>
            <ScrollArea className="h-full">
              <ProviderList onLinkClick={() => setOpen(false)} />
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="md:transition-all border-r border-border border-dotted top-[55px] md:flex hidden md:w-54 overflow-y-auto fixed h-[calc(100dvh-55px)] pb-2 flex-col justify-between left-0 z-40 bg-background">
        <ProviderList />
      </aside>
    </>
  );
}
