import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs/server";
import {
  ArrowLeft,
  Download,
  Eye,
  Globe,
  Lock,
  Package,
} from "lucide-react";

import {
  getAnalytics,
  getItemsByRegistry,
  getRegistryById,
} from "@/lib/studio/db";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{
    registryId: string;
  }>;
}

export default async function RegistryAnalyticsPage({ params }: PageProps) {
  const { userId } = await auth.protect();
  const { registryId } = await params;

  const registry = await getRegistryById(registryId);

  if (!registry || registry.clerkUserId !== userId) {
    redirect("/studio/my-registries");
  }

  const [items, analytics] = await Promise.all([
    getItemsByRegistry(registryId),
    getAnalytics(registryId, 30),
  ]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b border-border/50 bg-muted/30">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="icon" className="size-7">
              <Link href="/studio/my-registries">
                <ArrowLeft className="size-3.5" />
              </Link>
            </Button>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                Analytics
              </p>
              <div className="mt-1 flex items-center gap-3">
                <h1 className="font-pixel text-2xl tracking-tight">
                  {registry.displayName || registry.name}
                </h1>
                {registry.isPublic ? (
                  <Badge variant="secondary" className="gap-1 text-[10px]">
                    <Globe className="size-2.5" />
                    Public
                  </Badge>
                ) : (
                  <Badge variant="outline" className="gap-1 text-[10px]">
                    <Lock className="size-2.5" />
                    Private
                  </Badge>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                <code className="font-mono text-xs">{registry.slug}</code>
                {registry.description && ` — ${registry.description}`}
              </p>
            </div>
            <Button asChild size="sm" className="shrink-0">
              <Link href={`/studio/builder/${registry.id}`}>Edit Registry</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl px-6 py-8 space-y-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border/50 bg-card p-5">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Total Installs
              </p>
              <Download className="size-3.5 text-muted-foreground" />
            </div>
            <p className="mt-2 text-2xl font-semibold tracking-tight">
              {analytics.totalInstalls.toLocaleString()}
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Last 30 days
            </p>
          </div>

          <div className="rounded-lg border border-border/50 bg-card p-5">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Total Views
              </p>
              <Eye className="size-3.5 text-muted-foreground" />
            </div>
            <p className="mt-2 text-2xl font-semibold tracking-tight">
              {analytics.totalViews.toLocaleString()}
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Last 30 days
            </p>
          </div>

          <div className="rounded-lg border border-border/50 bg-card p-5">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Total Fetches
              </p>
              <Package className="size-3.5 text-muted-foreground" />
            </div>
            <p className="mt-2 text-2xl font-semibold tracking-tight">
              {analytics.totalFetches.toLocaleString()}
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Last 30 days
            </p>
          </div>
        </div>

        {analytics.topItems.length > 0 && (
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Top Items
            </p>
            <div className="mt-3 rounded-lg border border-border/50">
              <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-border/50 px-4 py-2.5">
                <span className="text-[11px] font-medium text-muted-foreground">
                  Component
                </span>
                <span className="text-[11px] font-medium text-muted-foreground">
                  Installs
                </span>
              </div>
              {analytics.topItems.map((item) => (
                <div
                  key={item.name}
                  className="grid grid-cols-[1fr_auto] gap-4 border-b border-border/50 px-4 py-2.5 last:border-0"
                >
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="text-sm tabular-nums text-muted-foreground">
                    {item.count.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {analytics.dailyCounts.length > 0 && (
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Daily Activity
            </p>
            <div className="mt-3 rounded-lg border border-border/50">
              <div className="grid grid-cols-[1fr_auto_auto] gap-6 border-b border-border/50 px-4 py-2.5">
                <span className="text-[11px] font-medium text-muted-foreground">
                  Date
                </span>
                <span className="text-[11px] font-medium text-muted-foreground">
                  Installs
                </span>
                <span className="text-[11px] font-medium text-muted-foreground">
                  Views
                </span>
              </div>
              {analytics.dailyCounts.map((day) => (
                <div
                  key={day.date}
                  className="grid grid-cols-[1fr_auto_auto] gap-6 border-b border-border/50 px-4 py-2.5 last:border-0"
                >
                  <span className="text-sm">
                    {new Date(day.date).toLocaleDateString()}
                  </span>
                  <span className="text-sm tabular-nums text-muted-foreground">
                    {day.installs}
                  </span>
                  <span className="text-sm tabular-nums text-muted-foreground">
                    {day.views}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Registry Items ({items.length})
          </p>
          {items.length === 0 ? (
            <div className="mt-3 flex min-h-[150px] flex-col items-center justify-center rounded-lg border border-dashed border-border/50">
              <p className="text-xs text-muted-foreground">
                No items in this registry
              </p>
              <Button asChild variant="link" size="sm" className="mt-1">
                <Link href={`/studio/builder/${registry.id}`}>
                  Add your first item
                </Link>
              </Button>
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border border-border/50 px-4 py-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {item.title || item.name}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-[10px] font-normal"
                        >
                          {item.type}
                        </Badge>
                      </div>
                      {item.description && (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
