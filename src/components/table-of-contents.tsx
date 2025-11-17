"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface Heading {
  id: string;
  text: string;
  level: number;
  element: Element;
}

interface TableOfContentsProps {
  className?: string;
}

// Generate slug from text
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function TableOfContents({ className }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const updateHeadings = () => {
      // Get all headings from the page
      const elements = Array.from(
        document.querySelectorAll("article h2, article h3"),
      );

      const headingData: Heading[] = elements.map((element, index) => {
        const text = element.textContent || "";
        let id = element.id;

        // If heading doesn't have an ID, generate one
        if (!id) {
          id = `${slugify(text)}-${index}`;
          element.id = id;
        }

        return {
          id,
          text,
          level: Number(element.tagName.charAt(1)),
          element,
        };
      });

      setHeadings(headingData);

      // Set up intersection observer with better settings
      const observerCallback = (entries: IntersectionObserverEntry[]) => {
        // Find the first intersecting entry
        const intersecting = entries.find((entry) => entry.isIntersecting);
        if (intersecting) {
          setActiveId(intersecting.target.id);
        }
      };

      const observer = new IntersectionObserver(observerCallback, {
        rootMargin: "-100px 0px -66% 0px",
        threshold: 0,
      });

      elements.forEach((element) => {
        observer.observe(element);
      });

      return observer;
    };

    // Initial update
    let observer = updateHeadings();

    // Watch for DOM changes in the article
    const article = document.querySelector("article");
    const mutationObserver = new MutationObserver(() => {
      // Disconnect previous observer
      if (observer) {
        const elements = Array.from(
          document.querySelectorAll("article h2, article h3"),
        );
        elements.forEach((element) => {
          observer.unobserve(element);
        });
      }
      // Update headings with new observer
      observer = updateHeadings();
    });

    if (article) {
      mutationObserver.observe(article, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      if (observer) {
        const elements = Array.from(
          document.querySelectorAll("article h2, article h3"),
        );
        elements.forEach((element) => {
          observer.unobserve(element);
        });
      }
      mutationObserver.disconnect();
    };
  }, []);

  if (headings.length === 0) {
    return null;
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100; // Offset for fixed header
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });

      // Update active state immediately
      setActiveId(id);

      // Update URL hash
      window.history.pushState({}, "", `#${id}`);
    }
  };

  return (
    <nav className={cn("space-y-1", className)}>
      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-3">
        On This Page
      </p>
      <ul className="space-y-1 text-sm border-l border-border">
        {headings.map((heading, index) => {
          const isActive = activeId === heading.id;
          const isH3 = heading.level === 3;

          return (
            <li key={`${heading.id}-${index}`} className={cn(isH3 && "ml-3")}>
              <a
                href={`#${heading.id}`}
                onClick={(e) => handleClick(e, heading.id)}
                className={cn(
                  "block py-1 px-3 text-sm border-l-2 -ml-px transition-all duration-200",
                  isActive
                    ? "border-primary text-foreground font-medium"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
                )}
              >
                <span className="line-clamp-2">{heading.text}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
