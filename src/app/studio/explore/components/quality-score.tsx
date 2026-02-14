"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { QualityBreakdown } from "../../lib/quality-scorer";
import { Check, X } from "lucide-react";

interface QualityScoreProps {
  breakdown: QualityBreakdown;
}

export function QualityScore({ breakdown }: QualityScoreProps) {
  const { score, checks } = breakdown;

  const scoreColor =
    score >= 70
      ? "text-green-600"
      : score >= 40
        ? "text-yellow-600"
        : "text-red-600";

  const scoreBg =
    score >= 70
      ? "bg-green-100 text-green-800 border-green-200"
      : score >= 40
        ? "bg-yellow-100 text-yellow-800 border-yellow-200"
        : "bg-red-100 text-red-800 border-red-200";

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Quality Score:</span>
        <Badge variant="outline" className={scoreBg}>
          {score}/100
        </Badge>
      </div>

      <Card>
        <CardContent className="pt-4">
          <div className="space-y-2">
            {checks.map((check) => (
              <div key={check.name} className="flex items-start gap-2 text-sm">
                {check.passed ? (
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <X className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={
                        check.passed
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }
                    >
                      {check.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {check.passed ? `+${check.points}` : `0`}pts
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {check.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
