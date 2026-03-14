"use client";

import { useState } from "react";

import { Database } from "lucide-react";

import { RedisLogo } from "@/components/ui/logos/redis";
import { SupabaseLogo } from "@/components/ui/logos/supabase";
import { UpstashLogo } from "@/components/ui/logos/upstash";
import { VercelLogo } from "@/components/ui/logos/vercel";

import { PageComments } from "@/registry/default/blocks/collaboration/page-comments/components/elements/page-comments";
import { inMemoryAdapter } from "@/registry/default/blocks/collaboration/page-comments/components/elements/page-comments-adapters";

const adapter = inMemoryAdapter();

const ADAPTERS = [
  {
    id: "memory" as const,
    label: "In-Memory",
    icon: <Database className="size-4" />,
  },
  {
    id: "kv" as const,
    label: "Vercel KV",
    icon: <VercelLogo className="size-4" />,
  },
  {
    id: "upstash" as const,
    label: "Upstash",
    icon: <UpstashLogo className="size-4" />,
  },
  {
    id: "supabase" as const,
    label: "Supabase",
    icon: <SupabaseLogo className="size-4" />,
  },
  {
    id: "redis" as const,
    label: "Redis",
    icon: <RedisLogo className="size-4" />,
  },
] as const;

export default function PageCommentsDemo() {
  const [activeAdapter, setActiveAdapter] =
    useState<(typeof ADAPTERS)[number]["id"]>("memory");

  return (
    <div className="relative w-full min-h-[500px] border rounded-xl overflow-hidden bg-background">
      <div className="border-b px-4 py-3 flex items-center gap-3">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Adapter
        </span>
        <div className="flex items-center gap-1">
          {ADAPTERS.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setActiveAdapter(a.id)}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs transition-all ${
                activeAdapter === a.id
                  ? "bg-foreground text-background font-medium shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {a.icon}
              <span className="hidden sm:inline">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="relative p-6 md:p-10">
        <article className="prose dark:prose-invert max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold tracking-tight">
            Building Modern Web Applications
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            The landscape of web development has evolved dramatically over the
            past decade. Modern frameworks like Next.js, combined with tools
            like TypeScript and Tailwind CSS, have transformed how we build and
            deploy applications. The focus has shifted from just shipping
            features to creating delightful developer experiences.
          </p>
          <h2 className="text-xl font-semibold mt-8">
            Component-Driven Architecture
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Components are the building blocks of modern UIs. By composing
            small, reusable pieces together, we can create complex interfaces
            that remain maintainable and testable. The shadcn/ui approach takes
            this further by giving you ownership of every component in your
            project.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Select any text in this article to leave a comment, or click the
            Comment button in the toolbar below to pin a comment anywhere on the
            page. Try the keyboard shortcuts: C to toggle comment mode, arrow
            keys to navigate, Escape to dismiss.
          </p>
        </article>

        <PageComments
          pageId="demo-page"
          adapter={adapter}
          contentSelector=".prose"
          user={{ name: "Hunter", color: "#E5534B" }}
        />
      </div>
    </div>
  );
}
