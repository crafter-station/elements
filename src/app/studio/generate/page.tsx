"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { CodeInput } from "./components/code-input";
import { AnalysisView } from "./components/analysis-view";
import { GenerationReview } from "./components/generation-review";
import type { RegistryItemType } from "@/lib/studio/types";

interface GeneratedMetadata {
  name: string;
  type: RegistryItemType;
  title: string;
  description: string;
  docs: string;
  dependencies: string[];
  registryDependencies: string[];
  categories: string[];
}

export default function GeneratePage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [fileName, setFileName] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [metadata, setMetadata] = useState<GeneratedMetadata | null>(null);
  const [step, setStep] = useState<"input" | "analysis" | "review">("input");

  const handleAnalyze = async () => {
    if (!code.trim()) return;

    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/studio/generate-metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, fileName }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze code");
      }

      const data = await response.json();
      setMetadata(data);
      setStep("analysis");
    } catch (error) {
      console.error("Analysis error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleMetadataUpdate = (updated: GeneratedMetadata) => {
    setMetadata(updated);
  };

  const handleContinueToReview = () => {
    if (metadata) {
      setStep("review");
    }
  };

  const handleBack = () => {
    if (step === "review") {
      setStep("analysis");
    } else if (step === "analysis") {
      setStep("input");
      setMetadata(null);
    }
  };

  const handleSaveToBuilder = (registryId?: string) => {
    if (!metadata) return;

    const params = new URLSearchParams({
      name: metadata.name,
      type: metadata.type,
      title: metadata.title,
      description: metadata.description,
      docs: metadata.docs,
      dependencies: JSON.stringify(metadata.dependencies),
      registryDependencies: JSON.stringify(metadata.registryDependencies),
      categories: JSON.stringify(metadata.categories),
      code,
    });

    if (registryId) {
      router.push(`/studio/builder/${registryId}?${params.toString()}`);
    } else {
      router.push(`/studio/builder?${params.toString()}`);
    }
  };

  const steps = [
    { key: "input", label: "Input" },
    { key: "analysis", label: "Analysis" },
    { key: "review", label: "Review" },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b border-border/50 bg-muted/30">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            AI Generator
          </p>
          <h1 className="mt-2 font-pixel text-2xl tracking-tight">
            Generate Metadata
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Paste component code and let AI generate registry metadata
          </p>

          <div className="mt-6 flex items-center gap-1">
            {steps.map((s, i) => (
              <div key={s.key} className="flex items-center gap-1">
                <div
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium transition-colors ${
                    step === s.key
                      ? "bg-foreground text-background"
                      : steps.indexOf(steps.find((x) => x.key === step)!) > i
                        ? "bg-foreground/10 text-foreground"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  <span className="font-mono">{i + 1}</span>
                  {s.label}
                </div>
                {i < steps.length - 1 && (
                  <div className="mx-1 h-px w-4 bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-4xl px-6 py-8">
        {step === "input" && (
          <div className="space-y-4">
            <CodeInput
              code={code}
              fileName={fileName}
              onCodeChange={setCode}
              onFileNameChange={setFileName}
            />
            <Button
              onClick={handleAnalyze}
              disabled={!code.trim() || isAnalyzing}
              className="gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="size-3.5" />
                  Analyze with AI
                </>
              )}
            </Button>
          </div>
        )}

        {step === "analysis" && metadata && (
          <div className="space-y-4">
            <AnalysisView metadata={metadata} onUpdate={handleMetadataUpdate} />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleBack} className="gap-1.5">
                <ArrowLeft className="size-3" />
                Back
              </Button>
              <Button size="sm" onClick={handleContinueToReview} className="ml-auto gap-1.5">
                Continue
                <ArrowRight className="size-3" />
              </Button>
            </div>
          </div>
        )}

        {step === "review" && metadata && (
          <div className="space-y-4">
            <GenerationReview
              metadata={metadata}
              code={code}
              onSave={handleSaveToBuilder}
            />
            <Button variant="outline" size="sm" onClick={handleBack} className="gap-1.5">
              <ArrowLeft className="size-3" />
              Back
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
