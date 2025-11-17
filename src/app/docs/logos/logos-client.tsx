"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { track } from "@vercel/analytics";
import { Check, ChevronDown, Filter } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import { getBrandUrl } from "@/lib/brand-urls";
import { loadLogoComponent } from "@/lib/component-loader";

import { Header } from "@/components/header";
import { GroupIcon } from "@/components/icons/group";
import { SearchIcon } from "@/components/icons/search";
import { PixelatedCheckIcon } from "@/components/pixelated-check-icon";
import { ScrambleText } from "@/components/scramble-text";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BunLogo } from "@/components/ui/logos/bun";
import { NpmLogo } from "@/components/ui/logos/npm";
import { PnpmLogo } from "@/components/ui/logos/pnpm";
import { YarnLogo } from "@/components/ui/logos/yarn";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { LogoContextMenu } from "./logo-context-menu";
import { LogoVariantsDialog } from "./logo-variants-dialog";

interface Logo {
  id: string;
  name: string;
  displayName: string;
  category: string;
  hasVariants?: boolean;
  variants?: string[];
}

interface LogoWithComponent extends Logo {
  component: React.ComponentType<{
    className?: string;
    mode?: "light" | "dark";
  }> | null;
}

interface Bundle {
  id: string;
  name: string;
  title: string;
  description: string;
  docs: string;
  logoCount: number;
  dependencies: string[];
}

interface LogosClientProps {
  logos: Logo[];
  bundles: Bundle[];
}

type ViewMode = "individual" | "collections";

