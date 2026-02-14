"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Loader2 } from "lucide-react";
import { CreationWizard } from "./components/creation-wizard";

interface GitHubOrg {
  login: string;
  avatar_url: string;
}

export interface GitHubConnection {
  status: "loading" | "connected" | "not-connected";
  user?: { login: string };
  orgs?: GitHubOrg[];
}

export default function CreateRegistryPage() {
  const [github, setGithub] = useState<GitHubConnection>({ status: "loading" });

  useEffect(() => {
    fetch("/api/studio/github/status")
      .then((res) => res.json())
      .then((data) => {
        if (data.connected) {
          setGithub({
            status: "connected",
            user: data.user,
            orgs: data.orgs || [],
          });
        } else {
          setGithub({ status: "not-connected" });
        }
      })
      .catch(() => {
        setGithub({ status: "not-connected" });
      });
  }, []);

  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b border-border/50 bg-muted/30">
        <div className="mx-auto max-w-2xl px-6 py-10">
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Builder
          </p>
          <h1 className="mt-2 font-pixel text-2xl tracking-tight">
            Create Registry
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Describe what you want, confirm components, deploy in seconds
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-2xl px-6 pt-4">
        {github.status === "loading" && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="size-3.5 animate-spin" />
            <span>Checking GitHub connection...</span>
          </div>
        )}
        {github.status === "connected" && github.user && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Github className="size-3.5" />
            <span>
              Connected as{" "}
              <span className="font-medium text-foreground">
                {github.user.login}
              </span>
            </span>
          </div>
        )}
        {github.status === "not-connected" && (
          <div className="flex items-center gap-2 text-xs">
            <Github className="size-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">GitHub not connected.</span>
            <Button asChild variant="link" size="sm" className="h-auto p-0 text-xs">
              <a href="/user">
                Connect in Settings
                <ExternalLink className="ml-1 size-2.5" />
              </a>
            </Button>
          </div>
        )}
      </div>

      <CreationWizard github={github} />
    </div>
  );
}
