"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { GitBranch, Loader2, ExternalLink, CheckCircle2 } from "lucide-react";

interface ExportDialogProps {
  registryId: string;
  registrySlug: string;
  githubRepoUrl?: string | null;
}

type ExportState =
  | { step: "form" }
  | { step: "exporting" }
  | { step: "done"; repoUrl: string; pagesUrl: string };

export function ExportDialog({
  registryId,
  registrySlug,
  githubRepoUrl,
}: ExportDialogProps) {
  const [open, setOpen] = useState(false);
  const [repoName, setRepoName] = useState(registrySlug);
  const [isPrivate, setIsPrivate] = useState(false);
  const [state, setState] = useState<ExportState>({ step: "form" });
  const [error, setError] = useState<string | null>(null);

  async function handleExport() {
    setState({ step: "exporting" });
    setError(null);

    try {
      const res = await fetch(
        `/api/studio/registries/${registryId}/export`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ repoName, isPrivate }),
        },
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Export failed");
      }

      const data = await res.json();
      setState({ step: "done", repoUrl: data.repoUrl, pagesUrl: data.pagesUrl });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed");
      setState({ step: "form" });
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      setState({ step: "form" });
      setError(null);
    }
  }

  if (githubRepoUrl) {
    return (
      <a
        href={githubRepoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
      >
        <GitBranch className="size-4" />
        GitHub
        <ExternalLink className="size-3" />
      </a>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <GitBranch className="size-4" />
          Export to GitHub
        </Button>
      </DialogTrigger>
      <DialogContent>
        {state.step === "done" ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle2 className="size-5 text-green-500" />
                Exported Successfully
              </DialogTitle>
              <DialogDescription>
                Your registry is now live on GitHub. The first deploy will start
                automatically via GitHub Actions.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div className="rounded-md border p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Repository</span>
                  <a
                    href={state.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium hover:underline"
                  >
                    {state.repoUrl.replace("https://github.com/", "")}
                    <ExternalLink className="size-3" />
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Pages URL</span>
                  <a
                    href={state.pagesUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium hover:underline"
                  >
                    {state.pagesUrl.replace("https://", "")}
                    <ExternalLink className="size-3" />
                  </a>
                </div>
              </div>
              <div className="rounded-md border p-3 bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">Install command</p>
                <code className="text-xs font-mono">
                  npx shadcn@latest add &quot;{state.pagesUrl}/r/&#123;name&#125;.json&quot;
                </code>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
              <Button asChild>
                <a href={state.repoUrl} target="_blank" rel="noopener noreferrer">
                  Open Repository
                  <ExternalLink className="size-4" />
                </a>
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Export to GitHub</DialogTitle>
              <DialogDescription>
                Create a GitHub repository with your registry. It will auto-deploy
                to GitHub Pages so anyone can install your components with the
                shadcn CLI.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="repo-name">Repository name</Label>
                <Input
                  id="repo-name"
                  value={repoName}
                  onChange={(e) => setRepoName(e.target.value)}
                  placeholder="my-registry"
                  disabled={state.step === "exporting"}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="private-toggle">Private repository</Label>
                  <p className="text-xs text-muted-foreground">
                    Private repos require GitHub Pro for Pages
                  </p>
                </div>
                <Switch
                  id="private-toggle"
                  checked={isPrivate}
                  onCheckedChange={setIsPrivate}
                  disabled={state.step === "exporting"}
                />
              </div>
              {error && (
                <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={state.step === "exporting"}
              >
                Cancel
              </Button>
              <Button
                onClick={handleExport}
                disabled={!repoName.trim() || state.step === "exporting"}
              >
                {state.step === "exporting" ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <GitBranch className="size-4" />
                    Export
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
