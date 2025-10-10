"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Menu } from "lucide-react";

import { providers } from "@/lib/providers";
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

  // Sort providers: enabled first, then alphabetically
  const sortedProviders = [...providers].sort((a, b) => {
    if (a.isEnabled !== b.isEnabled) {
      return a.isEnabled ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="py-2 md:py-0">
      <h2 className="font-dotted font-black text-lg mb-2 px-4">Providers</h2>

      <nav className="flex flex-col -space-y-px">
        {/* Overview Link */}
        <Link
          href="/docs"
          className={cn(
            "group flex items-center border border-dotted border-border border-x-0 gap-3 px-4 py-2.5 text-sm rounded-sm transition-all relative",
            pathname === "/docs"
              ? "bg-muted text-foreground font-medium z-10"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:z-10",
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
          const isActive = pathname === provider.href;

          return (
            <Link
              key={provider.href}
              href={provider.isEnabled ? provider.href : "#"}
              className={cn(
                "group flex items-center border border-dotted border-border border-x-0 gap-3 px-4 py-2.5 text-sm rounded-sm transition-all relative",
                isActive
                  ? "bg-muted text-foreground font-medium z-10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:z-10",
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

              {/* Badge or count */}
              {provider.isEnabled ? (
                provider.elementsCount > 0 && (
                  <Badge
                    variant="secondary"
                    className={cn(
                      "h-5 px-1.5 text-xs font-normal",
                      isActive &&
                        "bg-primary/20 text-primary border-primary/30",
                    )}
                  >
                    {provider.elementsCount}
                  </Badge>
                )
              ) : (
                <Badge
                  variant="outline"
                  className="h-5 px-1.5 text-[10px] font-normal"
                >
                  Soon
                </Badge>
              )}
            </Link>
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
      <div className="md:hidden fixed top-16 left-4 z-40">
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
      <aside className="md:transition-all border-r border-border border-dotted top-[55px] md:flex hidden md:w-[268px] lg:w-[286px] overflow-y-auto fixed h-[calc(100dvh-55px)] pb-2 flex-col justify-between left-0 z-40 bg-background">
        <ProviderList />
      </aside>
    </>
  );
}
