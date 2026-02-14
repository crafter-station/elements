"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Github, Loader2, CheckCircle2 } from "lucide-react";

interface ImportGitHubDialogProps {
  prefilledUrl?: string;
}

type ImportState =
  | { step: "form" }
  | { step: "importing" }
  | { step: "done"; registryId: string; itemCount: number; fileCount: number };

export function ImportGitHubDialog({ prefilledUrl }: ImportGitHubDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [githubUrl, setGithubUrl] = useState(prefilledUrl || "");
  const [state, setState] = useState<ImportState>({ step: "form" });
  const [error, setError] = useState<string | null>(null);

  function isValidGitHubUrl(url: string): boolean {
    const pattern = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w-]+/;
    return pattern.test(url);
  }

  async function handleImport() {
    if (!isValidGitHubUrl(githubUrl)) {
      setError("Please enter a valid GitHub repository URL");
      return;
    }

    setState({ step: "importing" });
    setError(null);

    try {
      const res = await fetch("/api/studio/registries/import-github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ githubUrl }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Import failed");
      }

      const data = await res.json();
      setState({
        step: "done",
        registryId: data.registryId,
        itemCount: data.itemCount,
        fileCount: data.fileCount,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
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

  function handleOpenInBuilder() {
    if (state.step === "done") {
      router.push(`/studio/builder/${state.registryId}`);
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-9">
          <Github className="size-4" />
          Import from GitHub
        </Button>
      </DialogTrigger>
      <DialogContent>
        {state.step === "done" ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle2 className="size-5 text-green-500" />
                Imported Successfully
              </DialogTitle>
              <DialogDescription>
                Your GitHub registry has been imported and is ready to use in
                Studio.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div className="rounded-md border p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Items</span>
                  <span className="text-sm font-medium">{state.itemCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Files</span>
                  <span className="text-sm font-medium">{state.fileCount}</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
              <Button onClick={handleOpenInBuilder}>
                Open in Builder
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Import from GitHub</DialogTitle>
              <DialogDescription>
                Import an existing GitHub registry into Studio. Enter the URL of
                a repository containing a shadcn-compatible registry.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="github-url">GitHub Repository URL</Label>
                <Input
                  id="github-url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/owner/repo"
                  disabled={state.step === "importing"}
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
                disabled={state.step === "importing"}
              >
                Cancel
              </Button>
              <Button
                onClick={handleImport}
                disabled={!githubUrl.trim() || state.step === "importing"}
              >
                {state.step === "importing" ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Github className="size-4" />
                    Import
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
