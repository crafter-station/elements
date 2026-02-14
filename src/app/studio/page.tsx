import Link from "next/link";
import { Hammer, Compass, Sparkles, ArrowRight, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

const actions = [
  {
    title: "Create Registry",
    description: "Build a component registry backed by a GitHub repository",
    icon: Hammer,
    href: "/studio/builder",
    primary: true,
  },
  {
    title: "Explore Registries",
    description: "Browse and inspect any shadcn-compatible registry by URL",
    icon: Compass,
    href: "/studio/explore",
  },
  {
    title: "AI Generate",
    description: "Paste code and let AI generate registry metadata automatically",
    icon: Sparkles,
    href: "/studio/generate",
  },
];

export default function StudioDashboardPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b border-border/50 bg-muted/30">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Registry Studio
          </p>
          <h1 className="mt-3 font-pixel text-4xl tracking-tight">
            Build. Explore. Publish.
          </h1>
          <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
            The visual platform for creating and managing shadcn-compatible component registries.
            Build once, install anywhere.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <Button asChild size="sm" className="gap-2">
              <Link href="/studio/builder">
                Get Started
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="gap-2 font-mono text-xs">
              <Link href="/studio/explore">
                npx shadcn add
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl px-6 py-10">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Quick Actions
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group relative flex flex-col gap-4 rounded-lg border border-border/50 bg-card p-5 transition-all hover:border-foreground/20 hover:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-md bg-foreground/5 transition-colors group-hover:bg-foreground/10">
                  <action.icon className="size-4 text-foreground/70" />
                </div>
                <h3 className="text-sm font-semibold">{action.title}</h3>
              </div>
              <p className="text-[13px] leading-relaxed text-muted-foreground">
                {action.description}
              </p>
              <div className="mt-auto flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                Open
                <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            How It Works
          </p>
          <div className="mt-3 flex items-center gap-3 rounded-lg border border-border/50 bg-muted/30 px-4 py-3">
            <Terminal className="size-4 text-muted-foreground" />
            <code className="font-mono text-sm text-foreground/80">
              Build → Export to GitHub → Install via GitHub Pages
            </code>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Create your registry visually, then push to GitHub for self-hosted distribution
          </p>
        </div>
      </div>
    </div>
  );
}
