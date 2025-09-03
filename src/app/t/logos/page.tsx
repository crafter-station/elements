"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { track } from "@vercel/analytics";
import { Filter } from "lucide-react";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { CopyIcon } from "@/components/icons/copy";
import { GroupIcon } from "@/components/icons/group";
import { SearchIcon } from "@/components/icons/search";
import { InstallCommand } from "@/components/install-command";
import { PixelatedCheckIcon } from "@/components/pixelated-check-icon";
import { ScrambleText } from "@/components/scramble-text";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { AnthropicLogo } from "@/registry/default/logos/anthropic";
import { AppleLogo } from "@/registry/default/logos/apple";
import { AWSLogo } from "@/registry/default/logos/aws";
import { BetterAuthLogo } from "@/registry/default/logos/better-auth";
import { ClaudeLogo } from "@/registry/default/logos/claude";
import { CohereLogo } from "@/registry/default/logos/cohere";
import { CrafterStationLogo } from "@/registry/default/logos/crafter-station";
import { DeepSeekLogo } from "@/registry/default/logos/deepseek";
import { DiscordLogo } from "@/registry/default/logos/discord";
import { GeminiLogo } from "@/registry/default/logos/gemini";
import { GitHubLogo } from "@/registry/default/logos/github";
import { GitLabLogo } from "@/registry/default/logos/gitlab";
import { GoogleLogo } from "@/registry/default/logos/google";
import { GrokLogo } from "@/registry/default/logos/grok";
import { GroqLogo } from "@/registry/default/logos/groq";
import { HuggingFaceLogo } from "@/registry/default/logos/hugging-face";
import { KeboLogo } from "@/registry/default/logos/kebo";
import { KimiLogo } from "@/registry/default/logos/kimi";
import { LinearLogo } from "@/registry/default/logos/linear";
import { LovableLogo } from "@/registry/default/logos/lovable";
import { MetaLogo } from "@/registry/default/logos/meta";
import { MicrosoftLogo } from "@/registry/default/logos/microsoft";
import { MistralLogo } from "@/registry/default/logos/mistral";
import { MoonshotAILogo } from "@/registry/default/logos/moonshot-ai";
import { NotionLogo } from "@/registry/default/logos/notion";
import { OpenAILogo } from "@/registry/default/logos/openai";
import { PerplexityLogo } from "@/registry/default/logos/perplexity";
import { PolarLogo } from "@/registry/default/logos/polar";
import { QwenLogo } from "@/registry/default/logos/qwen";
import { ResendLogo } from "@/registry/default/logos/resend";
import { SlackLogo } from "@/registry/default/logos/slack";
import { SpotifyLogo } from "@/registry/default/logos/spotify";
import { StripeLogo } from "@/registry/default/logos/stripe";
import { SupabaseLogo } from "@/registry/default/logos/supabase";
import { TwitchLogo } from "@/registry/default/logos/twitch";
import { TwitterLogo } from "@/registry/default/logos/twitter";
import { UpstashLogo } from "@/registry/default/logos/upstash";
import { V0Logo } from "@/registry/default/logos/v0";
import { VercelLogo } from "@/registry/default/logos/vercel";
import { XAILogo } from "@/registry/default/logos/xai";

interface Logo {
  id: string;
  name: string;
  displayName: string;
  component: React.ComponentType<{ className?: string }>;
  category: string;
}

