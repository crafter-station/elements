"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Copy,
  ExternalLink,
  Github,
  Globe,
  Loader2,
  Lock,
  Plus,
  Building2,
  User,
  Terminal,
  Pencil,
  X,
} from "lucide-react";
import { parseDescription } from "@/lib/studio/parse-description";
import { ITEM_TYPE_LABELS } from "@/lib/studio/constants";
import type { RegistryItemType } from "@/lib/studio/types";
import type { GitHubConnection } from "../page";

interface CreationWizardProps {
  github: GitHubConnection;
}

interface WizardItem {
  name: string;
  type: RegistryItemType;
  checked: boolean;
}

interface CreationResult {
  id: string;
  repoUrl: string;
  pagesUrl: string;
  itemCount: number;
}

type DeployStep = {
  label: string;
  status: "pending" | "active" | "done" | "error";
};

export function CreationWizard({ github }: CreationWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const userLogin = github.user?.login ?? "";
  const orgs = github.orgs ?? [];
  const isGithubReady = github.status === "connected" && !!userLogin;

  const [description, setDescription] = useState("");

  const [registryName, setRegistryName] = useState("");
  const [registryDescription, setRegistryDescription] = useState("");
  const [items, setItems] = useState<WizardItem[]>([]);
  const [isPublic, setIsPublic] = useState(true);
  const [repoName, setRepoName] = useState("");
  const [repoManuallyEdited, setRepoManuallyEdited] = useState(false);
  const [namespace, setNamespace] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [newItemName, setNewItemName] = useState("");

  const [deploySteps, setDeploySteps] = useState<DeployStep[]>([]);
  const [result, setResult] = useState<CreationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (userLogin && !namespace) {
      setNamespace(userLogin);
    }
  }, [userLogin, namespace]);

  useEffect(() => {
    if (step === 1 && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [step]);

  const [aiLoading, setAiLoading] = useState(false);

  const handleStep1Submit = useCallback(async () => {
    if (!description.trim()) return;

    const parsed = parseDescription(description);

    setAiLoading(true);
    try {
      const res = await fetch("/api/studio/suggest-components", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: description.trim() }),
      });

      if (!res.ok) throw new Error("Failed to suggest");

      const suggested = await res.json();
      setRegistryName(suggested.registryName || parsed.name);
      setRegistryDescription(suggested.description || parsed.description);
      setItems(
        (suggested.components || []).map(
          (c: { name: string; type: RegistryItemType }) => ({
            name: c.name,
            type: c.type,
            checked: true,
          }),
        ),
      );
      if (!repoManuallyEdited) {
        setRepoName(suggested.registryName || parsed.name);
      }
    } catch {
      if (parsed.components.length > 0) {
        setRegistryName(parsed.name);
        setRegistryDescription(parsed.description);
        setItems(
          parsed.components.map((c) => ({
            name: c.name,
            type: c.type,
            checked: true,
          })),
        );
      } else {
        setRegistryName(parsed.name);
        setRegistryDescription(parsed.description);
        setItems([
          { name: "component-one", type: "registry:component", checked: true },
          { name: "component-two", type: "registry:component", checked: true },
        ]);
      }
      if (!repoManuallyEdited) {
        setRepoName(parsed.name);
      }
    } finally {
      setAiLoading(false);
    }
    setStep(2);
  }, [description, repoManuallyEdited]);

  const handleAddItem = useCallback(() => {
    const name = newItemName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    if (!name || items.some((i) => i.name === name)) return;
    setItems((prev) => [
      ...prev,
      { name, type: "registry:component", checked: true },
    ]);
    setNewItemName("");
  }, [newItemName, items]);

  const handleToggleItem = useCallback((name: string) => {
    setItems((prev) =>
      prev.map((i) => (i.name === name ? { ...i, checked: !i.checked } : i)),
    );
  }, []);

  const handleRemoveItem = useCallback((name: string) => {
    setItems((prev) => prev.filter((i) => i.name !== name));
  }, []);

  const handleDeploy = useCallback(async () => {
    const checkedItems = items.filter((i) => i.checked);
    if (!registryName || !repoName || checkedItems.length === 0) return;

    setStep(3);
    setError(null);

    const steps: DeployStep[] = [
      { label: "Creating GitHub repository", status: "active" },
      { label: "Pushing scaffold files", status: "pending" },
      { label: "Enabling GitHub Pages", status: "pending" },
      { label: "Saving registry", status: "pending" },
    ];
    setDeploySteps([...steps]);

    try {
      const advanceStep = (index: number) => {
        steps[index].status = "done";
        if (index + 1 < steps.length) {
          steps[index + 1].status = "active";
        }
        setDeploySteps([...steps]);
      };

      const response = await fetch(
        "/api/studio/registries/create-with-items",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: registryName,
            description: registryDescription || undefined,
            isPublic,
            repoName,
            org: namespace !== userLogin ? namespace : undefined,
            items: checkedItems.map((i) => ({ name: i.name, type: i.type })),
          }),
        },
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create registry");
      }

      const data = await response.json();

      for (let i = 0; i < steps.length; i++) {
        steps[i].status = "done";
      }
      setDeploySteps([...steps]);

      setResult({
        id: data.id,
        repoUrl: data.repoUrl,
        pagesUrl: data.pagesUrl,
        itemCount: data.itemCount,
      });
    } catch (err) {
      const failIndex = steps.findIndex((s) => s.status === "active");
      if (failIndex >= 0) {
        steps[failIndex].status = "error";
        setDeploySteps([...steps]);
      }
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }, [
    items,
    registryName,
    registryDescription,
    isPublic,
    repoName,
    namespace,
    userLogin,
  ]);

  const handleCopy = useCallback(
    (text: string) => {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    },
    [],
  );

  const checkedCount = items.filter((i) => i.checked).length;
  const owner = namespace;
  const installExample =
    result && checkedCount > 0
      ? `npx shadcn@latest add "${result.pagesUrl}${items.find((i) => i.checked)?.name}.json"`
      : "";

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-8">
      <div className="mb-8 flex items-center gap-3">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`flex size-6 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                step > s
                  ? "bg-foreground text-background"
                  : step === s
                    ? "border border-foreground bg-foreground text-background"
                    : "border border-border text-muted-foreground"
              }`}
            >
              {step > s ? <Check className="size-3" /> : s}
            </div>
            {s < 3 && (
              <div
                className={`h-px w-8 transition-colors ${step > s ? "bg-foreground" : "bg-border"}`}
              />
            )}
          </div>
        ))}
        <span className="ml-2 text-xs text-muted-foreground">
          {step === 1
            ? "Describe"
            : step === 2
              ? "Confirm"
              : result
                ? "Ready"
                : "Deploying"}
        </span>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="font-pixel text-lg tracking-tight">
              What are you building?
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Describe your registry in plain text. Component names will be
              auto-detected.
            </p>
          </div>

          <textarea
            ref={textareaRef}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.metaKey) {
                e.preventDefault();
                handleStep1Submit();
              }
            }}
            placeholder="E-commerce components: product-card, cart-drawer, checkout-form, price-display"
            rows={5}
            className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-ring"
            spellCheck={false}
          />

          <div className="space-y-2 rounded-lg border border-border/50 bg-muted/20 px-4 py-3">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Examples
            </p>
            {[
              "E-commerce components: product-card, cart-drawer, checkout-form",
              "A design system with button, input, select, dialog, and toast",
              "Dashboard hooks and utils: use-analytics, use-filters, data-table, chart-card",
            ].map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => setDescription(example)}
                className="block w-full text-left text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                &ldquo;{example}&rdquo;
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">
              Cmd+Enter to continue
            </span>
            <Button
              onClick={handleStep1Submit}
              disabled={!description.trim() || aiLoading}
              className="gap-1.5"
            >
              {aiLoading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Generating components...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="size-3.5" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep(1)}
              className="-ml-2 gap-1 text-xs text-muted-foreground"
            >
              <ArrowLeft className="size-3" />
              Back
            </Button>
          </div>

          <div>
            <h2 className="font-pixel text-lg tracking-tight">
              Confirm your registry
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {checkedCount} component{checkedCount !== 1 ? "s" : ""} detected
              from your description. Toggle, add, or remove as needed.
            </p>
          </div>

          <div className="space-y-1 rounded-lg border border-border/50">
            {items.map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-3 border-b border-border/30 px-3 py-2.5 last:border-0"
              >
                <button
                  type="button"
                  onClick={() => handleToggleItem(item.name)}
                  className={`flex size-4 shrink-0 items-center justify-center rounded border transition-colors ${
                    item.checked
                      ? "border-foreground bg-foreground text-background"
                      : "border-border"
                  }`}
                  aria-label={`Toggle ${item.name}`}
                >
                  {item.checked && <Check className="size-2.5" />}
                </button>
                <span
                  className={`flex-1 font-mono text-sm ${!item.checked ? "text-muted-foreground line-through" : ""}`}
                >
                  {item.name}
                </span>
                <Badge variant="outline" className="text-[10px]">
                  {ITEM_TYPE_LABELS[item.type] || item.type.replace("registry:", "")}
                </Badge>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(item.name)}
                  className="rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={`Remove ${item.name}`}
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
            <div className="flex items-center gap-2 px-3 py-2">
              <Plus className="size-3 text-muted-foreground" />
              <input
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddItem();
                  }
                }}
                placeholder="Add component name..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/40"
              />
              {newItemName.trim() && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 px-2 text-xs"
                  onClick={handleAddItem}
                >
                  Add
                </Button>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-border/50">
            <button
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-muted/30"
            >
              <span className="text-xs font-medium">Settings</span>
              <ChevronDown
                className={`size-3 text-muted-foreground transition-transform ${showSettings ? "rotate-180" : ""}`}
              />
            </button>
            {showSettings && (
              <div className="space-y-4 border-t border-border/50 px-4 py-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">
                      Registry Name
                    </Label>
                    <Input
                      value={registryName}
                      onChange={(e) => {
                        setRegistryName(e.target.value);
                        if (!repoManuallyEdited) {
                          setRepoName(
                            e.target.value
                              .toLowerCase()
                              .replace(/[^a-z0-9]+/g, "-")
                              .replace(/^-+|-+$/g, ""),
                          );
                        }
                      }}
                      className="h-8 font-mono text-xs"
                    />
                  </div>
                  <div className="flex items-end gap-3 pb-0.5">
                    <div className="flex items-center gap-2">
                      <Switch
                        id="public-toggle"
                        checked={isPublic}
                        onCheckedChange={setIsPublic}
                      />
                      <Label
                        htmlFor="public-toggle"
                        className="flex items-center gap-1.5 text-xs"
                      >
                        {isPublic ? (
                          <>
                            <Globe className="size-3" /> Public
                          </>
                        ) : (
                          <>
                            <Lock className="size-3" /> Private
                          </>
                        )}
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    GitHub Repository
                  </Label>
                  <div className="flex items-center gap-0">
                    {orgs.length > 0 ? (
                      <Select value={namespace} onValueChange={setNamespace}>
                        <SelectTrigger className="h-8 w-auto gap-1 rounded-r-none border-r-0 px-2 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={userLogin}>
                            <span className="flex items-center gap-2">
                              <User className="size-3" />
                              {userLogin}
                            </span>
                          </SelectItem>
                          {orgs.map((org) => (
                            <SelectItem key={org.login} value={org.login}>
                              <span className="flex items-center gap-2">
                                <Building2 className="size-3" />
                                {org.login}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className="flex h-8 items-center rounded-l-md border border-r-0 border-input bg-muted/50 px-2 text-xs text-muted-foreground">
                        {namespace}
                      </span>
                    )}
                    <span className="flex h-8 items-center border-y border-input bg-muted/50 px-1 text-xs text-muted-foreground">
                      /
                    </span>
                    <Input
                      value={repoName}
                      onChange={(e) => {
                        setRepoName(e.target.value);
                        setRepoManuallyEdited(true);
                      }}
                      className="h-8 rounded-l-none font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Description
                  </Label>
                  <Input
                    value={registryDescription}
                    onChange={(e) => setRegistryDescription(e.target.value)}
                    placeholder="Optional description"
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            )}
          </div>

          {repoName && (
            <p className="text-[11px] text-muted-foreground">
              Creates{" "}
              <code className="font-mono">
                github.com/{owner}/{repoName}
              </code>{" "}
              with {checkedCount} placeholder component
              {checkedCount !== 1 ? "s" : ""} and GitHub Pages.
            </p>
          )}

          <div className="flex items-center justify-end gap-3">
            {!isGithubReady && github.status !== "loading" && (
              <span className="text-xs text-destructive">
                Connect GitHub to create a registry
              </span>
            )}
            <Button
              onClick={handleDeploy}
              disabled={checkedCount === 0 || !registryName || !repoName || !isGithubReady}
              className="gap-1.5"
            >
              {github.status === "loading" ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  Create Registry
                  <ArrowRight className="size-3.5" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div>
            <h2 className="font-pixel text-lg tracking-tight">
              {result ? "Your registry is ready" : error ? "Something went wrong" : "Setting up your registry..."}
            </h2>
          </div>

          <div className="space-y-2">
            {deploySteps.map((ds) => (
              <div
                key={ds.label}
                className="flex items-center gap-3 text-sm"
              >
                {ds.status === "done" ? (
                  <Check className="size-4 text-green-500" />
                ) : ds.status === "active" ? (
                  <Loader2 className="size-4 animate-spin text-muted-foreground" />
                ) : ds.status === "error" ? (
                  <X className="size-4 text-destructive" />
                ) : (
                  <div className="size-4 rounded-full border border-border" />
                )}
                <span
                  className={
                    ds.status === "done"
                      ? "text-foreground"
                      : ds.status === "error"
                        ? "text-destructive"
                        : "text-muted-foreground"
                  }
                >
                  {ds.label}
                </span>
              </div>
            ))}
          </div>

          {error && (
            <div className="space-y-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
              <p className="text-sm text-destructive">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setStep(2);
                  setError(null);
                }}
                className="gap-1.5"
              >
                <ArrowLeft className="size-3" />
                Go back and retry
              </Button>
            </div>
          )}

          {result && (
            <div className="space-y-6">
              <div className="rounded-lg border border-border/50 bg-muted/20 p-4">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Registry URL
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <code className="flex-1 truncate font-mono text-sm">
                    {result.pagesUrl}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 gap-1 px-2 text-xs"
                    onClick={() => handleCopy(result.pagesUrl)}
                  >
                    {copied ? (
                      <Check className="size-3" />
                    ) : (
                      <Copy className="size-3" />
                    )}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Install a component
                </p>
                <div className="flex items-start gap-2 rounded-lg border border-border/50 bg-card p-3">
                  <Terminal className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                  <code className="flex-1 break-all font-mono text-xs leading-relaxed text-muted-foreground">
                    {installExample}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 shrink-0 px-1.5"
                    onClick={() => handleCopy(installExample)}
                    aria-label="Copy install command"
                  >
                    <Copy className="size-3" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Next steps
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    1. Clone the repo and replace placeholder code with your
                    components
                  </p>
                  <p>2. Push changes to trigger GitHub Pages deployment</p>
                  <p>
                    3. Or edit directly in the browser using the visual editor
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  onClick={() =>
                    router.push(`/studio/builder/${result.id}`)
                  }
                  className="gap-1.5"
                >
                  <Pencil className="size-3.5" />
                  Open Editor
                </Button>
                <Button variant="outline" asChild className="gap-1.5">
                  <a
                    href={result.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="size-3.5" />
                    View Repo
                    <ExternalLink className="size-2.5" />
                  </a>
                </Button>
                <Button
                  variant="outline"
                  className="gap-1.5"
                  onClick={() =>
                    handleCopy(
                      `gh repo clone ${owner}/${repoName}`,
                    )
                  }
                >
                  <Terminal className="size-3.5" />
                  Clone
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
