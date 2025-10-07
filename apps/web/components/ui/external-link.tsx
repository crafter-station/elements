"use client";

import { forwardRef } from "react";

interface ExternalLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  stopPropagation?: boolean;
}

export const ExternalLink = forwardRef<HTMLAnchorElement, ExternalLinkProps>(
  ({ href, children, className, stopPropagation = false, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent) => {
      if (stopPropagation) {
        e.stopPropagation();
      }
    };

    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={handleClick}
        ref={ref}
        {...props}
      >
        {children}
      </a>
    );
  },
);

ExternalLink.displayName = "ExternalLink";
