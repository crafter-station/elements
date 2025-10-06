"use client";

import { useState } from "react";

import { BugIcon, ChevronDownIcon, ChevronRightIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface DebugPanelProps {
  // biome-ignore lint/suspicious/noExplicitAny: Clerk types are complex and change frequently
  signUp?: any;
  // biome-ignore lint/suspicious/noExplicitAny: Clerk types are complex and change frequently
  signIn?: any;
  requiredFields?: string[];
  supportedIdentifiers?: string[];
  // biome-ignore lint/suspicious/noExplicitAny: Social provider types are complex and vary
  socialProviders?: any[];
  step?: string;
  isWaitlistMode?: boolean;
  type: "sign-up" | "sign-in";
}

export function ClerkDebugPanel({
  signUp,
  signIn,
  requiredFields = [],
  supportedIdentifiers = [],
  socialProviders = [],
  step,
  isWaitlistMode = false,
  type,
}: DebugPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const resource = type === "sign-up" ? signUp : signIn;

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <Card className="mt-4 border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/20">
        <CardHeader className="pb-2">
          <CollapsibleTrigger className="flex items-center justify-between w-full p-0 text-left hover:opacity-80 transition-opacity">
            <div className="flex items-center space-x-2">
              <BugIcon className="w-4 h-4 text-orange-600" />
              <CardTitle className="text-sm text-orange-800 dark:text-orange-200">
                Debug Panel - {type.charAt(0).toUpperCase() + type.slice(1)}{" "}
                Configuration
              </CardTitle>
            </div>
            {isExpanded ? (
              <ChevronDownIcon className="w-4 h-4 text-orange-600" />
            ) : (
              <ChevronRightIcon className="w-4 h-4 text-orange-600" />
            )}
          </CollapsibleTrigger>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="pt-0 pb-3 space-y-3 text-sm">
            {/* Current State */}
            <div>
              <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-1.5">
                Current State
              </h4>
              <div className="grid grid-cols-2 gap-1.5">
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge
                    variant={
                      resource?.status === "complete" ? "default" : "secondary"
                    }
                  >
                    {resource?.status || "Not initialized"}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground">Step:</span>
                  <Badge variant="outline">{step || "form"}</Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground">Resource ID:</span>
                  <code className="text-xs bg-muted px-1 rounded">
                    {resource?.id || "None"}
                  </code>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground">Waitlist Mode:</span>
                  <Badge variant={isWaitlistMode ? "destructive" : "outline"}>
                    {isWaitlistMode ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Sign-Up Specific */}
            {type === "sign-up" && (
              <>
                <div>
                  <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-1.5">
                    Required Fields
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {requiredFields.length > 0 ? (
                      requiredFields.map((field) => (
                        <Badge
                          key={field}
                          variant="default"
                          className="text-xs"
                        >
                          {field}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground text-xs">
                        No required fields detected
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-1.5">
                    Missing Fields
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {resource?.missingFields?.length > 0 ? (
                      resource.missingFields.map((field: string) => (
                        <Badge
                          key={field}
                          variant="destructive"
                          className="text-xs"
                        >
                          {field}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground text-xs">
                        No missing fields
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-1.5">
                    Unverified Fields
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {resource?.unverifiedFields?.length > 0 ? (
                      resource.unverifiedFields.map((field: string) => (
                        <Badge
                          key={field}
                          variant="secondary"
                          className="text-xs"
                        >
                          {field}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground text-xs">
                        No unverified fields
                      </span>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Sign-In Specific */}
            {type === "sign-in" && (
              <div>
                <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-1.5">
                  Supported Identifiers
                </h4>
                <div className="flex flex-wrap gap-1">
                  {supportedIdentifiers.length > 0 ? (
                    supportedIdentifiers.map((identifier) => (
                      <Badge
                        key={identifier}
                        variant="default"
                        className="text-xs"
                      >
                        {identifier}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-xs">
                      No supported identifiers detected
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Social Providers */}
            <div>
              <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-1.5">
                Social Providers ({socialProviders.length})
              </h4>
              <div className="flex flex-wrap gap-1">
                {socialProviders.length > 0 ? (
                  socialProviders.map((provider) => (
                    <Badge
                      key={provider.strategy}
                      variant="outline"
                      className="text-xs"
                    >
                      {provider.strategy.replace("oauth_", "")}
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground text-xs">
                    No social providers configured
                  </span>
                )}
              </div>
            </div>

            {/* Raw Object Preview */}
            <div>
              <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-1.5">
                Raw Object
              </h4>
              <details className="bg-muted rounded p-2">
                <summary className="cursor-pointer text-xs font-medium">
                  View {type} object (click to expand)
                </summary>
                <pre className="text-xs mt-1.5 overflow-x-auto">
                  {JSON.stringify(
                    resource
                      ? {
                          id: resource.id,
                          status: resource.status,
                          ...(type === "sign-up"
                            ? {
                                requiredFields: resource.requiredFields,
                                missingFields: resource.missingFields,
                                unverifiedFields: resource.unverifiedFields,
                                emailAddress: resource.emailAddress,
                                username: resource.username,
                                firstName: resource.firstName,
                                lastName: resource.lastName,
                              }
                            : {
                                supportedIdentifiers:
                                  resource.supportedIdentifiers,
                                supportedFirstFactors:
                                  resource.supportedFirstFactors?.map(
                                    (f: { strategy: string }) => f.strategy,
                                  ),
                              }),
                        }
                      : null,
                    null,
                    2,
                  )}
                </pre>
              </details>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
