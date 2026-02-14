"use client";

import { useState, useEffect, useCallback } from "react";
import {
  GitBranch,
  ExternalLink,
  Loader2,
  Check,
  AlertTriangle,
  ArrowUpFromLine,
  ArrowDownToLine,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface GitHubSyncBarProps {
  registryId: string;
  githubRepoUrl: string;
}

interface SyncStatus {
  hasRemoteChanges: boolean;
  lastSynced?: string;
  remoteCommit?: string;
  localCommit?: string;
}

export function GitHubSyncBar({ registryId, githubRepoUrl }: GitHubSyncBarProps) {
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPushing, setIsPushing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pushMessage, setPushMessage] = useState<string | null>(null);
  const [showForceOptions, setShowForceOptions] = useState(false);

  const fetchSyncStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/studio/registries/${registryId}/sync-status`);

      if (!response.ok) {
        throw new Error("Failed to fetch sync status");
      }

      const data = await response.json();
      setSyncStatus(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [registryId]);

  useEffect(() => {
    fetchSyncStatus();
  }, [fetchSyncStatus]);

  const handlePush = async (force = false) => {
    try {
      setIsPushing(true);
      setError(null);
      setShowForceOptions(false);
      setPushMessage(null);

      const response = await fetch(`/api/studio/registries/${registryId}/push-github`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ force }),
      });

      if (response.status === 409) {
        setShowForceOptions(true);
        setError("Remote has changed. Pull latest changes or force push.");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to push to GitHub");
      }

      const data = await response.json();

      if (data.message === "Nothing to push") {
        setPushMessage("Nothing to push");
        setTimeout(() => setPushMessage(null), 3000);
      } else {
        setPushMessage("Pushed!");
        setTimeout(() => setPushMessage(null), 3000);
        await fetchSyncStatus();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsPushing(false);
    }
  };

  const handlePull = () => {
    setPushMessage("Pull support coming soon");
    setTimeout(() => setPushMessage(null), 3000);
  };

  if (isLoading) {
    return (
      <div className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-sm">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <span className="text-muted-foreground">Checking sync status...</span>
      </div>
    );
  }

  if (error && !syncStatus) {
    return (
      <div className="inline-flex items-center gap-2 rounded-md border border-destructive bg-destructive/10 px-3 py-1.5 text-sm">
        <AlertTriangle className="h-4 w-4 text-destructive" />
        <span className="text-destructive">{error}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchSyncStatus}
          className="h-6 px-2"
        >
          Retry
        </Button>
      </div>
    );
  }

  const isSynced = syncStatus && !syncStatus.hasRemoteChanges;

  return (
    <div className="inline-flex items-center gap-3 rounded-md border border-border bg-background px-3 py-1.5">
      <div className="inline-flex items-center gap-2">
        {isSynced ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
        )}

        <span className="text-sm">
          {isSynced ? "Synced with GitHub" : "GitHub has newer commits"}
        </span>

        <a
          href={githubRepoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <GitBranch className="h-3 w-3" />
          <span className="max-w-[200px] truncate">{githubRepoUrl.split("/").slice(-2).join("/")}</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      <div className="flex items-center gap-2">
        {!isSynced && (
          <Button
            variant="outline"
            size="sm"
            onClick={handlePull}
            className="h-7 gap-1 text-xs"
          >
            <ArrowDownToLine className="h-3 w-3" />
            Pull Latest
          </Button>
        )}

        <Button
          variant="default"
          size="sm"
          onClick={() => handlePush(false)}
          disabled={isPushing}
          className="h-7 gap-1 text-xs"
        >
          {isPushing ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <ArrowUpFromLine className="h-3 w-3" />
          )}
          {isPushing ? "Pushing..." : "Push"}
        </Button>

        {showForceOptions && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePull}
              className="h-7 gap-1 text-xs"
            >
              <ArrowDownToLine className="h-3 w-3" />
              Pull Latest
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handlePush(true)}
              disabled={isPushing}
              className="h-7 gap-1 text-xs"
            >
              Push Anyway
            </Button>
          </div>
        )}
      </div>

      {pushMessage && (
        <span className="text-sm text-green-600">{pushMessage}</span>
      )}

      {error && syncStatus && (
        <span className="text-sm text-destructive">{error}</span>
      )}
    </div>
  );
}
