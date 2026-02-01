"use client";

import Link from "next/link";
import type * as React from "react";

import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useSidebar } from "../ui/sidebar";

interface AppLogoProps {
  /**
   * The logo element to display (image, icon, or text)
   */
  logo?: React.ReactNode;
  /**
   * The href for the logo link
   */
  href?: string;
  /**
   * Whether to show the search button
   */
  showSearch?: boolean;
  /**
   * Callback when search button is clicked
   */
  onSearchClick?: () => void;
  /**
   * Custom class name
   */
  className?: string;
}

export function AppLogo({
  logo,
  href = "/",
  showSearch = true,
  onSearchClick,
  className,
}: AppLogoProps) {
  const { state } = useSidebar();

  // Hide when sidebar is collapsed
  if (state === "collapsed") return null;

  return (
    <div
      data-slot="app-logo"
      className={`flex items-center justify-between px-2 py-2 ${className ?? ""}`}
    >
      <Link href={href} className="flex items-center">
        {logo ?? <span className="text-lg font-semibold">Dashboard</span>}
      </Link>
      {showSearch && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 cursor-pointer"
          onClick={onSearchClick}
        >
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
      )}
    </div>
  );
}