const logos: Logo[] = [
  {
    id: "google",
    name: "google-logo",
    displayName: "Google",
    component: GoogleLogo,
    category: "Search",
  },
  {
    id: "apple",
    name: "apple-logo",
    displayName: "Apple",
    component: AppleLogo,
    category: "Hardware",
  },
  {
    id: "github",
    name: "github-logo",
    displayName: "GitHub",
    component: GitHubLogo,
    category: "Development",
  },
  {
    id: "microsoft",
    name: "microsoft-logo",
    displayName: "Microsoft",
    component: MicrosoftLogo,
    category: "Software",
  },
  {
    id: "linear",
    name: "linear-logo",
    displayName: "Linear",
    component: LinearLogo,
    category: "Project Management",
  },
  {
    id: "slack",
    name: "slack-logo",
    displayName: "Slack",
    component: SlackLogo,
    category: "Communication",
  },
  {
    id: "notion",
    name: "notion-logo",
    displayName: "Notion",
    component: NotionLogo,
    category: "Productivity",
  },
  {
    id: "discord",
    name: "discord-logo",
    displayName: "Discord",
    component: DiscordLogo,
    category: "Communication",
  },
  {
    id: "spotify",
    name: "spotify-logo",
    displayName: "Spotify",
    component: SpotifyLogo,
    category: "Entertainment",
  },
  {
    id: "twitch",
    name: "twitch-logo",
    displayName: "Twitch",
    component: TwitchLogo,
    category: "Entertainment",
  },
  {
    id: "twitter",
    name: "twitter-logo",
    displayName: "Twitter/X",
    component: TwitterLogo,
    category: "Social",
  },
  {
    id: "gitlab",
    name: "gitlab-logo",
    displayName: "GitLab",
    component: GitLabLogo,
    category: "Development",
  },
  {
    id: "qwen",
    name: "qwen-logo",
    displayName: "Qwen",
    component: QwenLogo,
    category: "AI",
  },
  {
    id: "moonshot-ai",
    name: "moonshot-ai-logo",
    displayName: "MoonshotAI",
    component: MoonshotAILogo,
    category: "AI",
  },
  {
    id: "cohere",
    name: "cohere-logo",
    displayName: "Cohere",
    component: CohereLogo,
    category: "AI",
  },
  {
    id: "openai",
    name: "openai-logo",
    displayName: "OpenAI",
    component: OpenAILogo,
    category: "AI",
  },
  {
    id: "anthropic",
    name: "anthropic-logo",
    displayName: "Anthropic",
    component: AnthropicLogo,
    category: "AI",
  },
  {
    id: "deepseek",
    name: "deepseek-logo",
    displayName: "DeepSeek",
    component: DeepSeekLogo,
    category: "AI",
  },
  {
    id: "hugging-face",
    name: "hugging-face-logo",
    displayName: "Hugging Face",
    component: HuggingFaceLogo,
    category: "AI",
  },
  {
    id: "groq",
    name: "groq-logo",
    displayName: "Groq",
    component: GroqLogo,
    category: "AI",
  },
  {
    id: "grok",
    name: "grok-logo",
    displayName: "Grok",
    component: GrokLogo,
    category: "AI",
  },
  {
    id: "gemini",
    name: "gemini-logo",
    displayName: "Gemini",
    component: GeminiLogo,
    category: "AI",
  },
  {
    id: "lovable",
    name: "lovable-logo",
    displayName: "Lovable",
    component: LovableLogo,
    category: "AI",
  },
  {
    id: "perplexity",
    name: "perplexity-logo",
    displayName: "Perplexity",
    component: PerplexityLogo,
    category: "AI",
  },
  {
    id: "xai",
    name: "xai-logo",
    displayName: "xAI",
    component: XAILogo,
    category: "AI",
  },
  {
    id: "v0",
    name: "v0-logo",
    displayName: "v0",
    component: V0Logo,
    category: "AI",
  },
  {
    id: "claude",
    name: "claude-logo",
    displayName: "Claude",
    component: ClaudeLogo,
    category: "AI",
  },
  {
    id: "mistral",
    name: "mistral-logo",
    displayName: "Mistral",
    component: MistralLogo,
    category: "AI",
  },
  {
    id: "meta",
    name: "meta-logo",
    displayName: "Meta",
    component: MetaLogo,
    category: "Social",
  },
  {
    id: "aws",
    name: "aws-logo",
    displayName: "AWS",
    component: AWSLogo,
    category: "Cloud",
  },
  {
    id: "kimi",
    name: "kimi-logo",
    displayName: "Kimi",
    component: KimiLogo,
    category: "AI",
  },
  {
    id: "supabase",
    name: "supabase-logo",
    displayName: "Supabase",
    component: SupabaseLogo,
    category: "Database",
  },
  {
    id: "stripe",
    name: "stripe-logo",
    displayName: "Stripe",
    component: StripeLogo,
    category: "Payments",
  },
  {
    id: "resend",
    name: "resend-logo",
    displayName: "Resend",
    component: ResendLogo,
    category: "Email",
  },
  {
    id: "better-auth",
    name: "better-auth-logo",
    displayName: "Better Auth",
    component: BetterAuthLogo,
    category: "Auth",
  },
  {
    id: "upstash",
    name: "upstash-logo",
    displayName: "Upstash",
    component: UpstashLogo,
    category: "Database",
  },
  {
    id: "vercel",
    name: "vercel-logo",
    displayName: "Vercel",
    component: VercelLogo,
    category: "Cloud",
  },
  {
    id: "polar",
    name: "polar-logo",
    displayName: "Polar",
    component: PolarLogo,
    category: "Monetization",
  },
  {
    id: "crafter-station",
    name: "crafter-station-logo",
    displayName: "Crafter Station",
    component: CrafterStationLogo,
    category: "Development",
  },
  {
    id: "kebo",
    name: "kebo-logo",
    displayName: "Kebo",
    component: KeboLogo,
    category: "Development",
  },
];

