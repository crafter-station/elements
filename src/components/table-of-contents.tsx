"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  className?: string;
}

export function TableOfContents({ className }: TableOfContentsProps) {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
    const items: TocItem[] = Array.from(headings).map((heading) => ({
      id: heading.id,
      text: heading.textContent || "",
      level: parseInt(heading.tagName.charAt(1), 10),
    }));
    setToc(items);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0% -35% 0%",
        threshold: 0,
      },
    );

    for (const heading of headings) {
      observer.observe(heading);
    }

    return () => observer.disconnect();
  }, []);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  if (toc.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="text-sm font-semibold text-foreground mb-4">
        On this page
      </div>
      <nav className="space-y-1">
        {toc.map((item) => (
          <button
            type="button"
            key={item.id}
            onClick={() => handleClick(item.id)}
            className={cn(
              "block w-full text-left text-sm transition-colors hover:text-foreground",
              {
                "text-primary font-medium": activeId === item.id,
                "text-muted-foreground": activeId !== item.id,
                "pl-0": item.level === 1,
                "pl-4": item.level === 2,
                "pl-8": item.level === 3,
                "pl-12": item.level >= 4,
              },
            )}
          >
            {item.text}
          </button>
        ))}
      </nav>
    </div>
  );
}
