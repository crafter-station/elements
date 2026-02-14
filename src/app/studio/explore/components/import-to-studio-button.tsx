"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ImportToStudioButtonProps {
  registryUrl: string;
  registryHomepage?: string;
}

export function ImportToStudioButton({
  registryUrl,
  registryHomepage,
}: ImportToStudioButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const derivedGithubUrl =
    registryHomepage?.includes("github.com") ? registryHomepage : "";

  const [githubUrl, setGithubUrl] = useState(derivedGithubUrl);

  async function handleImport() {
    if (!githubUrl.trim()) {
      setError("GitHub URL is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/studio/registries/import-github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ githubUrl }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to import registry");
      }

      const data = await res.json();
      router.push(`/studio/builder/${data.registryId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Import to Studio
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Registry to Studio</DialogTitle>
          <DialogDescription>
            Enter the GitHub repository URL for this registry to import it into
            your Studio workspace.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="github-url">GitHub URL</Label>
            <Input
              id="github-url"
              placeholder="https://github.com/user/repo"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              disabled={loading}
            />
          </div>
          {registryUrl && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ExternalLink className="h-3 w-3" />
              <span>Registry: {registryUrl}</span>
            </div>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              "Import"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