export default function TechLogosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLogos, setSelectedLogos] = useState<Set<string>>(new Set());
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const searchTimeoutRef = useRef<NodeJS.Timeout>(null);

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
  }, [searchTerm, selectedCategories]);

  // Get unique categories and counts
  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(logos.map((logo) => logo.category))).sort();
  }, []);

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    logos.forEach((logo) => {
      counts.set(logo.category, (counts.get(logo.category) || 0) + 1);
    });
    return counts;
  }, []);

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

  const handleSelectAll = () => {
    const isSelectingAll = selectedLogos.size !== filteredLogos.length;

    track("Bulk Logo Selection", {
      action: isSelectingAll ? "select_all" : "deselect_all",
      logos_count: filteredLogos.length,
      search_term: searchTerm || "none",
      source: "logos_page_bulk_action",
    });

    if (selectedLogos.size === filteredLogos.length) {
      setSelectedLogos(new Set());
    } else {
      setSelectedLogos(new Set(filteredLogos.map((logo) => logo.id)));
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <div className="flex-1 w-full max-w-screen-xl border-border border-dotted sm:border-x mx-auto">
        <div className="relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
          </div>

          <div className="relative z-10 w-full py-8 md:py-12 px-4 sm:px-6 md:px-8">
            {/* Centered Hero */}
            <div className="text-center max-w-3xl mx-auto space-y-4 md:space-y-6">
              <div className="space-y-3 md:space-y-4">
                <span className="font-mono text-xs sm:text-sm text-primary">
                  [ BRAND LOGOS ]
                </span>
                <div className="flex items-center justify-center gap-3 md:gap-4 mb-3 md:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center flex-shrink-0">
                    <GroupIcon className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <h1 className="font-dotted font-black text-2xl sm:text-3xl md:text-4xl leading-tight">
                    <ScrambleText text="Tech Logos" />
                  </h1>
                </div>
                <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Popular tech company logos for your projects. Select the ones
                  you need or Install all {logos.length} logos at once
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <InstallCommand
                  url="@elements/logos"
                  className="max-w-xs"
                  source="logos_page_hero"
                  componentName="Tech Logos"
                  category="Brand"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="border-t border-border border-dotted px-4 sm:px-6 md:px-8 py-6">
          <div className="w-full mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
                <div className="relative flex-1 max-w-md">
                  <Input
                    type="text"
                    placeholder="Search logos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <SearchIcon className="size-4" />
                  </div>
                </div>

                {/* Category Filter */}
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
                  <PopoverContent className="w-auto min-w-36 p-3" align="start">
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
                              checked={selectedCategories.includes(category)}
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
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="shrink-0"
              >
                {selectedLogos.size === filteredLogos.length
                  ? `Deselect All (${filteredLogos.length})`
                  : `Select All (${filteredLogos.length})`}
              </Button>
            </div>
          </div>
        </div>

        {/* Logo Grid */}
        <div className="border-t border-border border-dotted px-4 sm:px-6 md:px-8 py-8">
          <div className="w-full mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {filteredLogos.map((logo) => {
                const LogoComponent = logo.component;
                const isSelected = selectedLogos.has(logo.id);

                return (
                  <button
                    type="button"
                    key={logo.id}
                    onClick={() => handleLogoToggle(logo.id)}
                    className={`
                      group relative p-4 md:p-6 rounded-lg border cursor-pointer transition-all duration-200
                      hover:shadow-md hover:scale-105
                      ${
                        isSelected
                          ? "bg-primary/10 border-primary ring-2 ring-primary/20"
                          : "bg-card hover:bg-accent/50"
                      }
                    `}
                  >
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
                        <LogoComponent className="w-8 h-8 md:w-10 md:h-10 transition-transform duration-200 group-hover:scale-110" />
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
                );
              })}
            </div>

            {/* Empty state */}
            {filteredLogos.length === 0 && (
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
          </div>
        </div>
      </div>

      {/* Dock-style Install Command */}
      {selectedLogos.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
          <div className="bg-card border rounded-lg shadow-lg w-full p-3 overflow-hidden">
            <InstallCommand
              url={logos
                .filter((logo) => selectedLogos.has(logo.id))
                .map((logo) => `@elements/${logo.name}`)
                .join(" ")}
              className="w-full max-w-none min-w-0"
              source="logos_page_install_dock"
              componentName={`${selectedLogos.size} Logos`}
              category="Brand"
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
