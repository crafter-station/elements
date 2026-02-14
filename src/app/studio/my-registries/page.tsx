import Link from "next/link";

import { auth } from "@clerk/nextjs/server";
import {
  ArrowRight,
  ExternalLink,
  GitBranch,
  Globe,
  Lock,
  Package,
  Plus,
} from "lucide-react";

import { getItemsByRegistry, getRegistriesByUser } from "@/lib/studio/db";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function MyRegistriesPage() {
  const { userId } = await auth.protect();

  const registries = await getRegistriesByUser(userId);

  const registriesWithItemCounts = await Promise.all(
    registries.map(async (registry) => {
      const items = await getItemsByRegistry(registry.id);
      return {
        ...registry,
        itemCount: items.length,
      };
    }),
  );

  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b border-border/50 bg-muted/30">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            My Registries
          </p>
          <div className="mt-2 flex items-center justify-between">
            <h1 className="font-pixel text-2xl tracking-tight">
              Your Registries
            </h1>
            {registriesWithItemCounts.length > 0 && (
              <Button asChild size="sm" className="gap-1.5">
                <Link href="/studio/builder">
                  <Plus className="size-3.5" />
                  Create New
                </Link>
              </Button>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage and monitor your published component registries
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl px-6 py-8">
        {registriesWithItemCounts.length === 0 ? (
          <div className="flex min-h-[350px] flex-col items-center justify-center rounded-lg border border-dashed border-border/50">
            <Package className="size-10 text-muted-foreground/50" />
            <h3 className="mt-4 text-sm font-medium">No registries yet</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Create your first component registry to get started
            </p>
            <Button asChild size="sm" className="mt-4 gap-1.5">
              <Link href="/studio/builder">
                <Plus className="size-3.5" />
                Create Your First Registry
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {registriesWithItemCounts.map((registry) => {
              return (
                <div
                  key={registry.id}
                  className="group rounded-lg border border-border/50 bg-card p-5 transition-colors hover:border-foreground/20 hover:bg-muted/50"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-medium">
                        {registry.displayName || registry.name}
                      </h3>
                      <div className="mt-1 flex items-center gap-2">
                        <code className="font-mono text-[11px] text-muted-foreground">
                          {registry.slug}
                        </code>
                        {registry.isPublic ? (
                          <Badge
                            variant="secondary"
                            className="gap-1 text-[10px]"
                          >
                            <Globe className="size-2.5" />
                            Public
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="gap-1 text-[10px]"
                          >
                            <Lock className="size-2.5" />
                            Private
                          </Badge>
                        )}
                        {registry.githubRepoUrl && (
                          <a
                            href={registry.githubRepoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Badge
                              variant="outline"
                              className="gap-1 text-[10px] hover:bg-accent"
                            >
                              <GitBranch className="size-2.5" />
                              GitHub
                            </Badge>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {registry.description && (
                    <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                      {registry.description}
                    </p>
                  )}

                  <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3">
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <p className="text-sm font-medium">
                          {registry.itemCount}
                        </p>
                        <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                          Items
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Button asChild variant="ghost" size="sm" className="h-7">
                        <Link
                          href={`/studio/my-registries/${registry.id}`}
                          className="gap-1"
                        >
                          <ExternalLink className="size-3" />
                          Analytics
                        </Link>
                      </Button>
                      <Button asChild size="sm" className="h-7 gap-1">
                        <Link href={`/studio/builder/${registry.id}`}>
                          Edit
                          <ArrowRight className="size-3" />
                        </Link>
                      </Button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
