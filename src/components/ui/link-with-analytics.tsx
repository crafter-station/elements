"use client";

import Link from "next/link";
import { forwardRef } from "react";

import { track } from "@vercel/analytics";

interface LinkWithAnalyticsProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
  trackingEvent?: string;
  trackingProperties?: Record<string, any>;
}

export const LinkWithAnalytics = forwardRef<
  HTMLAnchorElement,
  LinkWithAnalyticsProps
>(
  (
    {
      href,
      children,
      className,
      target,
      rel,
      onClick,
      trackingEvent,
      trackingProperties,
      ...props
    },
    ref,
  ) => {
    const handleClick = () => {
      // Fire analytics tracking if provided
      if (trackingEvent) {
        track(trackingEvent, trackingProperties);
      }

      // Call additional onClick handler if provided
      if (onClick) {
        onClick();
      }
    };

    return (
      <Link
        href={href}
        className={className}
        target={target}
        rel={rel}
        onClick={handleClick}
        ref={ref}
        {...props}
      >
        {children}
      </Link>
    );
  },
);

LinkWithAnalytics.displayName = "LinkWithAnalytics";