export function LogosClient({
  logos: initialLogos,
  bundles,
}: LogosClientProps) {
  const { resolvedTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLogos, setSelectedLogos] = useState<Set<string>>(new Set());
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [logos, setLogos] = useState<LogoWithComponent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [variantsDialogOpen, setVariantsDialogOpen] = useState(false);
  const [selectedLogoForVariants, setSelectedLogoForVariants] =
    useState<LogoWithComponent | null>(null);
  const [packageManager, setPackageManager] = useState("bunx");
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("individual");
  const [selectedBundles, setSelectedBundles] = useState<Set<string>>(
    new Set(),
  );

  const currentMode = (resolvedTheme as "light" | "dark") || "light";

  // Load logo components on mount
  useEffect(() => {
    let isMounted = true;

    async function loadLogos() {
      const loadedLogos = await Promise.all(
        initialLogos.map(async (logo) => {
          const component = await loadLogoComponent(logo.name);
          return {
            ...logo,
            component,
          };
        }),
      );

      if (isMounted) {
        setLogos(loadedLogos.filter((logo) => logo.component !== null));
        setIsLoading(false);
      }
    }

    loadLogos();

    return () => {
      isMounted = false;
    };
  }, [initialLogos]);

  const filteredLogos = useMemo(() => {
    return logos.filter((logo) => {
      // Search filter
      const matchesSearch =
        logo.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        logo.category.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(logo.category);

      return matchesSearch && matchesCategory;
    });
  }, [logos, searchTerm, selectedCategories]);

  const filteredBundles = useMemo(() => {
    return bundles.filter((bundle) => {
      // Search filter for bundles
      const matchesSearch =
        bundle.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bundle.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bundle.name.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [bundles, searchTerm]);

  // Get unique categories and counts
  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(logos.map((logo) => logo.category))).sort();
  }, [logos]);

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const logo of logos) {
      counts.set(logo.category, (counts.get(logo.category) || 0) + 1);
    }
    return counts;
  }, [logos]);

  const handleCategoryChange = (checked: boolean, category: string) => {
    setSelectedCategories((prev) =>
      checked ? [...prev, category] : prev.filter((c) => c !== category),
    );

    track("Logo Category Filter", {
      category: category,
      action: checked ? "select" : "deselect",
      source: "logos_page_filter",
    });
  };

  // Track search with debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchTerm.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        track("Logo Search", {
          search_term: searchTerm.trim(),
          results_count: filteredLogos.length,
          source: "logos_page_search",
        });
      }, 500);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm, filteredLogos.length]);

  const handleLogoToggle = (logoId: string) => {
    const logo = logos.find((l) => l.id === logoId);
    const isCurrentlySelected = selectedLogos.has(logoId);

    track("Logo Selection", {
      logo_id: logoId,
      logo_name: logo?.displayName || logoId,
      logo_category: logo?.category || "unknown",
      action: isCurrentlySelected ? "deselect" : "select",
      total_selected_after: isCurrentlySelected
        ? selectedLogos.size - 1
        : selectedLogos.size + 1,
      source: "logos_page_grid",
    });

    const newSelected = new Set(selectedLogos);
    if (newSelected.has(logoId)) {
      newSelected.delete(logoId);
    } else {
      newSelected.add(logoId);
    }
    setSelectedLogos(newSelected);
  };

  const handleViewVariants = (logo: LogoWithComponent) => {
    setSelectedLogoForVariants(logo);
    setVariantsDialogOpen(true);
    track("Logo Variants Dialog Opened", {
      logo_id: logo.id,
      logo_name: logo.displayName,
      variants_count: logo.variants?.length || 0,
      source: "logos_page_context_menu",
    });
  };

  const handleSelectAll = () => {
    // For individual mode, use filtered logos; for collections, use all logos
    const targetLogos = viewMode === "individual" ? filteredLogos : logos;
    const isSelectingAll = selectedLogos.size !== targetLogos.length;

    track("Bulk Logo Selection", {
      action: isSelectingAll ? "select_all" : "deselect_all",
      logos_count: targetLogos.length,
      view_mode: viewMode,
      search_term: searchTerm || "none",
      source: "logos_page_bulk_action",
    });

    if (selectedLogos.size === targetLogos.length) {
      setSelectedLogos(new Set());
    } else {
      setSelectedLogos(new Set(targetLogos.map((logo) => logo.id)));
    }
  };

  const handleBundleSelect = (bundle: Bundle) => {
    const isCurrentlySelected = selectedBundles.has(bundle.id);

    track("Bundle Selection", {
      bundle_name: bundle.name,
      bundle_title: bundle.title,
      action: isCurrentlySelected ? "deselect" : "select",
      logos_count: bundle.logoCount,
      source: "logos_page_bundles",
    });

    // Toggle bundle selection
    const newSelectedBundles = new Set(selectedBundles);
    if (newSelectedBundles.has(bundle.id)) {
      newSelectedBundles.delete(bundle.id);
    } else {
      newSelectedBundles.add(bundle.id);
    }
    setSelectedBundles(newSelectedBundles);
  };

  const getInstallCommand = () => {
    // Combine selected logos and bundles
    const selectedLogoUrls = logos
      .filter((logo) => selectedLogos.has(logo.id))
      .map((logo) => `@elements/${logo.name}`);

    const selectedBundleUrls = bundles
      .filter((bundle) => selectedBundles.has(bundle.id))
      .map((bundle) => `@elements/${bundle.name}`);

    const urls = [...selectedBundleUrls, ...selectedLogoUrls].join(" ");

    const commands = {
      bunx: `bunx shadcn@latest add ${urls}`,
      npx: `npx shadcn@latest add ${urls}`,
      pnpm: `pnpm dlx shadcn@latest add ${urls}`,
      yarn: `yarn dlx shadcn@latest add ${urls}`,
    };

    return commands[packageManager as keyof typeof commands] || commands.bunx;
  };

  const handleCopyCommand = async () => {
    track("Logo Install Command Copy", {
      package_manager: packageManager,
      selected_logos_count: selectedLogos.size,
      selected_bundles_count: selectedBundles.size,
      total_selected: selectedLogos.size + selectedBundles.size,
      source: "logos_page_install_dock",
    });

    try {
      await navigator.clipboard.writeText(getInstallCommand());
      setCopied(true);
      toast.success("Command copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy command:", err);
      toast.error("Failed to copy command");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
            <p className="text-muted-foreground">Loading logos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <div className="flex-1 w-full border-border border-dotted sm:border-x mx-auto">
        <div className="relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-30">
            <div
              className="absolute inset-0 bg-gradient-to-br from-background via-background to-[]"
              style={{
                backgroundColor: "#10B98105",
                backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 8px,
              #10B98115 8px,
              #10B98115 9px
            )`,
              }}
            />
          </div>

          <div className="relative z-10 py-4 md:py-5 px-4 sm:px-6 md:px-8">
            <div className="max-w-4xl">
              {/* Category Label */}
              <div className="mb-3">
                <span
                  className="font-mono text-[10px] uppercase tracking-wider"
                  style={{ color: "#10B981" }}
                >
                  BRAND
                </span>
              </div>

              {/* Icon, Title & Description */}
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center flex-shrink-0">
                    <GroupIcon className="w-6 h-6 md:w-7 md:h-7" />
                  </div>
                  <h1>
                    <ScrambleText
                      text="Brand Logos"
                      className="font-dotted font-black text-2xl md:text-3xl leading-tight"
                    />
                  </h1>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed max-w-3xl">
                  Tech company logos for popular services and platforms. Select
                  the ones you need or Install all {logos.length} logos at once
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="border-t border-border border-dotted px-4 sm:px-6 md:px-8 py-4 md:py-6">
          <div className="w-full mx-auto">
            {/* Single Row Controls */}
            <div className="flex flex-col gap-2">
              {/* Row 1: View Mode Toggle + Search (desktop inline) */}
              <div className="flex flex-col md:flex-row gap-2 items-stretch md:items-center md:justify-between w-full">
                {/* Left side: Tabs + Search + Categories */}
                <div className="flex flex-col md:flex-row gap-2 items-stretch md:items-center flex-1">
                  <div className="inline-flex items-center rounded-lg border bg-background p-1 shadow-sm shrink-0 h-9 w-full md:w-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setViewMode("individual");
                        setSearchTerm("");
                      }}
                      className={`
                      relative flex-1 md:flex-none px-3 py-0.5 rounded-md text-sm font-medium transition-all duration-200
                      ${
                        viewMode === "individual"
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }
                    `}
                    >
                      Individual
                      <span className="ml-1.5 text-xs opacity-70">
                        ({logos.length})
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setViewMode("collections");
                        setSearchTerm("");
                      }}
                      className={`
                      relative flex-1 md:flex-none px-3 py-0.5 rounded-md text-sm font-medium transition-all duration-200
                      ${
                        viewMode === "collections"
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }
                    `}
                    >
                      Collections
                      <span className="ml-1.5 text-xs opacity-70">
                        ({bundles.length})
                      </span>
                    </button>
                  </div>

                  {/* Search - Show for both modes */}
                  <div className="relative flex-1">
                    <Input
                      type="text"
                      placeholder={
                        viewMode === "individual"
                          ? "Search logos..."
                          : "Search collections..."
                      }
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-10 h-9"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <SearchIcon className="size-4" />
                    </div>
                  </div>

                  {/* Category Filter - Only for individual mode - Desktop only */}
                  {viewMode === "individual" && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="hidden md:flex"
                        >
                          <Filter
                            className="-ms-1 opacity-60"
                            size={16}
                            aria-hidden="true"
                          />
                          Categories
                          {selectedCategories.length > 0 && (
                            <span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                              {selectedCategories.length}
                            </span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto min-w-36 p-3"
                        align="start"
                      >
                        <div className="space-y-3">
                          <div className="text-muted-foreground text-xs font-medium">
                            Filter by Category
                          </div>
                          <div className="space-y-3">
                            {uniqueCategories.map((category, i) => (
                              <div
                                key={category}
                                className="flex items-center gap-2"
                              >
                                <Checkbox
                                  id={`category-${i}`}
                                  checked={selectedCategories.includes(
                                    category,
                                  )}
                                  onCheckedChange={(checked: boolean) =>
                                    handleCategoryChange(checked, category)
                                  }
                                />
                                <Label
                                  htmlFor={`category-${i}`}
                                  className="flex grow justify-between gap-2 font-normal"
                                >
                                  {category}{" "}
                                  <span className="text-muted-foreground ms-2 text-xs">
                                    {categoryCounts.get(category)}
                                  </span>
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>

                {/* Select All - Desktop only (inline) */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="hidden md:flex shrink-0"
                >
                  {(() => {
                    const targetLogos =
                      viewMode === "individual" ? filteredLogos : logos;
                    const allSelected =
                      selectedLogos.size === targetLogos.length;
                    return allSelected
                      ? `Deselect All (${targetLogos.length})`
                      : `Select All (${targetLogos.length})`;
                  })()}
                </Button>
              </div>

              {/* Row 2: Categories + Select All - Mobile only */}
              <div className="flex md:hidden gap-2 items-center justify-between">
                {viewMode === "individual" && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter
                          className="-ms-1 opacity-60"
                          size={16}
                          aria-hidden="true"
                        />
                        Categories
                        {selectedCategories.length > 0 && (
                          <span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                            {selectedCategories.length}
                          </span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto min-w-36 p-3"
                      align="start"
                    >
                      <div className="space-y-3">
                        <div className="text-muted-foreground text-xs font-medium">
                          Filter by Category
                        </div>
                        <div className="space-y-3">
                          {uniqueCategories.map((category, i) => (
                            <div
                              key={category}
                              className="flex items-center gap-2"
                            >
                              <Checkbox
                                id={`category-mobile-${i}`}
                                checked={selectedCategories.includes(category)}
                                onCheckedChange={(checked: boolean) =>
                                  handleCategoryChange(checked, category)
                                }
                              />
                              <Label
                                htmlFor={`category-mobile-${i}`}
                                className="flex grow justify-between gap-2 font-normal"
                              >
                                {category}{" "}
                                <span className="text-muted-foreground ms-2 text-xs">
                                  {categoryCounts.get(category)}
                                </span>
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                )}

                {/* Select All - Mobile */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="shrink-0 ml-auto"
                >
                  {(() => {
                    const targetLogos =
                      viewMode === "individual" ? filteredLogos : logos;
                    const allSelected =
                      selectedLogos.size === targetLogos.length;
                    return allSelected
                      ? `Deselect All (${targetLogos.length})`
                      : `Select All (${targetLogos.length})`;
                  })()}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Logo Grid / Collections Grid */}
        <div className="border-t border-border border-dotted px-4 sm:px-6 md:px-8 py-8">
          <div className="w-full mx-auto">
            {/* Individual Logos Grid */}
            {viewMode === "individual" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {filteredLogos.map((logo) => {
                  const LogoComponent = logo.component;
                  const isSelected = selectedLogos.has(logo.id);
                  const brandUrl = getBrandUrl(logo.name);
                  const variantCount = logo.variants?.length || 0;
                  const totalVariants =
                    logo.name === "clerk-logo"
                      ? variantCount * 2
                      : variantCount;

                  if (!LogoComponent) return null;

                  return (
                    <LogoContextMenu
                      key={logo.id}
                      logoName={logo.name}
                      displayName={logo.displayName}
                      category={logo.category}
                      component={LogoComponent}
                      brandUrl={brandUrl}
                      hasVariants={logo.hasVariants}
                      variantsCount={totalVariants}
                      onViewVariants={() => handleViewVariants(logo)}
                    >
                      <button
                        type="button"
                        onClick={() => handleLogoToggle(logo.id)}
                        className={`
                        group relative p-4 md:p-6 rounded-lg border cursor-context-menu transition-all duration-300
                        hover:shadow-lg hover:bg-primary/10
                        ${
                          isSelected
                            ? "bg-primary/10 border-primary ring-2 ring-primary/20"
                            : "bg-card border-border"
                        }
                      `}
                        title="Right-click for options"
                      >
                        {/* Variants badge - top left */}
                        {logo.hasVariants && totalVariants > 0 && (
                          <div
                            className="absolute top-2 left-2 inline-flex items-center justify-center min-w-[18px] h-4 px-1.5 rounded text-[10px] font-medium bg-secondary/80 text-secondary-foreground border border-border/50"
                            title={`${totalVariants} variants`}
                          >
                            {totalVariants}
                          </div>
                        )}

                        {/* Selection indicator */}
                        <div
                          className={`absolute top-2 right-2 w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                            isSelected
                              ? "bg-primary border-primary"
                              : "border-muted-foreground/30 group-hover:border-primary/50"
                          }`}
                        >
                          {isSelected && (
                            <PixelatedCheckIcon className="w-2 h-2 text-primary-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                          )}
                        </div>

                        <div className="flex flex-col items-center space-y-3">
                          <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                            <LogoComponent
                              className="w-8 h-8 md:w-10 md:h-10 transition-opacity duration-300 group-hover:opacity-80"
                              mode={currentMode}
                            />
                          </div>

                          <div className="text-center space-y-1">
                            <h3 className="font-medium text-xs md:text-sm">
                              {logo.displayName}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              {logo.category}
                            </p>
                          </div>
                        </div>
                      </button>
                    </LogoContextMenu>
                  );
                })}
              </div>
            )}

            {/* Collections Grid */}
            {viewMode === "collections" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBundles.map((bundle) => {
                  // Get all logos from the bundle
                  const allBundleLogos = bundle.dependencies
                    .map((dep) => {
                      const logoId = dep.replace("@elements/", "");
                      return logos.find((logo) => logo.id === logoId);
                    })
                    .filter(Boolean) as LogoWithComponent[];

                  // Get preview logos (first 4 logos from the bundle)
                  const previewLogos = allBundleLogos.slice(0, 4);

                  return (
                    <div
                      key={bundle.id}
                      className="group relative rounded-lg border bg-card hover:bg-accent/50 transition-all duration-200 hover:shadow-md overflow-hidden"
                    >
                      <div className="p-6 space-y-4">
                        {/* Header */}
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-lg">
                              {bundle.title}
                            </h3>
                            <span className="inline-flex items-center justify-center min-w-[32px] h-6 px-2 rounded-full bg-primary/10 text-primary text-xs font-medium">
                              {bundle.logoCount}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {bundle.description}
                          </p>
                        </div>

                        {/* Preview Logos with Popover */}
                        <Popover>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className="flex items-center -space-x-2 hover:opacity-80 transition-opacity duration-300 cursor-pointer"
                            >
                              {previewLogos.map((logo, index) => {
                                const LogoComponent = logo?.component;
                                if (!LogoComponent) return null;
                                return (
                                  <div
                                    key={logo.id}
                                    className="relative inline-flex items-center justify-center size-10 rounded-full bg-background border-2 border-card ring-2 ring-primary/20"
                                    style={{ zIndex: 10 - index }}
                                    title={logo.displayName}
                                  >
                                    <LogoComponent
                                      className="w-5 h-5"
                                      mode={currentMode}
                                    />
                                  </div>
                                );
                              })}
                              {bundle.logoCount > 4 && (
                                <div
                                  className="relative inline-flex items-center justify-center size-10 rounded-full bg-background border-2 border-card ring-2 ring-primary/20 text-[10px] font-bold text-foreground"
                                  style={{ zIndex: 5 }}
                                >
                                  +{bundle.logoCount - 4}
                                </div>
                              )}
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80 p-4" align="start">
                            <div className="space-y-3">
                              <div className="text-sm font-medium text-foreground">
                                Included Logos ({bundle.logoCount})
                              </div>
                              <div className="grid grid-cols-4 gap-3">
                                {allBundleLogos.map((logo) => {
                                  const LogoComponent = logo?.component;
                                  if (!LogoComponent) return null;
                                  return (
                                    <div
                                      key={logo.id}
                                      className="flex flex-col items-center gap-1.5 group/logo"
                                      title={logo.displayName}
                                    >
                                      <div className="size-10 flex items-center justify-center rounded-lg bg-accent/50 group-hover/logo:bg-accent transition-colors">
                                        <LogoComponent
                                          className="w-6 h-6"
                                          mode={currentMode}
                                        />
                                      </div>
                                      <span className="text-[10px] text-muted-foreground text-center line-clamp-1 w-full">
                                        {logo.displayName}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>

                        {/* Action Button */}
                        <Button
                          onClick={() => handleBundleSelect(bundle)}
                          variant={
                            selectedBundles.has(bundle.id)
                              ? "default"
                              : "outline"
                          }
                          className="w-full"
                          size="sm"
                        >
                          {selectedBundles.has(bundle.id) ? (
                            <>
                              <Check className="w-3.5 h-3.5 mr-1.5" />
                              Collection Added
                            </>
                          ) : (
                            "Add Collection"
                          )}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Empty state - Individual */}
            {viewMode === "individual" && filteredLogos.length === 0 && (
              <div className="text-center py-12">
                <div className="text-muted-foreground">
                  <svg
                    className="w-12 h-12 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <title>No logos found</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291-1.002-5.824-2.625"
                    />
                  </svg>
                  <p className="text-lg font-medium mb-2">No logos found</p>
                  <p className="text-sm">Try adjusting your search term</p>
                </div>
              </div>
            )}

            {/* Empty state - Collections */}
            {viewMode === "collections" && filteredBundles.length === 0 && (
              <div className="text-center py-12">
                <div className="text-muted-foreground">
                  <svg
                    className="w-12 h-12 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <title>No collections found</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  <p className="text-lg font-medium mb-2">
                    No collections found
                  </p>
                  <p className="text-sm">Try adjusting your search term</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Dock-style Install Command */}
      {(selectedLogos.size > 0 || selectedBundles.size > 0) && (
        <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 px-3 sm:px-4">
          <div className="bg-accent/95 backdrop-blur-sm border border-dotted rounded-xl shadow-2xl p-3 sm:p-4 overflow-hidden animate-in slide-in-from-bottom-4 duration-300 w-fit">
            {/* Mobile Layout */}
            <div className="flex sm:hidden flex-col gap-3">
              <div className="flex items-center justify-between">
                {/* Overlapping Logo Avatars */}
                <div className="flex -space-x-2.5">
                  {/* Show selected bundles first */}
                  {bundles
                    .filter((bundle) => selectedBundles.has(bundle.id))
                    .slice(0, 4)
                    .map((bundle, index) => {
                      // Find first available logo with loaded component
                      let LogoComponent = null;
                      for (const dep of bundle.dependencies) {
                        const logoId = dep.replace("@elements/", "");
                        const logo = logos.find((l) => l.id === logoId);
                        if (logo?.component) {
                          LogoComponent = logo.component;
                          break;
                        }
                      }

                      // If no logo component found, use GroupIcon as fallback
                      return (
                        <div
                          key={bundle.id}
                          className="relative inline-flex items-center justify-center size-8 rounded-full bg-primary border-2 border-accent"
                          style={{
                            zIndex: 20 - index,
                          }}
                          title={bundle.title}
                        >
                          {LogoComponent ? (
                            <LogoComponent
                              className="w-4 h-4 text-primary-foreground"
                              mode={currentMode}
                            />
                          ) : (
                            <GroupIcon className="w-4 h-4 text-primary-foreground" />
                          )}
                          <div className="absolute -top-0.5 -right-0.5 size-3 rounded-full bg-background border border-accent flex items-center justify-center">
                            <GroupIcon className="w-1.5 h-1.5" />
                          </div>
                        </div>
                      );
                    })}
                  {/* Then show individual logos - only if there's space */}
                  {selectedBundles.size < 4 &&
                    logos
                      .filter((logo) => selectedLogos.has(logo.id))
                      .slice(0, Math.max(0, 4 - selectedBundles.size))
                      .map((logo, index) => {
                        const LogoComponent = logo.component;
                        if (!LogoComponent) return null;
                        return (
                          <div
                            key={logo.id}
                            className="relative inline-flex items-center justify-center size-8 rounded-full bg-background border-2 border-accent ring-2 ring-primary/20"
                            style={{
                              zIndex: 10 - index,
                            }}
                            title={logo.displayName}
                          >
                            <LogoComponent
                              className="w-4 h-4"
                              mode={currentMode}
                            />
                          </div>
                        );
                      })}
                  {selectedLogos.size + selectedBundles.size > 4 && (
                    <div
                      className="relative inline-flex items-center justify-center size-8 rounded-full bg-background border-2 border-accent ring-2 ring-primary/20 text-[10px] font-bold text-foreground"
                      style={{ zIndex: 5 }}
                    >
                      +{selectedLogos.size + selectedBundles.size - 4}
                    </div>
                  )}
                </div>

                {/* Selected Count */}
                <div className="text-sm font-bold text-foreground">
                  {selectedLogos.size + selectedBundles.size}{" "}
                  <span className="text-muted-foreground font-normal text-xs">
                    selected
                  </span>
                </div>
              </div>

              {/* Copy Button Group */}
              <div className="flex rounded-lg shadow-sm overflow-hidden">
                <Button
                  onClick={handleCopyCommand}
                  variant="outline"
                  className="rounded-none rounded-l-lg h-9 gap-2 font-medium border-r-0 min-w-[180px]"
                  disabled={copied}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      {packageManager === "bunx" && (
                        <BunLogo className="w-3.5 h-3.5" />
                      )}
                      {packageManager === "npx" && (
                        <NpmLogo className="w-3.5 h-3.5" />
                      )}
                      {packageManager === "pnpm" && (
                        <PnpmLogo className="w-3.5 h-3.5" />
                      )}
                      {packageManager === "yarn" && (
                        <YarnLogo className="w-3.5 h-3.5" />
                      )}
                      Copy Command
                    </>
                  )}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="rounded-none rounded-r-lg h-9 px-3"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-[140px]">
                    <DropdownMenuItem
                      onClick={() => setPackageManager("bunx")}
                      className="gap-2"
                    >
                      <BunLogo className="w-3.5 h-3.5" />
                      bunx
                      {packageManager === "bunx" && (
                        <Check className="w-3 h-3 ml-auto" />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setPackageManager("npx")}
                      className="gap-2"
                    >
                      <NpmLogo className="w-3.5 h-3.5" />
                      npx
                      {packageManager === "npx" && (
                        <Check className="w-3 h-3 ml-auto" />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setPackageManager("pnpm")}
                      className="gap-2"
                    >
                      <PnpmLogo className="w-3.5 h-3.5" />
                      pnpm
                      {packageManager === "pnpm" && (
                        <Check className="w-3 h-3 ml-auto" />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setPackageManager("yarn")}
                      className="gap-2"
                    >
                      <YarnLogo className="w-3.5 h-3.5" />
                      yarn
                      {packageManager === "yarn" && (
                        <Check className="w-3 h-3 ml-auto" />
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex items-center gap-4">
              {/* Overlapping Logo Avatars */}
              <div className="flex items-center">
                <div className="flex -space-x-3">
                  {/* Show selected bundles first */}
                  {bundles
                    .filter((bundle) => selectedBundles.has(bundle.id))
                    .slice(0, 5)
                    .map((bundle, index) => {
                      // Find first available logo with loaded component
                      let LogoComponent = null;
                      for (const dep of bundle.dependencies) {
                        const logoId = dep.replace("@elements/", "");
                        const logo = logos.find((l) => l.id === logoId);
                        if (logo?.component) {
                          LogoComponent = logo.component;
                          break;
                        }
                      }

                      // If no logo component found, use GroupIcon as fallback
                      return (
                        <div
                          key={bundle.id}
                          className="relative inline-flex items-center justify-center size-10 rounded-full bg-primary border-2 border-accent hover:scale-110 transition-all hover:z-10 cursor-pointer"
                          style={{
                            zIndex: 20 - index,
                          }}
                          title={bundle.title}
                        >
                          {LogoComponent ? (
                            <LogoComponent
                              className="w-5 h-5 text-primary-foreground"
                              mode={currentMode}
                            />
                          ) : (
                            <GroupIcon className="w-5 h-5 text-primary-foreground" />
                          )}
                          <div className="absolute -top-0.5 -right-0.5 size-3.5 rounded-full bg-background border border-accent flex items-center justify-center">
                            <GroupIcon className="w-2 h-2" />
                          </div>
                        </div>
                      );
                    })}
                  {/* Then show individual logos - only if there's space */}
                  {selectedBundles.size < 5 &&
                    logos
                      .filter((logo) => selectedLogos.has(logo.id))
                      .slice(0, Math.max(0, 5 - selectedBundles.size))
                      .map((logo, index) => {
                        const LogoComponent = logo.component;
                        if (!LogoComponent) return null;
                        return (
                          <div
                            key={logo.id}
                            className="relative inline-flex items-center justify-center size-10 rounded-full bg-background border-2 border-accent ring-2 ring-primary/20 hover:ring-primary/40 transition-all hover:scale-110 hover:z-10 cursor-pointer"
                            style={{
                              zIndex: 10 - index,
                            }}
                            title={logo.displayName}
                          >
                            <LogoComponent
                              className="w-5 h-5"
                              mode={currentMode}
                            />
                          </div>
                        );
                      })}
                  {selectedLogos.size + selectedBundles.size > 5 && (
                    <div
                      className="relative inline-flex items-center justify-center size-10 rounded-full bg-background border-2 border-accent ring-2 ring-primary/20 text-xs font-bold text-foreground"
                      style={{ zIndex: 5 }}
                      title={`${selectedLogos.size + selectedBundles.size - 5} more items selected`}
                    >
                      +{selectedLogos.size + selectedBundles.size - 5}
                    </div>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="h-10 w-px bg-border" />

              {/* Selected Count */}
              <div className="flex flex-col justify-center min-w-0">
                <div className="text-xs text-muted-foreground font-medium">
                  Selected
                </div>
                <div className="text-sm font-bold text-foreground">
                  {selectedLogos.size + selectedBundles.size}{" "}
                  <span className="text-muted-foreground font-normal">
                    {selectedLogos.size + selectedBundles.size === 1
                      ? "item"
                      : "items"}
                  </span>
                </div>
              </div>

              {/* Spacer */}
              <div className="flex-1 min-w-0" />

              {/* Copy Button Group */}
              <div className="flex rounded-lg shadow-sm overflow-hidden">
                <Button
                  onClick={handleCopyCommand}
                  variant="outline"
                  className="rounded-none rounded-l-lg h-9 gap-2 font-medium border-r-0 min-w-[160px]"
                  disabled={copied}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      {packageManager === "bunx" && (
                        <BunLogo className="w-3.5 h-3.5" />
                      )}
                      {packageManager === "npx" && (
                        <NpmLogo className="w-3.5 h-3.5" />
                      )}
                      {packageManager === "pnpm" && (
                        <PnpmLogo className="w-3.5 h-3.5" />
                      )}
                      {packageManager === "yarn" && (
                        <YarnLogo className="w-3.5 h-3.5" />
                      )}
                      Copy Command
                    </>
                  )}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="rounded-none rounded-r-lg h-9 px-3"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-[140px]">
                    <DropdownMenuItem
                      onClick={() => setPackageManager("bunx")}
                      className="gap-2"
                    >
                      <BunLogo className="w-3.5 h-3.5" />
                      bunx
                      {packageManager === "bunx" && (
                        <Check className="w-3 h-3 ml-auto" />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setPackageManager("npx")}
                      className="gap-2"
                    >
                      <NpmLogo className="w-3.5 h-3.5" />
                      npx
                      {packageManager === "npx" && (
                        <Check className="w-3 h-3 ml-auto" />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setPackageManager("pnpm")}
                      className="gap-2"
                    >
                      <PnpmLogo className="w-3.5 h-3.5" />
                      pnpm
                      {packageManager === "pnpm" && (
                        <Check className="w-3 h-3 ml-auto" />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setPackageManager("yarn")}
                      className="gap-2"
                    >
                      <YarnLogo className="w-3.5 h-3.5" />
                      yarn
                      {packageManager === "yarn" && (
                        <Check className="w-3 h-3 ml-auto" />
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Variants Dialog */}
      {selectedLogoForVariants && (
        <LogoVariantsDialog
          open={variantsDialogOpen}
          onOpenChange={setVariantsDialogOpen}
          logoName={selectedLogoForVariants.name}
          displayName={selectedLogoForVariants.displayName}
          component={
            selectedLogoForVariants.component as React.ComponentType<{
              className?: string;
              variant?: string;
              colorScheme?: string;
              mode?: string;
              background?: string;
            }>
          }
        />
      )}
    </div>
  );
}
